import { Elysia } from "elysia";
import { connectDB } from "./db";
import { user } from "./modules/user";
import { community } from "./modules/community";

const PORT : number = parseInt(process.env.PORT) ?? 3001

await connectDB();

const app = new Elysia({prefix: "/api"})
    .use(user)
    .use(community)

app.listen(PORT);
console.log(`Elysia running at ${app.server?.hostname}:${app.server?.port}`);