import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    communityId: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
    name: String,
    description: String
});

export default mongoose.model("Book", bookSchema);
