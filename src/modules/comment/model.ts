import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    content: String
});

export default mongoose.model("Comment", commentSchema);
