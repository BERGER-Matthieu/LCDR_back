import User from "../models/userModel";

export const findUsers = async () => {
    try {
        return await User.find();
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

export const findUserById = async (id? : string) => {
    try {
        return await User.findById(id);
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

export const findUserByIdAndUpdate = async (id: string, body: User) => {
    try {
        await User.findByIdAndUpdate(id, body);
        return await findUserById(id)
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

export const saveUser = async (body: User) => {
    try {
        const newUser = new User(body);
        await newUser.save();
        return newUser;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

export const findUserByIdAndDelete = async (id: string) => {
    try {
        return await User.findByIdAndDelete(id);
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};