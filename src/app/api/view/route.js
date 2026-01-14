import redis from "@/lib/redis";

export async function POST() {
    await redis.incr("portfolio:visits");
    await redis.lpush(
        "portfolio:visit_times",
        new Date().toISOString()
    );

    await redis.ltrim("portfolio:visit_times", 0, 199);

    return new Response("ok", { status: 200 });
}