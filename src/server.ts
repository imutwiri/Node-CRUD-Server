import http, { IncomingMessage, ServerResponse } from "node:http";
import { parse as parseUrl } from "node:url";

interface User {
    id: number;
    name: string;
    email: string;
}

class AppServer {
    private port: number;
    private server: http.Server;
    private users: User[] = [];

    constructor(port: number) {
        this.port = port;
        this.server = http.createServer()
    }

    private async handleRequest(req: IncomingMessage, res: ServerResponse) {
        const parsedUrl = parseUrl(req.url || "", true);
        const pathname = parsedUrl.pathname || "";

    }
}