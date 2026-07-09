import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    description: String,
    email: String
});

export default mongoose.model("User", userSchema);