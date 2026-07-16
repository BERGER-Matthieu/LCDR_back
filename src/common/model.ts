import { t } from "elysia";

export const errorResponse = t.Object({
    code: t.Number(),
    message: t.String()
});
