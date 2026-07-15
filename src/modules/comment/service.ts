import Comment from "./model";
import Post from "../post/model";
import User from "../user/model";

export const getComment = async (context: any) => {
    let skip: number = context.query.skip ? context.query.skip : 0;
    let limit: number = context.query.limit ? context.query.limit : 25;
    if (limit > 25) { limit = 25 }

    let comment: any;
    try {
        if (context.query.id) {
            comment = await Comment.findOne({ _id: context.query.id });
        } else if (context.query.postId) {
            return await Comment.find({ postId: context.query.postId }).skip(skip).limit(limit);
        } else {
            return await Comment.find().skip(skip).limit(limit);
        }
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }

    if (!comment) {
        throw context.status(404, `No such comment id (${context.query.id})`);
    }
    return comment;
};

export const createComment = async (context: any, authorId: string) => {
    const body: any = context.body;

    if (!body.postId) {
        throw context.status(400, "postId is required");
    }
    if (!body.content) {
        throw context.status(400, "content is required");
    }

    let author: any;
    try {
        author = await User.findById(authorId);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }

    if (!author) {
        throw context.status(404, `No such user id (${authorId})`);
    }

    let post: any;
    try {
        post = await Post.findById(body.postId);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }

    if (!post) {
        throw context.status(404, `No such post id (${body.postId})`);
    }

    try {
        return await Comment.create({ ...body, authorId });
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }
};

export const updateComment = async (context: any, id: string, authorId: string) => {
    let author: any;
    try {
        author = await User.findById(authorId);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }

    if (!author) {
        throw context.status(404, `No such user id (${authorId})`);
    }

    let comment: any;
    try {
        comment = await Comment.findById(id);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }

    if (!comment) {
        throw context.status(404, `No such comment id (${id})`);
    }
    if (comment.authorId?.toString() !== authorId) {
        throw context.status(403, "not allowed to update this comment");
    }

    try {
        return await Comment.findByIdAndUpdate(id, context.body, { new: true });
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }
};

export const deleteComment = async (context: any, id: string, authorId: string) => {
    let author: any;
    try {
        author = await User.findById(authorId);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }

    if (!author) {
        throw context.status(404, `No such user id (${authorId})`);
    }

    let comment: any;
    try {
        comment = await Comment.findById(id);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }

    if (!comment) {
        throw context.status(404, `No such comment id (${id})`);
    }
    if (comment.authorId?.toString() !== authorId) {
        throw context.status(403, "not allowed to delete this comment");
    }

    try {
        return await Comment.findByIdAndDelete(id);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }
};
