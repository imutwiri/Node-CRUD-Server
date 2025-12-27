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
                return this.createUser(req, res);
            }
            if (pathname === "/users" && req.method === "GET") {
                return this.getAllUsers(res);
            }
            if (pathname.startsWith("/users/") && req.method === "GET") {
                return this.getUser(req, res, pathname);
            }
            if (pathname.startsWith("/users/") && req.method === "PUT") {
                return this.updateUser(req, res, pathname);
            }
            if (pathname.startsWith("/users/") && req.method === "DELETE") {
                return this.deleteUser(res, pathname);
            }

            this.sendJSON(res, 404, { error: "Route not found" });

        }catch (error) {}

    }

    public start(): void {
        this.server.listen(this.port, () => {
            console.log(`Server running on http://localhost:${this.port}`);
        });
    }

    private sendJSON(res: ServerResponse, statusCode: number, data: any) {
        res.writeHead(statusCode, { "content-type": "application/json" });
        res.end(JSON.stringify(data));
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

    private async createUser(req: IncomingMessage, res: ServerResponse) {
        try {
            const body = await this.parseBody(req);
            if(!body.name || !body.email) {
                return this.sendJSON(res, 400, { 
                    error: "Name and email are required",
                });
            }

            const newUser: User = {
                id: this.users.length + 1,
                name: body.name,
                email: body.email,
            };
            this.users.push(newUser);
            this.sendJSON(res, 201, newUser);

        }catch (error) {
            this.sendJSON(res, 400, { error: "Invalid JSON format" });
        }
    }

    private async getAllUsers(res: ServerResponse) {
        this.sendJSON(res, 200, this.users);
    }

    private async getUser(req: IncomingMessage, res: ServerResponse, pathname: string){
        const id = parseInt(pathname.split("/")[2] || "0");
        const user = this.users.find((user) => user.id === id);
        user
            ? this.sendJSON(res, 200, user)
            : this.sendJSON(res, 404, { error: "User not found" });
    }

    private async updateUser(req: IncomingMessage, res: ServerResponse, pathname: string){
        try {
            const id = parseInt(pathname.split("/")[2] || "0");
            const body = await this.parseBody(req);

            const user = this.users.find((user) => user.id === id);
            if (!user) {
                return this.sendJSON(res, 404, { error: "User not found" });
            }

            if (body.name){
                user.name = body.name;
            }
            if (body.email){
                user.email = body.email;
            }
            this.sendJSON(res, 200, user);
        }catch (error) {
            this.sendJSON(res, 400, { error: "Invalid JSON format" });
        }
    }

    private async deleteUser(res: ServerResponse, pathname: string) {
        const id = parseInt(pathname.split("/")[2] || "0");
        const index = this.users.findIndex((user) => user.id === id);
        if (index === -1) {
            return this.sendJSON(res, 404, { error: "User not found" });
        }
        const deletedUser = this.users.splice(index, 1)[0];
        this.sendJSON(res, 200, {message: "User deleted", data: deletedUser});
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