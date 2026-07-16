import Book from "./model";
import User from "../user/model";
import Community from "../community/model";

const toBookDTO = (doc: any) => ({
    _id: doc._id.toString(),
    authorId: doc.authorId ? doc.authorId.toString() : undefined,
    communityId: doc.communityId ? doc.communityId.toString() : undefined,
    name: doc.name,
    description: doc.description
});

export const getBook = async (context: any) => {
    let skip: number = context.query.skip ? context.query.skip : 0;
    let limit: number = context.query.limit ? context.query.limit : 25;
    if (limit > 25) { limit = 25 }

    let book: any;
    try {
        if (context.query.id) {
            book = await Book.findOne({ _id: context.query.id });
        } else if (context.query.name) {
            book = await Book.findOne({ name: context.query.name });
        } else if (context.query.communityId) {
            const books = await Book.find({ communityId: context.query.communityId }).skip(skip).limit(limit);
            return books.map(toBookDTO);
        } else {
            const books = await Book.find().skip(skip).limit(limit);
            return books.map(toBookDTO);
        }
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }

    if (!book) {
        throw context.status(404, { code: 404, message: `No such book id (${context.query.id || context.query.name})` });
    }
    return toBookDTO(book);
};

export const createBook = async (context: any, authorId: string) => {
    const body: any = context.body;

    if (!body.communityId) {
        throw context.status(400, { code: 400, message: "communityId is required" });
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

    let community: any;
    try {
        community = await Community.findById(body.communityId);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }

    if (!community) {
        throw context.status(404, { code: 404, message: `No such community id (${body.communityId})` });
    }

    try {
        const created = await Book.create({ ...body, authorId });
        return toBookDTO(created);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }
};

export const updateBook = async (context: any, id: string, authorId: string) => {
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
        book = await Book.findById(id);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }

    if (!book) {
        throw context.status(404, { code: 404, message: `No such book id (${id})` });
    }
    if (book.authorId?.toString() !== authorId) {
        throw context.status(403, { code: 403, message: "not allowed to update this book" });
    }

    try {
        const updated = await Book.findByIdAndUpdate(id, context.body, { new: true });
        return toBookDTO(updated);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }
};

export const deleteBook = async (context: any, id: string, authorId: string) => {
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
        book = await Book.findById(id);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }

    if (!book) {
        throw context.status(404, { code: 404, message: `No such book id (${id})` });
    }
    if (book.authorId?.toString() !== authorId) {
        throw context.status(403, { code: 403, message: "not allowed to delete this book" });
    }

    try {
        const deleted = await Book.findByIdAndDelete(id);
        return toBookDTO(deleted);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }
};
