import { NextResponse } from "next/server";
import { XummSdk } from "xumm-sdk";

const xumm = new XummSdk(
  process.env.XUMM_API_KEY!,
  process.env.XUMM_API_SECRET!
);

export async function GET() {
  try {
    const payload = await xumm.payload.create({
      txjson: {
        TransactionType: "SignIn"
      }
    });

    return NextResponse.json({
      qr: payload.refs.qr_png,
      uuid: payload.uuid
    });
  } catch (error) {
    console.error("XAMAN CONNECT ERROR:", error);
    return NextResponse.json(
      { error: "Error conectando billetera" },
      { status: 500 }
    );
  }
}
