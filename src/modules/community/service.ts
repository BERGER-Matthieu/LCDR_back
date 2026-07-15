import Community from "./model";
import User from "../user/model";

export const getCommunity = async (context: any) => {
    let skip: number = context.query.skip ? context.query.skip : 0;
    let limit: number = context.query.limit ? context.query.limit : 25;
    if (limit > 25) { limit = 25 }

    let community: any;
    try {
        if (context.query.id) {
            community = await Community.findOne({ _id: context.query.id });
        } else if (context.query.name) {
            community = await Community.findOne({ name: context.query.name });
        } else {
            return await Community.find().skip(skip).limit(limit);
        }
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }

    if (!community) {
        throw context.status(404, `No such community (${context.query.id || context.query.name})`);
    }
    return community;
};

export const createCommunity = async (context: any, creatorId: string) => {
    const body: any = context.body;

    if (!body.name) {
        throw context.status(400, "name is required");
    }

    let creator: any;
    try {
        creator = await User.findById(creatorId);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }

    if (!creator) {
        throw context.status(404, `No such user id (${creatorId})`);
    }

    try {
        return await Community.create({ ...body, creatorId });
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }
};

export const updateCommunity = async (context: any, id: string, creatorId: string) => {
    let creator: any;
    try {
        creator = await User.findById(creatorId);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }

    if (!creator) {
        throw context.status(404, `No such user id (${creatorId})`);
    }

    let community: any;
    try {
        community = await Community.findById(id);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }

    if (!community) {
        throw context.status(404, `No such community id (${id})`);
    }
    if (community.creatorId?.toString() !== creatorId) {
        throw context.status(403, "not allowed to update this community");
    }

    try {
        return await Community.findByIdAndUpdate(id, context.body, { new: true });
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }
};

export const deleteCommunity = async (context: any, id: string, creatorId: string) => {
    let creator: any;
    try {
        creator = await User.findById(creatorId);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }

    if (!creator) {
        throw context.status(404, `No such user id (${creatorId})`);
    }

    let community: any;
    try {
        community = await Community.findById(id);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }

    if (!community) {
        throw context.status(404, `No such community id (${id})`);
    }
    if (community.creatorId?.toString() !== creatorId) {
        throw context.status(403, "not allowed to delete this community");
    }

    try {
        return await Community.findByIdAndDelete(id);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }
};


