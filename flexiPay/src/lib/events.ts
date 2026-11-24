import { useEffect, useRef } from 'react';

type Handler = () => void;
const handlers = new Map<string, Set<Handler>>();

/**
 * Minimal event bus. Replaces Flutter's "pop with a result" pattern
 * (Navigator.pop(context, true) -> parent reloads) and screen-to-screen callbacks.
 */
export const events = {
  on(name: string, handler: Handler): () => void {
    if (!handlers.has(name)) handlers.set(name, new Set());
    handlers.get(name)!.add(handler);
    return () => {
      handlers.get(name)?.delete(handler);
    };
  },
  emit(name: string) {
    handlers.get(name)?.forEach((h) => h());
  },
};

export const WALLET_CHANGED = 'wallet:changed';
export const EMAIL_VERIFIED = 'register:emailVerified';

export function useEvent(name: string, handler: Handler) {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => events.on(name, () => ref.current()), [name]);
}
