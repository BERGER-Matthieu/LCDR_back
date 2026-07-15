import User from "./model";

export const getUser = async (context: any) => {
    try {
        // Create the user variable that will be used for to store the findOne res
        let user: any
    
        // Const used for pagination
        let skip: number = context.query.skip ? context.query.skip : 0
        let limit: number = context.query.limit ? context.query.limit : 25
    
        if (limit > 25) {limit = 25};
    
        // Find user by ID
        if (context.query.id) {
            user = await User.findOne({_id: context.query.id});
            return {id: user._id, name: user.name, description: user.description}
        }
    
        // Find user by Name
        if (context.query.name) {
            user = await User.findOne({name: context.query.name});
            return {id: user._id, name: user.name, description: user.description}
        }
    
        // Return all user
        return await User.find().skip(skip).limit(limit);
    } catch(e) {
        console.log(e.message)
        const regex = /^null is not an object (evaluating 'user._id')$/;
        if (!regex.test(e.message)){
            throw context.status(400, `No such user id (${context.query.id})`);
        }
        throw context.status(500, e);
    }
};

export const logInUser = async (context: any): Promise<string> => {
    const { email, password } = context.query;

    let user: any;
    try {
        user = await User.findOne({ email: email });
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }

    if (!user) {
        throw context.status(404, `No such user (${email})`);
    }

    if (!(await Bun.password.verify(password, user.password))) {
        throw context.status(401, "invalid email or password");
    }

    return user._id.toString();
};


export const registerUser = async (context: any): Promise<string> => {
    const body: any = context.body;

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!body.email || !regex.test(body.email.toString())) {
        throw context.status(400, "invalid email format");
    }
    if (!body.password) {
        throw context.status(400, "password is required");
    }

    try {
        body.password = await Bun.password.hash(body.password);
        const newUser: any = await User.create(body);
        return newUser._id.toString();
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
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
        throw context.status(500, e);
    }

    if (!updated) {
        throw context.status(404, `No such user id (${id})`);
    }
    return updated;
};

export const deleteUser = async (context: any, id: string) => {
    let deleted: any;
    try {
        deleted = await User.findByIdAndDelete(id);
    } catch (e) {
        console.log(e.message)
        throw context.status(500, e);
    }

    if (!deleted) {
        throw context.status(404, `No such user id (${id})`);
    }
    return deleted;
};