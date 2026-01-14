import redis from "@/lib/redis";
import Home from "./app";

export default async function HomePage() {
    await redis.incr("portfolio:visits");

    return <Home />;
}
