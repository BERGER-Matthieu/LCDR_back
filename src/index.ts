import { Elysia } from "elysia";
import { connectDB } from "./db";
import userRoutes from "./routes/userRoutes";

await connectDB();

const app = new Elysia();

userRoutes(app);

app.listen(3000);
console.log(`Elysia running at ${app.server?.hostname}:${app.server?.port}`);