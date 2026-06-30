import { t } from "elysia";
import { readUsers, createUser } from "../controllers/userController";

export default (app: any) => {
    app.get("/users", async () => {
        return await readUsers();
    })

    app.post("/users", async ({body}: {body: User}) => {
        try {
            return await createUser(body);
        } catch (error) {
            throw error;
        }},
        {
            body: t.Object({
                name: t.String(),
                password: t.String(),
                description: t.String(),
            }),
        },
    );
};
