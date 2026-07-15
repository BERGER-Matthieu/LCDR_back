import Elysia from "elysia";
import { jwt } from "@elysia/jwt";
import { getBook, createBook, updateBook, deleteBook } from "./service";

export const book = new Elysia({ prefix: "/books" })
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
            return await getBook(context);
        }
    )
    .post("/", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, "invalid or missing token");
            }
            return await createBook(context, profile.id);
        }
    )
    .patch("/:id", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, "invalid or missing token");
            }
            return await updateBook(context, context.params.id, profile.id);
        }
    )
    .delete("/:id", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, "invalid or missing token");
            }
            return await deleteBook(context, context.params.id, profile.id);
        }
    )
