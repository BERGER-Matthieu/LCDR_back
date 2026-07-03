import Elysia from "elysia";
import { t } from "elysia";
import { readUsers, readUsersById, readUsersByEmail, createUser, updateUser, deleteUser} from "../controllers/userController";
import { authHooks } from "../hooks/authHooks";



export const userRoutes = new Elysia({prefix: "/users"})
    .use(authHooks)
    .get("/", async () => {
        return await readUsers();
        }
    )
    .get("id/:id", async (context: any) => { 
            try {
                const res: HttpResponse = await readUsersById(context.params.id);
                context.set.headers["content-type"] = "application/json;charset=utf-8";
                return context.status(res.code, res.result);
            } catch (error: any) {
                const code: Number = error.code ? error.code : 500;
                const result: String = error.result ? error.result : error;
                return context.status(code, result);
            }
        }
    )
    .get("email/:email", async (context: any) => {
            try {
                const res: HttpResponse = await readUsersByEmail(context.params.email);
                context.set.headers["content-type"] = "application/json;charset=utf-8";
                return context.status(res.code, res.result);
            } catch (error: any) {
                const code: Number = error.code ? error.code : 500;
                const result: String = error.result ? error.result : error;
                return context.status(code, result);
            }
        }
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
        }, {
            isAuthenticated: true
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
