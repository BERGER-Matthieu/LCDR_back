import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
    name: String,
    description: String,
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

export default mongoose.model("Community", communitySchema);
