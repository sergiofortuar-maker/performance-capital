import { NextResponse } from "next/server";

// 🔥 IMPORTANTE: Forzar runtime Node para SDK blockchain
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // ⚠️ Aquí debes poner tu lógica real de creación de payload
    // Ejemplo simulado (reemplaza por tu SDK real de Xaman)
    const payload = await createXamanPayload();

    if (!payload) {
      return NextResponse.json(
        { error: "No payload returned" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      qr: payload.refs?.qr_png ?? null,
      uuid: payload.uuid ?? null,
    });

  } catch (error: any) {
    console.error("Xaman connect error:", error);

    return NextResponse.json(
      { error: error?.message || "Connect failed" },
      { status: 500 }
    );
  }
}

/**
 * 🔹 Simulación temporal
 * Reemplaza esto por tu llamada real al SDK de Xaman
 */
async function createXamanPayload() {
  return {
    uuid: "demo-uuid",
    refs: {
      qr_png: "https://dummyimage.com/300x300/000/fff"
    }
  };
}
