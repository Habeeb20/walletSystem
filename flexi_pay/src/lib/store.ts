import { useSyncExternalStore } from 'react';

/** Tiny external store (replaces Flutter's ChangeNotifier / Provider usage). */
export function createStore<T extends object>(initial: T) {
  let state = initial;
  const listeners = new Set<() => void>();

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };
  const get = () => state;
  const set = (partial: Partial<T>) => {
    state = { ...state, ...partial };
    listeners.forEach((l) => l());
  };
  const useStore = (): T => useSyncExternalStore(subscribe, get, get);

  return { get, set, subscribe, useStore };
}
