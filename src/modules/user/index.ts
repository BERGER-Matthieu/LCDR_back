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
    .patch("/update", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);

            if (profile) {
                return await updateUser(context.body, profile.id)
            }

            return profile
        }
    )
    .delete("/delete", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            
            if (profile) {
                return await deleteUser(profile.id)
            }

            return profile
        }
    )