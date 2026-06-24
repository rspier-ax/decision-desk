import { NextResponse } from "next/server";
import { demoScenarioSchema } from "@/schemas/demo.schema";
import { loadScenario } from "@/mocks/store";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = demoScenarioSchema.safeParse(body.scenario);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid scenario" }, { status: 400 });
  }
  return NextResponse.json({ session: loadScenario(parsed.data) });
}
