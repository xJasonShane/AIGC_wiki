import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "./auth";

export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, admin: { id: string; username: string }) => Promise<NextResponse>
): Promise<NextResponse> {
  const admin = await getCurrentAdmin();
  
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  return handler(request, admin);
}
