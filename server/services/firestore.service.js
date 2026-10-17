
import "dotenv/config";

import {
    getApps,
    initializeApp,
    cert,
} from "firebase-admin/app";

import {
    FieldValue,
    getFirestore,
} from "firebase-admin/firestore";

import config from "../../firebase-applet-config.json" with {
    type: "json",
};

import serviceAccount from "../../serviceAccountKey.json" with {
    type: "json",
};

const projectId =
    config.projectId || serviceAccount.project_id;

if (!projectId) {
    throw new Error("Firebase projectId is missing");
}

const emulatorHost =
    process.env.FIRESTORE_EMULATOR_HOST;

const isEmulator = Boolean(emulatorHost);

const app =
    getApps().length > 0
        ? getApps()[0]
        : initializeApp(
            isEmulator
                ? { projectId }
                : {
                    projectId,
                    credential: cert(serviceAccount),
                }
        );

const db = getFirestore(app);

console.log(
    isEmulator
        ? `Firestore Emulator connected: ${emulatorHost}`
        : "Firebase Cloud Firestore connected"
);

const allowedTypes = [
    "cpu",
    "gpu",
    "memory",
    "disk",
    "network",
];

export async function saveSensorReading(type, data) {
    if (!allowedTypes.includes(type)) {
        throw new Error(`Invalid sensor type: ${type}`);
    }

    const docRef = await db.collection("sensorReadings").add({
        type,
        data,
        recordedAt: FieldValue.serverTimestamp(),
    });

    return docRef.id;
}

export async function getRecentSensorReadings(
    type,
    requestedLimit = 20
) {
    if (!allowedTypes.includes(type)) {
        throw new Error(`Invalid sensor type: ${type}`);
    }

    const limit = Math.min(
        100,
        Math.max(1, Number(requestedLimit) || 20)
    );

    const snapshot = await db
        .collection("sensorReadings")
        .where("type", "==", type)
        .orderBy("recordedAt", "desc")
        .limit(limit)
        .get();

    return snapshot.docs.map((doc) => {
        const reading = doc.data();

        return {
            id: doc.id,
            ...reading,
            recordedAt:
                reading.recordedAt?.toDate?.()?.toISOString() ?? null,
        };
    });
}
