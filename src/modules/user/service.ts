import User from "./model";

export const getUser = async (context: any) => {
    let user: any
    if (context.query.id) {
        user = await User.findOne({_id: context.query.id});
        return {id: user._id, name: user.name, description: user.description}
    }

    if (context.query.name) {
        user = await User.findOne({name: context.query.name});
        return {id: user._id, name: user.name, description: user.description}
    }

    return await User.find();
};

export const registerUser = async (body: User) : Promise<string>  => {
    // Check if the email format is right
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(body.email)){
        throw ("invalid email");
    }

    // Encrypt the password
    const bcryptPassword = await Bun.password.hash(body.password, {
        algorithm: "bcrypt",
        cost: 4,
    });
    body.password = bcryptPassword;

    // Create new user and return the user id: string
    const newUser: any = await User.create(body)
    return newUser._id.toString();
};