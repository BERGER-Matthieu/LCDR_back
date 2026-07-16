import Elysia, { t } from "elysia";
import { jwt } from "@elysia/jwt";
import { getComment, createComment, updateComment, deleteComment } from "./service";
import { errorResponse } from "../../common/model";

const commentResponse = t.Object({
    _id: t.String(),
    authorId: t.Optional(t.String()),
    postId: t.Optional(t.String()),
    content: t.Optional(t.String())
});

const idParam = t.Object({
    id: t.String({ minLength: 24, maxLength: 24, description: "24-char Mongo ObjectId" })
});

export const comment = new Elysia({ prefix: "/comments" })
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
            return await getComment(context);
        }, {
            query: t.Object({
                id: t.Optional(t.String({ description: "24-char Mongo ObjectId" })),
                postId: t.Optional(t.String({ description: "24-char Mongo ObjectId" })),
                skip: t.Optional(t.Numeric({ default: 0 })),
                limit: t.Optional(t.Numeric({ default: 25, maximum: 25 }))
            }),
            response: {
                200: t.Union([commentResponse, t.Array(commentResponse)]),
                400: errorResponse,
                404: errorResponse,
                500: errorResponse
            },
            detail: {
                tags: ["Comment"],
                summary: "Get comment(s)",
                description: "Fetch a single comment by id, list comments on a post, or list all comments (paginated)."
            }
        }
    )
    .post("/", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, { code: 401, message: "invalid or missing token" });
            }
            return await createComment(context, profile.id);
        }, {
            headers: t.Object({
                authorization: t.String({ description: "Bearer JWT" })
            }),
            body: t.Object({
                postId: t.String({ description: "24-char Mongo ObjectId" }),
                content: t.String()
            }),
            response: {
                200: commentResponse,
                400: errorResponse,
                401: errorResponse,
                404: errorResponse,
                500: errorResponse
            },
            detail: {
                tags: ["Comment"],
                summary: "Create comment",
                description: "Create a new comment on a post, authored by the authenticated user."
            }
        }
    )
    .patch("/:id", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, { code: 401, message: "invalid or missing token" });
            }
            return await updateComment(context, context.params.id, profile.id);
        }, {
            params: idParam,
            headers: t.Object({
                authorization: t.String({ description: "Bearer JWT" })
            }),
            body: t.Object({
                content: t.Optional(t.String())
            }),
            response: {
                200: commentResponse,
                401: errorResponse,
                403: errorResponse,
                404: errorResponse,
                500: errorResponse
            },
            detail: {
                tags: ["Comment"],
                summary: "Update comment",
                description: "Update a comment identified by :id (must be its author)."
            }
        }
    )
    .delete("/:id", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, { code: 401, message: "invalid or missing token" });
            }
            return await deleteComment(context, context.params.id, profile.id);
        }, {
            params: idParam,
            headers: t.Object({
                authorization: t.String({ description: "Bearer JWT" })
            }),
            response: {
                200: commentResponse,
                401: errorResponse,
                403: errorResponse,
                404: errorResponse,
                500: errorResponse
            },
            detail: {
                tags: ["Comment"],
                summary: "Delete comment",
                description: "Delete a comment identified by :id (must be its author)."
            }
        }
    )
