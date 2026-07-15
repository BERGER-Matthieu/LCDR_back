import Elysia from "elysia";
import { jwt } from "@elysia/jwt";
import { getComment, createComment, updateComment, deleteComment } from "./service";

export const comment = new Elysia({ prefix: "/comments" })
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
            return await getComment(context);
        }
    )
    .post("/", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, "invalid or missing token");
            }
            return await createComment(context, profile.id);
        }
    )
    .patch("/:id", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, "invalid or missing token");
            }
            return await updateComment(context, context.params.id, profile.id);
        }
    )
    .delete("/:id", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, "invalid or missing token");
            }
            return await deleteComment(context, context.params.id, profile.id);
        }
    )
