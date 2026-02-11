import { NextResponse } from "next/server";
import { XummSdk } from "xumm-sdk";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uuid = searchParams.get("uuid");

    if (!uuid) {
      return NextResponse.json(
        { error: "UUID requerido" },
        { status: 400 }
      );
    }

    const sdk = new XummSdk(
      process.env.XUMM_API_KEY!,
      process.env.XUMM_API_SECRET!
    );

    const result: any = await sdk.payload.get(uuid);

    return NextResponse.json({
      signed: result.meta?.signed ?? false,
      cancelled: result.meta?.cancelled ?? false,
      account: result.response?.account ?? null,
    });

  } catch (error) {
    console.error("Status error:", error);
    return NextResponse.json(
      { error: "Error consultando estado" },
      { status: 500 }
    );
  }
}
