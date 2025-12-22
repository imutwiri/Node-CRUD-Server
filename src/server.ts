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
        this.server = http.createServer(this.handleRequest.bind(this));
    }

    private async handleRequest(req: IncomingMessage, res: ServerResponse) {
        const parsedUrl = parseUrl(req.url || "", true);
        const pathname = parsedUrl.pathname || "";

        try {
            if (pathname === "/users" && req.method === "POST") {
                // TODO
            }
            if (pathname === "/users" && req.method === "GET") {
                // TODO
            }
            if (pathname.startsWith("/users/") && req.method === "PUT") {
                // TODO
            }
            if (pathname.startsWith("/users/") && req.method === "DELETE") {
                // TODO
            }

        }catch (error) {}

    }
}

/**
 * 
 C = create
 R = read
 U = update
 D = delete
 */