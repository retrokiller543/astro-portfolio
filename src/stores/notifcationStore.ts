// @stores/notificationStore.ts
import { atom } from "nanostores";
import { v4 as uuidv4 } from "uuid";

export interface Notification {
  id: string;
  message: string;
  timeout?: number;
}

export const notificationStore = atom<Notification[]>([]);

export function showNotification(message: string, timeout: number = 5000) {
  console.log("showNotification", message, timeout);

  const id = uuidv4(); // generate a unique ID based on timestamp
  const notification = { id, message, timeout };

  // Add the new notification to the store
  notificationStore.set([...notificationStore.get(), notification]);

  // Set a timeout to remove the notification after the specified duration
  setTimeout(() => {
    removeNotification(id);
  }, timeout);
}

export function removeNotification(id: string) {
  notificationStore.set(notificationStore.get().filter((n) => n.id !== id));
}
