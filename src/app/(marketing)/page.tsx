import Link from "next/link";

export default function Home() {
  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          Impresión 3D sin complicaciones
        </h1>

        <p className="text-lg text-slate-600 mb-8">
          Cotiza tu pieza en minutos o cuéntanos tu idea. Nosotros la hacemos realidad.
        </p>

        <div className="flex gap-4">
          <Link
            href="/cotizar"
            className="px-6 py-3 bg-black text-white rounded-xl hover:opacity-90 transition"
          >
            Cotizar ahora
          </Link>

          <Link
            href="/contacto"
            className="px-6 py-3 border border-slate-300 rounded-xl hover:bg-slate-100 transition"
          >
            Hablar con nosotros
          </Link>
        </div>
      </div>
    </section>
  );
}