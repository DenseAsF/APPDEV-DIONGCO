// Type declarations for EventSource (built into React Native runtime)
declare class EventSource {
  constructor(url: string, eventSourceInitDict?: { headers?: Record<string, string> });
  onmessage: ((event: MessageEvent) => void) | null;
  onerror: ((event: any) => void) | null;
  onopen: (() => void) | null;
  close(): void;
  readonly readyState: number;
  readonly url: string;
  static readonly CONNECTING: number;
  static readonly OPEN: number;
  static readonly CLOSED: number;
}

interface MessageEvent {
  data: string;
  lastEventId: string;
  origin: string;
  type: string;
}

// atob/btoa are available in React Native runtime
declare function atob(data: string): string;
declare function btoa(data: string): string;
