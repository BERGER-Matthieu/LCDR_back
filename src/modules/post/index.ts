import Elysia from "elysia";
import { jwt } from "@elysia/jwt";
import { getPost, createPost, updatePost, deletePost } from "./service";

export const post = new Elysia({ prefix: "/posts" })
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET
        })
    )
    .get("/", async (context: any) => {
            if (context.query.id && context.query.id.length != 24) {
                throw context.status(400, "invalid id format (24 char)")
            }
            return await getPost(context);
        }
    )
    .post("/", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, "invalid or missing token");
            }
            return await createPost(context, profile.id);
        }
    )
    .patch("/:id", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, "invalid or missing token");
            }
            return await updatePost(context, context.params.id, profile.id);
        }
    )
    .delete("/:id", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, "invalid or missing token");
            }
            return await deletePost(context, context.params.id, profile.id);
        }
    )
