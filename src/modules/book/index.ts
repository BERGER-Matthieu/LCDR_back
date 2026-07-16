import Elysia, { t } from "elysia";
import { jwt } from "@elysia/jwt";
import { getBook, createBook, updateBook, deleteBook } from "./service";
import { errorResponse } from "../../common/model";

const bookResponse = t.Object({
    _id: t.String(),
    authorId: t.Optional(t.String()),
    communityId: t.Optional(t.String()),
    name: t.String(),
    description: t.Optional(t.String())
});

const idParam = t.Object({
    id: t.String({ minLength: 24, maxLength: 24, description: "24-char Mongo ObjectId" })
});

export const book = new Elysia({ prefix: "/books" })
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
            return await getBook(context);
        }, {
            query: t.Object({
                id: t.Optional(t.String({ description: "24-char Mongo ObjectId" })),
                name: t.Optional(t.String()),
                communityId: t.Optional(t.String({ description: "24-char Mongo ObjectId" })),
                skip: t.Optional(t.Numeric({ default: 0 })),
                limit: t.Optional(t.Numeric({ default: 25, maximum: 25 }))
            }),
            response: {
                200: t.Union([bookResponse, t.Array(bookResponse)]),
                400: errorResponse,
                404: errorResponse,
                500: errorResponse
            },
            detail: {
                tags: ["Book"],
                summary: "Get book(s)",
                description: "Fetch a single book by id or name, list books in a community, or list all books (paginated)."
            }
        }
    )
    .post("/", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, { code: 401, message: "invalid or missing token" });
            }
            return await createBook(context, profile.id);
        }, {
            headers: t.Object({
                authorization: t.String({ description: "Bearer JWT" })
            }),
            body: t.Object({
                name: t.String(),
                description: t.Optional(t.String()),
                communityId: t.String({ description: "24-char Mongo ObjectId" })
            }),
            response: {
                200: bookResponse,
                400: errorResponse,
                401: errorResponse,
                404: errorResponse,
                500: errorResponse
            },
            detail: {
                tags: ["Book"],
                summary: "Create book",
                description: "Create a new book authored by the authenticated user in a given community."
            }
        }
    )
    .patch("/:id", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, { code: 401, message: "invalid or missing token" });
            }
            return await updateBook(context, context.params.id, profile.id);
        }, {
            params: idParam,
            headers: t.Object({
                authorization: t.String({ description: "Bearer JWT" })
            }),
            body: t.Object({
                name: t.Optional(t.String()),
                description: t.Optional(t.String())
            }),
            response: {
                200: bookResponse,
                401: errorResponse,
                403: errorResponse,
                404: errorResponse,
                500: errorResponse
            },
            detail: {
                tags: ["Book"],
                summary: "Update book",
                description: "Update a book identified by :id (must be authored by the authenticated user)."
            }
        }
    )
    .delete("/:id", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, { code: 401, message: "invalid or missing token" });
            }
            return await deleteBook(context, context.params.id, profile.id);
        }, {
            params: idParam,
            headers: t.Object({
                authorization: t.String({ description: "Bearer JWT" })
            }),
            response: {
                200: bookResponse,
                401: errorResponse,
                403: errorResponse,
                404: errorResponse,
                500: errorResponse
            },
            detail: {
                tags: ["Book"],
                summary: "Delete book",
                description: "Delete a book identified by :id (must be authored by the authenticated user)."
            }
        }
    )
