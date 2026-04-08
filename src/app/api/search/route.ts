import { NextRequest, NextResponse } from "next/server";

import { searchEntities } from "@/lib/data";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";
  const items = await searchEntities(query);

  return NextResponse.json({ items });
}
