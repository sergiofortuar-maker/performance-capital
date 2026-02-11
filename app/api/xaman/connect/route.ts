import { NextResponse } from "next/server";
import { XummSdk } from "xumm-sdk";

export const runtime = "nodejs";

export async function GET() {
  try {
    const sdk = new XummSdk(
      process.env.XUMM_API_KEY!,
      process.env.XUMM_API_SECRET!
    );

    const payload = await sdk.payload.create({
      TransactionType: "SignIn",
    });

    return NextResponse.json({
      uuid: payload.uuid,
      qr: payload.refs.qr_png,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creating payload" }, { status: 500 });
  }
}
