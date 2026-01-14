import redis from "@/lib/redis";
import Main from "@/app/visitors/index";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function VisitorsPage() {
    const total = await redis.get("portfolio:visits");
    const reachedEnd = await redis.get("portfolio:reached_end");
    const times = await redis.lrange(
        "portfolio:visit_times",
        0,
        199
    );

    return (
        <Main
            total={total ?? "0"}
            reachedEnd={reachedEnd ?? "0"}
            times={times}
        />
    );
}
