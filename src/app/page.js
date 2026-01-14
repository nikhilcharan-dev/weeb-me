import redis from "@/lib/redis";
import Home from "./app";

export default async function HomePage() {
    await redis.incr("portfolio:visits");
    await redis.lpush(
        "portfolio:visit_times",
        new Date().toISOString()
    );

    await redis.ltrim("portfolio:visit_times", 0, 199);
    return <Home />;
}
