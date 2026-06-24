import { NextResponse } from "next/server";
import { parseDemoSessionState } from "@/schemas/demo.schema";
import { exportSession, hydrateSession } from "@/mocks/store";

export async function GET() {
  return NextResponse.json({ session: exportSession() });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const parsed = parseDemoSessionState(body.session ?? body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid demo session payload" }, { status: 400 });
  }
  return NextResponse.json({ session: hydrateSession(parsed.data) });
}
