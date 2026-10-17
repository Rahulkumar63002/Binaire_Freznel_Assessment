import { useEffect } from 'react';

export interface KeyboardActions {
  onUp: () => void;
  onDown: () => void;
  onPageUp: () => void;
  onPageDown: () => void;
  onHome: () => void;
  onEnd: () => void;
  onSelect: () => void;
  onInfo: () => void;
  onTerminate: () => void;
  onFilter: () => void;
  onClearOrEscape: () => void;
  onSortCpu: () => void;
  onSortMem: () => void;
  onSortPid: () => void;
  onSortName: () => void;
  onToggleReverse: () => void;
  onToggleTree: () => void;
  onFaster: () => void;
  onSlower: () => void;
  onHelp: () => void;
  onMenu: () => void;
  onAuth: () => void;
  onPreset: (presetNumber: number) => void;
}

export function useKeyboardNav(actions: KeyboardActions, isInputActive: boolean) {
 
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;

    const isTyping =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      target?.isContentEditable;

    if (isInputActive || isTyping) {
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
      case 'k':
        e.preventDefault();
        actions.onUp();
        break;

      case 'ArrowDown':
      case 'j':
        e.preventDefault();
        actions.onDown();
        break;

      case 'PageUp':
        e.preventDefault();
        actions.onPageUp();
        break;

      case 'PageDown':
        e.preventDefault();
        actions.onPageDown();
        break;

      case 'Home':
        e.preventDefault();
        actions.onHome();
        break;

      case 'End':
        e.preventDefault();
        actions.onEnd();
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        actions.onSelect();
        break;

      // case 'i':
      // case 'I':
      //   e.preventDefault();
      //   actions.onInfo();
      //   break;

      case 't':
      case 'T':
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        actions.onTerminate();
        break;

      case 'f':
      case 'F':
      case '/':
        e.preventDefault();
        actions.onFilter();
        break;

      case 'Escape':
        e.preventDefault();
        actions.onClearOrEscape();
        break;

      case 'c':
      case 'C':
        e.preventDefault();
        actions.onSortCpu();
        break;

      case 'm':
      case 'M':
        e.preventDefault();
        actions.onSortMem();
        break;

      case 'p':
      case 'P':
        e.preventDefault();
        actions.onSortPid();
        break;

      case 'n':
      case 'N':
        e.preventDefault();
        actions.onSortName();
        break;

      case 'r':
      case 'R':
        e.preventDefault();
        actions.onToggleReverse();
        break;

      case 'e':
      case 'E':
        e.preventDefault();
        actions.onToggleTree();
        break;

      case '+':
      case '=':
        e.preventDefault();
        actions.onFaster();
        break;

      case '-':
      case '_':
        e.preventDefault();
        actions.onSlower();
        break;

      case '?':
      case 'h':
      case 'H':
        e.preventDefault();
        actions.onHelp();
        break;

      case 'u':
      case 'U':
        e.preventDefault();
        actions.onAuth();
        break;

      case '1':
      case '2':
      case '3':
      case '4':
        e.preventDefault();
        actions.onPreset(parseInt(e.key, 10));
        break;
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [actions, isInputActive]);

}
