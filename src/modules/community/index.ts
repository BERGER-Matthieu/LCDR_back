import Elysia, { t } from "elysia";
import { jwt } from "@elysia/jwt";
import { getCommunity, createCommunity, updateCommunity, deleteCommunity } from "./service";
import { errorResponse } from "../../common/model";

const communityResponse = t.Object({
    _id: t.String(),
    name: t.String(),
    description: t.Optional(t.String()),
    creatorId: t.Optional(t.String())
});

const idParam = t.Object({
    id: t.String({ minLength: 24, maxLength: 24, description: "24-char Mongo ObjectId" })
});

export const community = new Elysia({ prefix: "/communities" })
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
            return await getCommunity(context);
        }, {
            query: t.Object({
                id: t.Optional(t.String({ description: "24-char Mongo ObjectId" })),
                name: t.Optional(t.String()),
                skip: t.Optional(t.Numeric({ default: 0 })),
                limit: t.Optional(t.Numeric({ default: 25, maximum: 25 }))
            }),
            response: {
                200: t.Union([communityResponse, t.Array(communityResponse)]),
                400: errorResponse,
                404: errorResponse,
                500: errorResponse
            },
            detail: {
                tags: ["Community"],
                summary: "Get community(ies)",
                description: "Fetch a single community by id or name, or list all communities (paginated)."
            }
        }
    )
    .post("/", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, { code: 401, message: "invalid or missing token" });
            }
            return await createCommunity(context, profile.id);
        }, {
            headers: t.Object({
                authorization: t.String({ description: "Bearer JWT" })
            }),
            body: t.Object({
                name: t.String(),
                description: t.Optional(t.String())
            }),
            response: {
                200: communityResponse,
                400: errorResponse,
                401: errorResponse,
                404: errorResponse,
                500: errorResponse
            },
            detail: {
                tags: ["Community"],
                summary: "Create community",
                description: "Create a new community owned by the authenticated user."
            }
        }
    )
    .patch("/:id", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, { code: 401, message: "invalid or missing token" });
            }
            return await updateCommunity(context, context.params.id, profile.id);
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
                200: communityResponse,
                401: errorResponse,
                403: errorResponse,
                404: errorResponse,
                500: errorResponse
            },
            detail: {
                tags: ["Community"],
                summary: "Update community",
                description: "Update a community identified by :id (must be owned by the authenticated user)."
            }
        }
    )
    .delete("/:id", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, { code: 401, message: "invalid or missing token" });
            }
            return await deleteCommunity(context, context.params.id, profile.id);
        }, {
            params: idParam,
            headers: t.Object({
                authorization: t.String({ description: "Bearer JWT" })
            }),
            response: {
                200: communityResponse,
                401: errorResponse,
                403: errorResponse,
                404: errorResponse,
                500: errorResponse
            },
            detail: {
                tags: ["Community"],
                summary: "Delete community",
                description: "Delete a community identified by :id (must be owned by the authenticated user)."
            }
        }
    )
