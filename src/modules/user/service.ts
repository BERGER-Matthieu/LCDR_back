import User from "./model";

export const getUser = async (context: any) => {
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
};

export const logInUser = async ({email, password}: {email: String, password: String}) : Promise<String | boolean> => {
    // Get the user using this email
    const user: any = await User.findOne({email: email});

    // Return if the hash of the password correspond to the incoming user password
    return await Bun.password.verify(password, user.password) ? user._id.toString() : false;
}

export const registerUser = async (body: User) : Promise<string>  => {
    // Check if the email format is right
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(body.email.toString())){
        throw ("invalid email");
    }

    // Encrypt the password
    const bcryptPassword = await Bun.password.hash(body.password);
    body.password = bcryptPassword;

    // Create new user and return the user id: string
    const newUser: any = await User.create(body)
    return newUser._id.toString();
};

export const updateUser = async (body: User, id: string) => {
    if (body.password) {
        body.password = await Bun.password.hash(body.password)
    }
    return await User.findByIdAndUpdate(id, body);
}

export const deleteUser = async (id: string) => {
    return await User.findByIdAndDelete(id);
}