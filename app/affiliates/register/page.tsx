export default function AffiliateRegister() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-4xl font-bold mb-6">
        Registro de Afiliados
      </h1>

      <form className="w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          className="w-full px-4 py-3 rounded bg-gray-900 border border-gray-700"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 rounded bg-gray-900 border border-gray-700"
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full px-4 py-3 rounded bg-gray-900 border border-gray-700"
        />

        <button
          type="submit"
          className="w-full bg-white text-black py-3 rounded font-semibold hover:bg-gray-200 transition"
        >
          Crear cuenta
        </button>
      </form>
    </main>
  );
}
