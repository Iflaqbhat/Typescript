export function getProperty<T extends object, K extends keyof T>(
  value: T,
  key: K,
): T[K] {
  return value[key];
}
