import Post from "./model";
import Book from "../book/model";
import User from "../user/model";

const toPostDTO = (doc: any) => ({
    _id: doc._id.toString(),
    bookId: doc.bookId ? doc.bookId.toString() : undefined,
    content: doc.content
});

export const getPost = async (context: any) => {
    let skip: number = context.query.skip ? context.query.skip : 0;
    let limit: number = context.query.limit ? context.query.limit : 25;
    if (limit > 25) { limit = 25 }

    let post: any;
    try {
        if (context.query.id) {
            post = await Post.findOne({ _id: context.query.id });
        } else if (context.query.bookId) {
            const posts = await Post.find({ bookId: context.query.bookId }).skip(skip).limit(limit);
            return posts.map(toPostDTO);
        } else {
            const posts = await Post.find().skip(skip).limit(limit);
            return posts.map(toPostDTO);
        }
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }

    if (!post) {
        throw context.status(404, { code: 404, message: `No such post id (${context.query.id})` });
    }
    return toPostDTO(post);
};

export const createPost = async (context: any, authorId: string) => {
    const body: any = context.body;

    if (!body.bookId) {
        throw context.status(400, { code: 400, message: "bookId is required" });
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

    let book: any;
    try {
        book = await Book.findById(body.bookId);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }

    if (!book) {
        throw context.status(404, { code: 404, message: `No such book id (${body.bookId})` });
    }
    if (book.authorId?.toString() !== authorId) {
        throw context.status(403, { code: 403, message: "not allowed to add a post to this book" });
    }

    try {
        const created = await Post.create(body);
        return toPostDTO(created);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }
};

export const updatePost = async (context: any, id: string, authorId: string) => {
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
        post = await Post.findById(id);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }

    if (!post) {
        throw context.status(404, { code: 404, message: `No such post id (${id})` });
    }

    const book: any = await Book.findById(post.bookId);
    if (!book || book.authorId?.toString() !== authorId) {
        throw context.status(403, { code: 403, message: "not allowed to update this post" });
    }

    try {
        const updated = await Post.findByIdAndUpdate(id, context.body, { new: true });
        return toPostDTO(updated);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }
};

export const deletePost = async (context: any, id: string, authorId: string) => {
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
        post = await Post.findById(id);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }

    if (!post) {
        throw context.status(404, { code: 404, message: `No such post id (${id})` });
    }

    const book: any = await Book.findById(post.bookId);
    if (!book || book.authorId?.toString() !== authorId) {
        throw context.status(403, { code: 403, message: "not allowed to delete this post" });
    }

    try {
        const deleted = await Post.findByIdAndDelete(id);
        return toPostDTO(deleted);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }
};
