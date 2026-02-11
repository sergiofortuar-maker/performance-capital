import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await someFunction(); // tu llamada real

    if (!payload) {
      return NextResponse.json(
        { error: "No payload returned" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      qr: payload.refs?.qr_png || null,
      uuid: payload.uuid || null,
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Connect failed" },
      { status: 500 }
    );
  }
}