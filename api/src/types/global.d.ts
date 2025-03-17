declare global {
  interface Window {
    BroadcastChannel: typeof BroadcastChannel;
    WebSocket: typeof WebSocket;
    Worker: typeof Worker;
    Storage: typeof Storage;
    CloseEvent: typeof CloseEvent;
  }
}

export {}; 