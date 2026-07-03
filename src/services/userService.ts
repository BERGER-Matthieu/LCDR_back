import User from "../models/userModel";

export const findUsers = async () => {
    try {
        return await User.find();
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const findUserById = async (id : string) => {
    try {
        return await User.findOne({_id: id});
    } catch (error) {
        throw error;
    }
};

export const findUserByEmail = async (email : string) => {
    try {
        return await User.findOne({email: email});
    } catch (error) {
        throw error;
    }
};

export const findUserByIdAndUpdate = async (id: string, body: User) => {
    try {
        await User.findByIdAndUpdate(id, body);
        return await findUserById(id)
    } catch (error) {
        throw error;
    }
};

export const saveUser = async (body: User) => {
    try {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(body.email)){
            throw("invalid email");
        }

        const bcryptPassword = await Bun.password.hash(body.password, {
            algorithm: "bcrypt",
            cost: 4,
        });
        body.password = bcryptPassword;

        const newUser = new User(body);
        await newUser.save();
        return newUser;
    } catch (error) {
        throw error;
    }
};

export const findUserByIdAndDelete = async (id: string) => {
    try {
        return await User.findByIdAndDelete(id);
    } catch (error) {
        throw error;
    }
};