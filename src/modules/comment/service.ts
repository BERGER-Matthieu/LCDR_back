import Comment from "./model";
import Post from "../post/model";
import User from "../user/model";

const toCommentDTO = (doc: any) => ({
    _id: doc._id.toString(),
    authorId: doc.authorId ? doc.authorId.toString() : undefined,
    postId: doc.postId ? doc.postId.toString() : undefined,
    content: doc.content
});

export const getComment = async (context: any) => {
    let skip: number = context.query.skip ? context.query.skip : 0;
    let limit: number = context.query.limit ? context.query.limit : 25;
    if (limit > 25) { limit = 25 }

    let comment: any;
    try {
        if (context.query.id) {
            comment = await Comment.findOne({ _id: context.query.id });
        } else if (context.query.postId) {
            const comments = await Comment.find({ postId: context.query.postId }).skip(skip).limit(limit);
            return comments.map(toCommentDTO);
        } else {
            const comments = await Comment.find().skip(skip).limit(limit);
            return comments.map(toCommentDTO);
        }
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }

    if (!comment) {
        throw context.status(404, { code: 404, message: `No such comment id (${context.query.id})` });
    }
    return toCommentDTO(comment);
};

export const createComment = async (context: any, authorId: string) => {
    const body: any = context.body;

    if (!body.postId) {
        throw context.status(400, { code: 400, message: "postId is required" });
    }
    if (!body.content) {
        throw context.status(400, { code: 400, message: "content is required" });
    }

    let author: any;
    try {
        author = await User.findById(authorId);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }

    if (!author) {
        throw context.status(404, { code: 404, message: `No such user id (${authorId})` });
    }

    let post: any;
    try {
        post = await Post.findById(body.postId);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }

    if (!post) {
        throw context.status(404, { code: 404, message: `No such post id (${body.postId})` });
    }

    try {
        const created = await Comment.create({ ...body, authorId });
        return toCommentDTO(created);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }
};

export const updateComment = async (context: any, id: string, authorId: string) => {
    let author: any;
    try {
        author = await User.findById(authorId);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }

    if (!author) {
        throw context.status(404, { code: 404, message: `No such user id (${authorId})` });
    }

    let comment: any;
    try {
        comment = await Comment.findById(id);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }

    if (!comment) {
        throw context.status(404, { code: 404, message: `No such comment id (${id})` });
    }
    if (comment.authorId?.toString() !== authorId) {
        throw context.status(403, { code: 403, message: "not allowed to update this comment" });
    }

    try {
        const updated = await Comment.findByIdAndUpdate(id, context.body, { new: true });
        return toCommentDTO(updated);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }
};

export const deleteComment = async (context: any, id: string, authorId: string) => {
    let author: any;
    try {
        author = await User.findById(authorId);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }

    if (!author) {
        throw context.status(404, { code: 404, message: `No such user id (${authorId})` });
    }

    let comment: any;
    try {
        comment = await Comment.findById(id);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }

    if (!comment) {
        throw context.status(404, { code: 404, message: `No such comment id (${id})` });
    }
    if (comment.authorId?.toString() !== authorId) {
        throw context.status(403, { code: 403, message: "not allowed to delete this comment" });
    }

    try {
        const deleted = await Comment.findByIdAndDelete(id);
        return toCommentDTO(deleted);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }
};
