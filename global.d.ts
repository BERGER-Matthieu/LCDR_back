export {};

declare global {
    interface User {
        name: String,
        password: String,
        description: String
        email: String
    }

    interface HttpResponse {
        code: Number,
        result: any
    }
}