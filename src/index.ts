import * as Sentry from '@sentry/elysia';
import { Elysia } from "elysia";
import { connectDB } from "./db";
import { openapi } from '@elysia/openapi'

import { user } from "./modules/user";
import { community } from "./modules/community";
import { book } from "./modules/book";
import { post } from "./modules/post";
import { comment } from "./modules/comment";

const PORT : number = parseInt(process.env.PORT) ?? 3001

await connectDB();

Sentry.init({
  dsn: "https://1ae531d336366a20a9c222d67eb5e4fa@o4511767853727744.ingest.de.sentry.io/4511767860936784",
  // Send structured logs to Sentry
  enableLogs: true,
});

const app = Sentry.withElysia(new Elysia({prefix: "/api"}))
    .use(openapi({
        documentation: {
            tags: [
                { name: 'User', description: 'User related endpoints'},
                { name: 'Community', description: 'Community related endpoints'},
                { name: 'Book', description: 'Book related endpoints'},
                { name: 'Post', description: 'Post related endpoints'},
                { name: 'Comment', description: 'Comment related endpoints'}
            ]
        }
    }))
    .use(user)
    .use(community)
    .use(book)
    .use(post)
    .use(comment)


app.listen(PORT);
console.log(`Elysia running at ${app.server?.hostname}:${app.server?.port}`);