import Elysia from "elysia";
import { jwt } from "@elysia/jwt";
import { getUser, logInUser, registerUser } from "./service";

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
    .get("/login", async (context: any) => {
            const res: String | boolean = await logInUser({email: context.query.email, password: context.query.password});

            if (res) {
                return context.jwt.sign({id: res})
            }
            return "no such user"
        }
    )
    .post("/register", async (context: any) => {
            const res: string = await registerUser(context.body)
            return context.jwt.sign({id: res})
        }
    )