import { Elysia } from "elysia";
import { connectDB } from "./db";
import { user } from "./modules/user";
import { community } from "./modules/community";
import { book } from "./modules/book";
import { post } from "./modules/post";
import { comment } from "./modules/comment";

const PORT : number = parseInt(process.env.PORT) ?? 3001

await connectDB();

const app = new Elysia({prefix: "/api"})
    .use(user)
    .use(community)
    .use(book)
    .use(post)
    .use(comment)

app.listen(PORT);
console.log(`Elysia running at ${app.server?.hostname}:${app.server?.port}`);