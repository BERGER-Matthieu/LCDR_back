import { Elysia } from "elysia";
import { jwt } from "@elysia/jwt";

export const authHooks = new Elysia({ name: "authHooks" })
    .use(
        jwt({
            name: "jwt",
            secret: process.env.JWT_SECRET!,
            exp: "7d"
        })
    )
    .macro({
        isAuthenticated: {
            async resolve({ jwt, headers, error }) {
                const token = headers.authorization?.replace("Bearer ", "");

                if (!token) return error(401, "Unauthorized");

                const payload = await jwt.verify(token);
                if (!payload) return error(401, "Invalid or expired token");

                return { user: payload };
            }
        }
    });
