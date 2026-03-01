/**
 * Storage adapter: uses AsyncStorage when available, falls back to in-memory
 * when the native module is null (e.g. "Native module is null, cannot access legacy storage").
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

const memory = new Map<string, string>();
let useMemory = false;

export async function getItem(key: string): Promise<string | null> {
  if (useMemory) return memory.get(key) ?? null;
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    useMemory = true;
    return memory.get(key) ?? null;
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  if (useMemory) {
    memory.set(key, value);
    return;
  }
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    useMemory = true;
    memory.set(key, value);
  }
}

export async function removeItem(key: string): Promise<void> {
  if (useMemory) {
    memory.delete(key);
    return;
  }
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    useMemory = true;
    memory.delete(key);
  }
}
