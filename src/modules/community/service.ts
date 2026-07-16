import Community from "./model";
import User from "../user/model";

const toCommunityDTO = (doc: any) => ({
    _id: doc._id.toString(),
    name: doc.name,
    description: doc.description,
    creatorId: doc.creatorId ? doc.creatorId.toString() : undefined
});

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
            const communities = await Community.find().skip(skip).limit(limit);
            return communities.map(toCommunityDTO);
        }
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }

    if (!community) {
        throw context.status(404, { code: 404, message: `No such community (${context.query.id || context.query.name})` });
    }
    return toCommunityDTO(community);
};

export const createCommunity = async (context: any, creatorId: string) => {
    const body: any = context.body;

    if (!body.name) {
        throw context.status(400, { code: 400, message: "name is required" });
    }

    let creator: any;
    try {
        creator = await User.findById(creatorId);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }

    if (!creator) {
        throw context.status(404, { code: 404, message: `No such user id (${creatorId})` });
    }

    try {
        const created = await Community.create({ ...body, creatorId });
        return toCommunityDTO(created);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }
};

export const updateCommunity = async (context: any, id: string, creatorId: string) => {
    let creator: any;
    try {
        creator = await User.findById(creatorId);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }

    if (!creator) {
        throw context.status(404, { code: 404, message: `No such user id (${creatorId})` });
    }

    let community: any;
    try {
        community = await Community.findById(id);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }

    if (!community) {
        throw context.status(404, { code: 404, message: `No such community id (${id})` });
    }
    if (community.creatorId?.toString() !== creatorId) {
        throw context.status(403, { code: 403, message: "not allowed to update this community" });
    }

    try {
        const updated = await Community.findByIdAndUpdate(id, context.body, { new: true });
        return toCommunityDTO(updated);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }
};

export const deleteCommunity = async (context: any, id: string, creatorId: string) => {
    let creator: any;
    try {
        creator = await User.findById(creatorId);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }

    if (!creator) {
        throw context.status(404, { code: 404, message: `No such user id (${creatorId})` });
    }

    let community: any;
    try {
        community = await Community.findById(id);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }

    if (!community) {
        throw context.status(404, { code: 404, message: `No such community id (${id})` });
    }
    if (community.creatorId?.toString() !== creatorId) {
        throw context.status(403, { code: 403, message: "not allowed to delete this community" });
    }

    try {
        const deleted = await Community.findByIdAndDelete(id);
        return toCommunityDTO(deleted);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }
};
