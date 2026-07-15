import Post from "./model";
import Book from "../book/model";
import User from "../user/model";

export const getPost = async (context: any) => {
    let skip: number = context.query.skip ? context.query.skip : 0;
    let limit: number = context.query.limit ? context.query.limit : 25;
    if (limit > 25) { limit = 25 }

    let post: any;
    try {
        if (context.query.id) {
            post = await Post.findOne({ _id: context.query.id });
        } else if (context.query.bookId) {
            return await Post.find({ bookId: context.query.bookId }).skip(skip).limit(limit);
        } else {
            return await Post.find().skip(skip).limit(limit);
        }
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }

    if (!post) {
        throw context.status(404, `No such post id (${context.query.id})`);
    }
    return post;
};

export const createPost = async (context: any, authorId: string) => {
    const body: any = context.body;

    if (!body.bookId) {
        throw context.status(400, "bookId is required");
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

    let book: any;
    try {
        book = await Book.findById(body.bookId);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }

    if (!book) {
        throw context.status(404, `No such book id (${body.bookId})`);
    }
    if (book.authorId?.toString() !== authorId) {
        throw context.status(403, "not allowed to add a post to this book");
    }

    try {
        return await Post.create(body);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }
};

export const updatePost = async (context: any, id: string, authorId: string) => {
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
        post = await Post.findById(id);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }

    if (!post) {
        throw context.status(404, `No such post id (${id})`);
    }

    const book: any = await Book.findById(post.bookId);
    if (!book || book.authorId?.toString() !== authorId) {
        throw context.status(403, "not allowed to update this post");
    }

    try {
        return await Post.findByIdAndUpdate(id, context.body, { new: true });
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }
};

export const deletePost = async (context: any, id: string, authorId: string) => {
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
        post = await Post.findById(id);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }

    if (!post) {
        throw context.status(404, `No such post id (${id})`);
    }

    const book: any = await Book.findById(post.bookId);
    if (!book || book.authorId?.toString() !== authorId) {
        throw context.status(403, "not allowed to delete this post");
    }

    try {
        return await Post.findByIdAndDelete(id);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }
};
