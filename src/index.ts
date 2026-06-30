import { Elysia } from "elysia";
import { connectDB } from "./db";
import userRoutes from "./routes/userRoutes";

const PORT : number = parseInt(process.env.PORT) ?? 3001

await connectDB();

const app = new Elysia();

userRoutes(app);

app.listen(PORT);
console.log(`Elysia running at ${app.server?.hostname}:${app.server?.port}`);