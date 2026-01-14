import Home from "./app";
import { Analytics } from "@vercel/analytics/next"

export default async function HomePage() {

    return (
        <>
            <Home />
            <Analytics />
        </>
    );
}
