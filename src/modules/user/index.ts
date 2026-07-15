import Elysia from "elysia";
import { jwt } from "@elysia/jwt";
import { getUser, logInUser, registerUser, updateUser, deleteUser } from "./service";

export const user = new Elysia({prefix: "/users"})
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
            return await getUser(context);
        }
    )
    .get("/login", async (context: any) => {
        if (!context.query.email || !context.query.password) {
            throw context.status(400, "email and password are required");
        }
        const res: string = await logInUser(context);
        return context.jwt.sign({ id: res });
    }
)
    .post("/register", async (context: any) => {
            const res: string = await registerUser(context);
            return context.jwt.sign({ id: res });
        }
    )
    .patch("/update", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, "invalid or missing token");
            }
            return await updateUser(context, profile.id);
        }
    )
    .delete("/delete", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, "invalid or missing token");
            }
            return await deleteUser(context, profile.id);
        }
    )