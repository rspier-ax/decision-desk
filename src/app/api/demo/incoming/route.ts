import { NextResponse } from "next/server";
import { addIncomingCasesToStore } from "@/mocks/store";

export async function POST() {
  const result = addIncomingCasesToStore();
  return NextResponse.json(result);
}
