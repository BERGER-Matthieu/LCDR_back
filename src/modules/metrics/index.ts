import { Elysia, t } from "elysia";
import { register, httpRequestsTotal, httpRequestDuration } from "./registry";

export const metrics = new Elysia()
    .onRequest(({ request }) => {
        (request as any).__startTime = process.hrtime.bigint();
    })
    .onAfterResponse(({ request, route, set }) => {
        const start = (request as any).__startTime as bigint | undefined;
        if (!start) return;

        const durationSeconds = Number(process.hrtime.bigint() - start) / 1e9;
        const method = request.method;
        const status = String(set.status ?? 200);

        httpRequestsTotal.inc({ method, route, status });
        httpRequestDuration.observe({ method, route }, durationSeconds);
    })
    .as("global")
    .get("/metrics", async ({ set }) => {
        set.headers["content-type"] = register.contentType;
        return await register.metrics();
    }, {
        response: {
            200: t.String()
        },
        detail: {
            tags: ["Metrics"],
            summary: "Prometheus metrics",
            description: "Exposes application and process metrics (HTTP request counts, request duration histogram, memory/CPU) in Prometheus text exposition format, for scraping by an external Prometheus server."
        }
    });
