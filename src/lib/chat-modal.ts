import { useState, useEffect } from "react";

class ChatModalStore {
  private isOpen = false;
  private listeners = new Set<(open: boolean) => void>();

  getOpen() {
    return this.isOpen;
  }

  setOpen(val: boolean) {
    this.isOpen = val;
    this.listeners.forEach(listener => listener(val));
  }

  subscribe(listener: (open: boolean) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const chatModalStore = new ChatModalStore();

export function useChatModal() {
  const [open, setOpen] = useState(chatModalStore.getOpen());

  useEffect(() => {
    return chatModalStore.subscribe(setOpen);
  }, []);

  return [open, (val: boolean) => chatModalStore.setOpen(val)] as const;
}
