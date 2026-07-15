import Elysia from "elysia";
import { jwt } from "@elysia/jwt";
import { getCommunity, createCommunity, updateCommunity, deleteCommunity } from "./service";

export const community = new Elysia({ prefix: "/communities" })
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
            return await getCommunity(context);
        }
    )
    .post("/", async (context: any) => {
        const profile: any = await context.jwt.verify(context.headers.authorization);
        if (!profile) {
            throw context.status(401, "invalid or missing token");
        }
        return await createCommunity(context, profile.id);
    }
)
    .patch("/:id", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, "invalid or missing token");
            }
            return await updateCommunity(context, context.params.id, profile.id);
        }
    )
    .delete("/:id", async (context: any) => {
            const profile: any = await context.jwt.verify(context.headers.authorization);
            if (!profile) {
                throw context.status(401, "invalid or missing token");
            }
            return await deleteCommunity(context, context.params.id, profile.id);
        }
    )

