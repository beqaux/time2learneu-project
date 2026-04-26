import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Time2LearnEU — Avrupa Birliği Quiz Oyunu",
  description:
    "AB hakkında sınırlı bilgiye sahip öğrenciler için tasarlanmış interaktif quiz oyunu. Çoktan seçmeli, serbest metin ve eşleştirme sorularıyla AB'yi öğren!",
  openGraph: {
    title: "Time2LearnEU",
    description: "Avrupa Birliği hakkında bilgini test et!",
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
