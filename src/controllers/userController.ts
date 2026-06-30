import User from "../models/userModel";

export const readUsers = async () => {
    try {
        return await User.find();
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
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