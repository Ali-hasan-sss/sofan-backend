import WebSocket from "ws";
import { Server as HTTPServer } from "http";
export declare const setupWebSocket: (server: HTTPServer) => WebSocket.Server<typeof WebSocket, typeof import("http").IncomingMessage>;
export declare const publishNotification: (payload: unknown) => Promise<void>;
//# sourceMappingURL=websocket.d.ts.map