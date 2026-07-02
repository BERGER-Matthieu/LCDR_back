import Elysia from "elysia";
import { jwt } from '@elysia/jwt'

export const authRoutes = new Elysia({prefix: "/users"})
    .use(
        jwt({
            name: 'jwt',
            secret: 'Fischl von Luftschloss Narfidort'
        })
    )