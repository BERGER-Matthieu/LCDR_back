import User from "../models/userModel";

export const readUsers = async (id? : string) => {
    try {
        if (id) {
            return await User.findById(id);
        } else {
            return await User.find();
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

export const updateUser = async (id: string, body: User) => {
    try {
        return await User.findByIdAndUpdate(id, body);
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

export const createUser = async (body: User) => {
    try {
        const newUser = new User(body);
        await newUser.save();
        return newUser;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

export const deleteUser = async (id: string) => {
    try {
        return await User.findByIdAndDelete(id);
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};