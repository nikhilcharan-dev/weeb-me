import redis from "@/lib/redis";

export async function POST() {
    await redis.incr("portfolio:reached_end");

    return new Response("ok", { status: 200 });
}
