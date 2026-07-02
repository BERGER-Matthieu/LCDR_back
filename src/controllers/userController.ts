import User from "../models/userModel";
import * as userService from "../services/userService";

export const readUsers = async (id? : string) => {
    try {
        if (id) {
            return await userService.findUserById(id);
        } else {
            return await userService.findUsers();
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

export const updateUser = async (id: string, body: User) => {
    try {
        return await userService.findUserByIdAndUpdate(id, body);
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

export const createUser = async (body: User) => {
    try {
        userService.saveUser(body)
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

export const deleteUser = async (id: string) => {
    try {
        return await userService.findUserByIdAndDelete(id);
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};