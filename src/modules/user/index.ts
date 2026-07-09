import Elysia from "elysia";
import { jwt } from "@elysia/jwt";
import { getUser, registerUser } from "./service";

export const user = new Elysia({prefix: "/users"})
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET
        })
    )
    .get("/", async (context: any) => {
            return await getUser(context);
        }
    )
    .post("/", async (context: any) => {
            const res: string = await registerUser(context.body)
            return context.jwt.sign({id: res})
        }
    )