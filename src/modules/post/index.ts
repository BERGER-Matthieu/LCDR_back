import Elysia, { t } from "elysia";
import { jwt } from "@elysia/jwt";
import { getPost, createPost, updatePost, deletePost } from "./service";
import { errorResponse } from "../../common/model";

const postResponse = t.Object({
    _id: t.String(),
    bookId: t.Optional(t.String()),
    content: t.Optional(t.String())
});

const idParam = t.Object({
    id: t.String({ minLength: 24, maxLength: 24, description: "24-char Mongo ObjectId" })
});

export const post = new Elysia({ prefix: "/posts" })
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET
        })
    )
    .get("/", async (context: any) => {
            if (context.query.id && context.query.id.length != 24) {
                throw context.status(400, { code: 400, message: "invalid id format (24 char)" });
            }
            return await getPost(context);
        }, {
            query: t.Object({
                id: t.Optional(t.String({ description: "24-char Mongo ObjectId" })),
                bookId: t.Optional(t.String({ description: "24-char Mongo ObjectId" })),
                skip: t.Optional(t.Numeric({ default: 0 })),
                limit: t.Optional(t.Numeric({ default: 25, maximum: 25 }))
            }),
            response: {
                200: t.Union([postResponse, t.Array(postResponse)]),
                400: errorResponse,
                404: errorResponse,
                500: errorResponse
            },
            detail: {
                tags: ["Post"],
                summary: "Get post(s)",
                description: "Fetch a single post by id, list posts in a book, or list all posts (paginated)."
            }
        }
    )
    .post("/", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, { code: 401, message: "invalid or missing token" });
            }
            return await createPost(context, profile.id);
        }, {
            headers: t.Object({
                authorization: t.String({ description: "Bearer JWT" })
            }),
            body: t.Object({
                bookId: t.String({ description: "24-char Mongo ObjectId" }),
                content: t.Optional(t.String())
            }),
            response: {
                200: postResponse,
                400: errorResponse,
                401: errorResponse,
                403: errorResponse,
                404: errorResponse,
                500: errorResponse
            },
            detail: {
                tags: ["Post"],
                summary: "Create post",
                description: "Create a new post on a book (must be the book's author)."
            }
        }
    )
    .patch("/:id", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, { code: 401, message: "invalid or missing token" });
            }
            return await updatePost(context, context.params.id, profile.id);
        }, {
            params: idParam,
            headers: t.Object({
                authorization: t.String({ description: "Bearer JWT" })
            }),
            body: t.Object({
                content: t.Optional(t.String())
            }),
            response: {
                200: postResponse,
                401: errorResponse,
                403: errorResponse,
                404: errorResponse,
                500: errorResponse
            },
            detail: {
                tags: ["Post"],
                summary: "Update post",
                description: "Update a post identified by :id (must be the parent book's author)."
            }
        }
    )
    .delete("/:id", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, { code: 401, message: "invalid or missing token" });
            }
            return await deletePost(context, context.params.id, profile.id);
        }, {
            params: idParam,
            headers: t.Object({
                authorization: t.String({ description: "Bearer JWT" })
            }),
            response: {
                200: postResponse,
                401: errorResponse,
                403: errorResponse,
                404: errorResponse,
                500: errorResponse
            },
            detail: {
                tags: ["Post"],
                summary: "Delete post",
                description: "Delete a post identified by :id (must be the parent book's author)."
            }
        }
    )
