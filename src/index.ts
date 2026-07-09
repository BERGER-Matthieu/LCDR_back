import { Elysia } from "elysia";
import { connectDB } from "./db";
import { user } from "./modules/user";

const PORT : number = parseInt(process.env.PORT) ?? 3001

await connectDB();

const app = new Elysia({prefix: "/api"})
    .use(user)

app.listen(PORT);
console.log(`Elysia running at ${app.server?.hostname}:${app.server?.port}`);