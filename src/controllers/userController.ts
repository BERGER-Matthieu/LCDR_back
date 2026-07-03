import * as userService from "../services/userService";

export const readUsers = async () => {
    try {
        return await userService.findUsers();
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const readUsersById = async (id: string): Promise<HttpResponse> => {
    try {
        const res: any = await userService.findUserById(id);
        if (!res) {
            throw {code: 400, result: "No such user"};
        }
        return {code: 200, result: res};
    } catch (error: any) {
        const code: Number = error.code ? error.code : 500;
        const result: String = error.result ? error.result : error;
        throw {code: code, result: result};
    }
};

export const readUsersByEmail = async (email: string): Promise<HttpResponse> => {
    try {
        const res: any = await userService.findUserByEmail(email);
        if (!res) {
            throw {code: 400, result: "No such user"};
        }
        return {code: 200, result: res}
    } catch (error: any) {
        const code: Number = error.code ? error.code : 500;
        const result: String = error.result ? error.result : error;
        throw {code: code, result: result};
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
        return await userService.saveUser(body);
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
