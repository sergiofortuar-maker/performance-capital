import { getWithdraws, markAsPaid } from "@/lib/withdrawStore";

export default function AdminPage() {
  const withdraws = getWithdraws();

  return (
    <main style={{ padding: 40 }}>
      <h1>Retiros pendientes</h1>

      {withdraws.length === 0 && <p>No hay solicitudes de retiro</p>}

      {withdraws.map((w) => (
        <div
          key={w.id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 15,
          }}
        >
          <p><strong>Wallet:</strong> {w.wallet}</p>
          <p><strong>Cantidad:</strong> {w.amount} XRP</p>
          <p><strong>Fecha:</strong> {new Date(w.createdAt).toLocaleString()}</p>
          <p><strong>Estado:</strong> {w.status}</p>

          {w.status === "pending" && (
            <form action={async () => {
              "use server";
              markAsPaid(w.id);
            }}>
              <button style={{ marginTop: 10 }}>
                Marcar como pagado
              </button>
            </form>
          )}
        </div>
      ))}
    </main>
  );
}
