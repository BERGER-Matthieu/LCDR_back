import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
    content: String
});

export default mongoose.model("Post", postSchema);
