import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Octane Labs | Impresión 3D",
  description: "Piezas impresas en 3D sin complicaciones. Sube tu solicitud o cuéntanos tu idea.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-[#F6F7F9] text-[#0F172A]">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
