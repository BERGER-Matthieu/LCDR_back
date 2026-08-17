import { Elysia, t } from "elysia";
import mongoose from "mongoose";

export const health = new Elysia()
    .get("/health", ({ set }) => {
        const dbConnected = mongoose.connection.readyState === 1;

        if (!dbConnected) {
            set.status = 503;
        }

        return {
            status: dbConnected ? "ok" : "degraded",
            db: dbConnected ? "connected" : "disconnected",
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        };
    }, {
        response: {
            200: t.Object({
                status: t.String(),
                db: t.String(),
                uptime: t.Number(),
                timestamp: t.String()
            }),
            503: t.Object({
                status: t.String(),
                db: t.String(),
                uptime: t.Number(),
                timestamp: t.String()
            })
        },
        detail: {
            tags: ["Health"],
            summary: "Health check",
            description: "Reports service uptime and MongoDB connection status. Returns 503 if the database is not connected."
        }
    });
