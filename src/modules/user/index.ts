import { Elysia, t } from "elysia";
import { jwt } from "@elysia/jwt";
import { getUser, logInUser, registerUser, updateUser, deleteUser } from "./service";
import { errorResponse } from "../../common/model";

const userResponse = t.Object({
    id: t.String(),
    name: t.String(),
    description: t.Optional(t.String())
});

export const user = new Elysia({prefix: "/users"})
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
            return await getUser(context);
        }, {
            query: t.Object({
                id: t.Optional(t.String({ description: "24-char Mongo ObjectId" })),
                name: t.Optional(t.String()),
                skip: t.Optional(t.Numeric({ default: 0 })),
                limit: t.Optional(t.Numeric({ default: 25, maximum: 25 }))
            }),
            response: {
                200: t.Union([userResponse, t.Array(userResponse)]),
                400: errorResponse
            },
            detail: {
                tags: ["User"],
                summary: "Get user(s)",
                description: "Fetch a single user by id or name, or list all users (paginated)."
            }
        }
    )
    .get("/login", async (context: any) => {
        if (!context.query.email || !context.query.password) {
            throw context.status(400, { code: 400, message: "email and password are required" });
        }
        const res: string = await logInUser(context);
        return context.jwt.sign({ id: res });
    }, {
            query: t.Object({
                email: t.String({ format: "email" }),
                password: t.String()
            }),
            response: {
                200: t.String({ description: "Signed JWT" }),
                400: errorResponse,
                401: errorResponse,
                404: errorResponse
            },
            detail: {
                tags: ["User"],
                summary: "Log in",
                description: "Authenticate with email/password and receive a JWT."
            }
        }
    )
    .post("/register", async (context: any) => {
            const res: string = await registerUser(context);
            return context.jwt.sign({ id: res });
        }, {
            body: t.Object({
                name: t.Optional(t.String()),
                email: t.String({ format: "email" }),
                password: t.String({ minLength: 1 }),
                description: t.Optional(t.String())
            }),
            response: {
                200: t.String({ description: "Signed JWT" }),
                400: errorResponse,
                500: errorResponse
            },
            detail: {
                tags: ["User"],
                summary: "Register",
                description: "Create a new user account and receive a JWT."
            }
        }
    )
    .patch("/", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, { code: 401, message: "invalid or missing token" });
            }
            return await updateUser(context, profile.id);
        }, {
            headers: t.Object({
                authorization: t.String({ description: "Bearer JWT" })
            }),
            body: t.Object({
                name: t.Optional(t.String()),
                email: t.Optional(t.String({ format: "email" })),
                password: t.Optional(t.String()),
                description: t.Optional(t.String())
            }),
            response: {
                200: userResponse,
                401: errorResponse,
                404: errorResponse
            },
            detail: {
                tags: ["User"],
                summary: "Update current user",
                description: "Update fields on the authenticated user's profile."
            }
        }
    )
    .delete("/", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, { code: 401, message: "invalid or missing token" });
            }
            return await deleteUser(context, profile.id);
        }, {
            headers: t.Object({
                authorization: t.String({ description: "Bearer JWT" })
            }),
            response: {
                200: userResponse,
                401: errorResponse,
                404: errorResponse
            },
            detail: {
                tags: ["User"],
                summary: "Delete current user",
                description: "Delete the authenticated user's account."
            }
        }
    )
