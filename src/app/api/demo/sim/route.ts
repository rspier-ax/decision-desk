import { NextResponse } from "next/server";
import { demoSimSettingsSchema } from "@/schemas/demo.schema";
import { updateSimSettings } from "@/mocks/store";

export async function PATCH(request: Request) {
  const body = await request.json();
  const parsed = demoSimSettingsSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid simulation settings" }, { status: 400 });
  }
  return NextResponse.json({ session: updateSimSettings(parsed.data) });
}
