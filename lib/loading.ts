let loaded = false;
const listeners = new Set<() => void>();

export function markLoadingDone(): void {
  if (loaded) return;
  loaded = true;
  for (const listener of listeners) listener();
  listeners.clear();
}

export function onLoadingDone(listener: () => void): void {
  if (loaded) {
    listener();
  } else {
    listeners.add(listener);
  }
}

export function offLoadingDone(listener: () => void): void {
  listeners.delete(listener);
}
