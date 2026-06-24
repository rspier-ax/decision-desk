import { NextResponse } from "next/server";
import { resetScenario } from "@/mocks/store";

export async function POST() {
  return NextResponse.json({ session: resetScenario() });
}
