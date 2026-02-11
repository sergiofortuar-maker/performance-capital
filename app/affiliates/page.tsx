import Link from "next/link";
export default function AffiliatesPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-4xl font-bold mb-4">
        Programa de Afiliados
      </h1>

      <p className="max-w-xl text-center text-gray-400 mb-8">
        Gana comisiones recomendando Performance Capital.
        Comparte tu enlace y cobra por cada trader que se registre.
      </p>

      <div className="flex gap-4">
        <Link href="/affiliates/register">
  <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
    Crear cuenta afiliado
  </button>
</Link>


        <button className="border border-white/30 px-6 py-3 rounded-lg hover:border-white transition">
          Ver comisiones
        </button>
      </div>
    </main>
  );
}
