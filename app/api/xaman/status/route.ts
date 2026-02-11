import { NextResponse } from "next/server";
import { XummSdk } from "xumm-sdk";

const xumm = new XummSdk(
  process.env.XUMM_API_KEY!,
  process.env.XUMM_API_SECRET!
);

export async function POST(req: Request) {
  try {
    const { uuid } = await req.json();

    if (!uuid) {
      return NextResponse.json(
        { error: "UUID requerido" },
        { status: 400 }
      );
    }

    const payload = await xumm.payload.get(uuid);

    return NextResponse.json({
      signed: payload.meta.signed,
      cancelled: payload.meta.cancelled,
      account: payload.response?.account ?? null,
    });

  } catch (error) {
    console.error("STATUS ERROR:", error);
    return NextResponse.json(
      { error: "Error comprobando estado" },
      { status: 500 }
    );
  }
}
