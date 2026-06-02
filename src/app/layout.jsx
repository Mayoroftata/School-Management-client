import "./globals.css";
import ToastProvider from "../components/ToastProvider";

export const metadata = {
  title: "Greenfield College Portal",
  description: "School management system for Nigerian secondary schools"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
