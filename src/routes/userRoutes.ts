import Elysia from "elysia";
import { t } from "elysia";
import { readUsers, createUser, updateUser, deleteUser} from "../controllers/userController";


export const userRoutes = new Elysia({prefix: "/users"})
    .get("/", async () => {
        return await readUsers();
    })
    .get("/:id", async ({ params: { id } }: { params: { id: string } }) => {
            return await readUsers(id);
        },
    )
    .post("/", async ({ body }: { body: User }) => {
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
                email: t.String()
            })
        }
    )
    .put("/:id", async ({ params: { id }, body }: { params: { id: string }, body: User }) => {
            return await updateUser(id, body);
        },
        {
            body: t.Object({
                name: t.String(),
                password: t.String(),
                description: t.String(),
                email: t.String()
            })
        }
    )
    .delete("/:id", async ({ params: { id } }: { params: { id: string } }) => {
            return await deleteUser(id);
        }
    );


/*
export default (app: any) => {
    app.get("/users", async () => {
        return await readUsers();
    });

    app.get("/users/:id", async ({ params: { id } }: { params: { id: string } }) => {
            return await readUsers(id);
        },
    );

    app.post("/users", async ({ body }: { body: User }) => {
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
                email: t.String()
            }),
            afterHandle() {
                console.log("test")
            }
        },
    );

    app.put("/users/:id", async ({ params: { id }, body }: { params: { id: string }, body: User }) => {
            return await updateUser(id, body);
        },
    );

    app.delete("/users/:id", async ({ params: { id } }: { params: { id: string } }) => {
            return await deleteUser(id);
        },
    );
};
*/
