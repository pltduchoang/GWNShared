import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalContextProvider } from "./utils/globalContext";
import { AuthContextProvider } from "./utils/authContext";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Grow Within Nutrition",
  description: "Nutritional counseling and coaching for a healthier you.",
};

export default function RootLayout({ children }) {
  return (
    <GlobalContextProvider>
      <AuthContextProvider>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </AuthContextProvider>
    </GlobalContextProvider>
  );
}
