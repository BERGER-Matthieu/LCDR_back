import User from "./model";

export const getUser = async (context: any) => {
    try {
        let user: any

        let skip: number = context.query.skip ? context.query.skip : 0
        let limit: number = context.query.limit ? context.query.limit : 25

        if (limit > 25) {limit = 25};

        if (context.query.id) {
            user = await User.findOne({_id: context.query.id});
            return { id: user._id.toString(), name: user.name, description: user.description };
        }

        if (context.query.name) {
            user = await User.findOne({name: context.query.name});
            return { id: user._id.toString(), name: user.name, description: user.description };
        }

        const users = await User.find().skip(skip).limit(limit);
        return users.map((u: any) => ({ id: u._id.toString(), name: u.name, description: u.description }));
    } catch(e) {
        console.log(e.message)
        const regex = /^null is not an object (evaluating 'user._id')$/;
        if (!regex.test(e.message)){
            throw context.status(400, { code: 400, message: `No such user id (${context.query.id})` });
        }
        throw context.status(500, { code: 500, message: e.message });
    }
};

export const logInUser = async (context: any): Promise<string> => {
    const { email, password } = context.query;

    let user: any;
    try {
        user = await User.findOne({ email: email });
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }

    if (!user) {
        throw context.status(404, { code: 404, message: `No such user (${email})` });
    }
    console.log(user.password)
    console.log(await Bun.password.verify(password, user.password))
    if (!(await Bun.password.verify(password, user.password))) {
        throw context.status(401, { code: 401, message: "invalid email or password" });
    }

    return user._id.toString();
};


export const registerUser = async (context: any): Promise<string> => {
    const body: any = context.body;

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!body.email || !regex.test(body.email.toString())) {
        throw context.status(400, { code: 400, message: "invalid email format" });
    }
    if (!body.password) {
        throw context.status(400, { code: 400, message: "password is required" });
    }

    try {
        body.password = await Bun.password.hash(body.password);
        const newUser: any = await User.create(body);
        return newUser._id.toString();
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }
};

export const updateUser = async (context: any, id: string) => {
    const body: any = context.body;
    if (body.password) {
        body.password = await Bun.password.hash(body.password);
    }

    let updated: any;
    try {
        updated = await User.findByIdAndUpdate(id, body, { new: true });
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }

    if (!updated) {
        throw context.status(404, { code: 404, message: `No such user id (${id})` });
    }
    return updated;
};

export const deleteUser = async (context: any, id: string) => {
    let deleted: any;
    try {
        deleted = await User.findByIdAndDelete(id);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, { code: 500, message: e.message });
    }

    if (!deleted) {
        throw context.status(404, { code: 404, message: `No such user id (${id})` });
    }
    return deleted;
};
