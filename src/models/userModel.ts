import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    description: String
});

export default mongoose.model("User", userSchema);