import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Octane Labs | Impresión 3D",
  description:
    "Impresión 3D de alta calidad: piezas funcionales, prototipos y personalizados. Cotiza subiendo tu STL.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
