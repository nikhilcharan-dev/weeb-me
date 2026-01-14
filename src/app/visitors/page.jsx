import redis from "@/lib/redis";

export const dynamic = "force-dynamic";

export default async function VisitorsPage() {
    const total = await redis.get("portfolio:visits");

    return (
        <main style={{ padding: "3rem" }}>
            <h1>Visitors</h1>
            <p>Total Visits: <strong>{total ?? 0}</strong></p>
        </main>
    );
}
