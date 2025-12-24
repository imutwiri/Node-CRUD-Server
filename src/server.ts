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
        console.log(req.url);
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

    public start(): void {
        this.server.listen(this.port, () => {
            console.log(`Server running on http://localhost:${this.port}`);
        });
    }

    private parseBody(req: IncomingMessage): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = "";
            req.on("data", chunk => (body += chunk.toString()))
            req.on("end", () => {
                try {
                    resolve(body ? JSON.parse(body) : {});
                }catch (error) {
                    reject(error);
                }
            });
        });    
    }
}

const server = new AppServer(5000);
server.start();

/**
 * 
 C = create
 R = read
 U = update
 D = delete
 */