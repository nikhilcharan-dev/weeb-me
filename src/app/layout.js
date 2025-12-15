import { Zen_Kaku_Gothic_Antique } from "next/font/google";
import "./globals.css";

export const metadata = {
    title: "Portfolio",
    description: "This is my portfolio, It digitalises my journey.",
    icons: {
        icon: "/images/icon.png",
    },
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
};

const zenKaku = Zen_Kaku_Gothic_Antique({
    subsets: ["latin", "japanese"],
    weight: ["300", "400", "500", "700"],
    display: "swap",
});

export default function RootLayout({ children }) {
  return (
      <html lang="en">
        <body>
            {children}
        </body>
      </html>
  );
}
