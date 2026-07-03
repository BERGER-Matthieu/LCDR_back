import { Elysia, t } from "elysia";
import { authHooks } from "../hooks/authHooks";
import * as userService from "../services/userService";

export const authRoutes = new Elysia({ prefix: "/auth" })
    .use(authHooks)
    .post("/register", async ({ jwt, body, set }) => {
        const user = await userService.saveUser(body);
        const token = await jwt.sign({ id: user._id, email: user.email });
        set.status = 201;
        return { token, user };
    }, {
        body: t.Object({
            name: t.String(),
            password: t.String(),
            description: t.String(),
            email: t.String()
        })
    })
    .post("/login", async ({ jwt, body, error }) => {
        const user = await userService.findUserByEmail(body.email);
        if (!user) return error(401, "Invalid credentials");

        const valid = await Bun.password.verify(body.password, user.password);
        if (!valid) return error(401, "Invalid credentials");

        const token = await jwt.sign({ id: user._id, email: user.email });
        return { token };
    }, {
        body: t.Object({
            email: t.String(),
            password: t.String()
        })
    });
