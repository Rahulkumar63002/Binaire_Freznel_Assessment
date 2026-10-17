import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserAccount } from '../types';
import { OfflineStorage } from '../offline/OfflineStorage';

export type AuthStateCallback = (user: UserAccount | null) => void;

export class AuthService {
  private static currentUser: UserAccount | null = null;
  private static listeners: Set<AuthStateCallback> = new Set();
  private static isInitialized: boolean = false;
  private static readonly SESSION_KEY = 'firebase_auth_session';

  public static init(callback?: AuthStateCallback): () => void {
    if (callback) {
      this.listeners.add(callback);
      if (this.currentUser) {
        callback(this.currentUser);
      }
    }

    if (!this.isInitialized) {
      this.isInitialized = true;

      const cached = OfflineStorage.getItem<UserAccount | null>(this.SESSION_KEY, null);
      if (cached) {
        this.currentUser = cached;
        this.notifyListeners(cached);
      }

      onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          const userAccount = await this.mapFirebaseUserToAccount(fbUser);
          this.currentUser = userAccount;
          OfflineStorage.setItem(this.SESSION_KEY, userAccount);
          this.notifyListeners(userAccount);
        } else {
          this.currentUser = null;
          OfflineStorage.removeItem(this.SESSION_KEY);
          this.notifyListeners(null);
        }
      });
    }

    return () => {
      if (callback) {
        this.listeners.delete(callback);
      }
    };
  }

  public static getCurrentUser(): UserAccount | null {
    return this.currentUser;
  }

  public static async register(
    username: string,
    email: string,
    pass: string
  ): Promise<{ success: boolean; message: string; user?: UserAccount }> {
    try {
      if (!username || username.trim().length < 3) {
        return { success: false, message: 'Username must be at least 3 characters' };
      }
      if (!email || !email.includes('@')) {
        return { success: false, message: 'Valid email address required' };
      }
      if (!pass || pass.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
      }

      const userCred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const fbUser = userCred.user;

      await updateProfile(fbUser, { displayName: username.trim() });

      const newAccount: UserAccount = {
        uid: fbUser.uid,
        username: username.trim(),
        email: fbUser.email ?? email.trim(),
        role: 'admin',
        createdAt: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, 'users', fbUser.uid), {
          uid: newAccount.uid,
          username: newAccount.username,
          email: newAccount.email,
          role: newAccount.role,
          createdAt: newAccount.createdAt,
        });
      } catch (firestoreErr) {
        console.warn('Firestore profile write notice:', firestoreErr);
      }

      this.currentUser = newAccount;
      OfflineStorage.setItem(this.SESSION_KEY, newAccount);
      this.notifyListeners(newAccount);

      return {
        success: true,
        message: `Registered successfully with Firebase! Signed in as ${newAccount.username}`,
        user: newAccount,
      };
    } catch (err: any) {
      console.error('Firebase Auth Register Error:', err);
      let msg = err.message || 'Registration failed';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Invalid email address format.';
      } else if (err.code === 'auth/operation-not-allowed') {
        msg = 'Email/Password sign-in is not enabled in Firebase Console. Enable it in Authentication > Sign-in method.';
      } else if (err.code === 'auth/api-key-not-valid') {
        msg = 'Invalid Firebase API Key. Please verify your custom config in src/auth/firebase.ts.';
      }
      return { success: false, message: msg };
    }
  }

  public static async login(
    email: string,
    pass: string
  ): Promise<{ success: boolean; message: string; user?: UserAccount }> {
    try {
      if (!email || !pass) {
        return { success: false, message: 'Email and password are required' };
      }

      const userCred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const userAccount = await this.mapFirebaseUserToAccount(userCred.user);

      this.currentUser = userAccount;
      OfflineStorage.setItem(this.SESSION_KEY, userAccount);
      this.notifyListeners(userAccount);

      return {
        success: true,
        message: `Welcome back, ${userAccount.username}!`,
        user: userAccount,
      };
    } catch (err: any) {
      console.error('Firebase Auth Login Error:', err);
      let msg = err.message || 'Authentication failed';
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Invalid email address format.';
      }
      return { success: false, message: msg };
    }
  }

  public static async logout(): Promise<void> {
    try {
      await fbSignOut(auth);
    } catch (err) {
      console.error('Firebase SignOut Error:', err);
    }
    this.currentUser = null;
    OfflineStorage.removeItem(this.SESSION_KEY);
    this.notifyListeners(null);
  }

  private static async mapFirebaseUserToAccount(fbUser: FirebaseUser): Promise<UserAccount> {
    let username = fbUser.displayName || fbUser.email?.split('@')[0] || 'operator';
    let role: 'admin' | 'operator' = 'admin';

    try {
      const userSnap = await getDoc(doc(db, 'users', fbUser.uid));
      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.username) username = data.username;
        if (data.role) role = data.role;
      }
    } catch (e) {
      console.error(
        'Firestore User Profile Fetch Error:',
        e
      );
    }

    return {
      uid: fbUser.uid,
      username,
      email: fbUser.email || '',
      role,
      createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
    };
  }

  private static notifyListeners(user: UserAccount | null): void {
    this.listeners.forEach((fn) => fn(user));
  }
}
