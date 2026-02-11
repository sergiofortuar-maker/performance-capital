import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface StatusPayload {
  meta?: {
    signed?: boolean;
    cancelled?: boolean;
  };
  response?: {
    account?: string;
  };
}

export async function GET(req: Request) {
  try {
    // 🔹 Simulación temporal (reemplaza por tu SDK real)
    const payload: StatusPayload | null = {
      meta: {
        signed: true,
        cancelled: false,
      },
      response: {
        account: "rDemoWalletAddress",
      },
    };

    // 🔥 Protección contra null
    if (!payload) {
      return NextResponse.json(
        { error: "Payload is null" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      signed: payload.meta?.signed ?? false,
      cancelled: payload.meta?.cancelled ?? false,
      account: payload.response?.account ?? null,
    });

  } catch (error: any) {
    console.error("Status error:", error);

    return NextResponse.json(
      { error: error?.message || "Status check failed" },
      { status: 500 }
    );
  }
}
