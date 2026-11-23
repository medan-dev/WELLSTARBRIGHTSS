import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const downloadUrl = new URL("/downloads/Wellstar-Finance-POS-Setup-1.0.0.exe", url.origin);
  return NextResponse.redirect(downloadUrl);
}
