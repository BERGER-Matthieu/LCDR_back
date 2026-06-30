import { t } from "elysia";
import { readUsers, createUser, updateUser, deleteUser } from "../controllers/userController";

export default (app: any) => {
 /*
    app.group('/users', (app) => {

    })
*/
    app.get("/users", async () => {
        return await readUsers();
    }); 

    app.get("/users/:id", async ({params: {id}} : {params: {id: string}}) => {
        return await readUsers(id);
    });

    app.post("/users", async ({body}: {body: User}) => 
        {
            try {
                return await createUser(body);
            } catch (error) {
                throw error;
            }
        },
        {
            body: t.Object({
                name: t.String(),
                password: t.String(),
                description: t.String(),
            }),
        },
    );

    app.put("/users/:id", async ({params: { id }, body }: { params: { id: string }; body: User }) => {
        return await updateUser(id, body)
    });

    app.delete("/users/:id", async ({params: {id}} : {params: {id: string}}) => {
        return await deleteUser(id);
    })
};
