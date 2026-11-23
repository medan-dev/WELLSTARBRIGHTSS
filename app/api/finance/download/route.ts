import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("target") || searchParams.get("type") || "installer";

  const distDir = path.join(process.cwd(), "desktop-finance-app", "dist");

  // If requesting download metadata / specs
  if (searchParams.get("info") === "1" || searchParams.get("format") === "json") {
    const installerFile = path.join(distDir, "Wellstar Finance POS Setup 1.0.0.exe");
    const portableFile = path.join(distDir, "Wellstar Finance POS 1.0.0.exe");
    const linuxFile = path.join(distDir, "wellstar-finance-desktop-1.0.0.tar.gz");

    return NextResponse.json({
      success: true,
      appName: "Wellstar Finance POS & Bursar Workstation",
      version: "1.0.0",
      architecture: "x64 (Windows 10/11, Linux, macOS)",
      syncGateway: "/api/finance/sync",
      files: {
        installer: {
          filename: "Wellstar-Finance-POS-Setup-1.0.0.exe",
          type: "NSIS Windows Setup",
          sizeBytes: fs.existsSync(installerFile) ? fs.statSync(installerFile).size : 76523831,
          sizeFormatted: "76.5 MB",
          downloadUrl: "/api/finance/download?target=installer",
        },
        portable: {
          filename: "Wellstar-Finance-POS-1.0.0.exe",
          type: "Portable Executable (No Install)",
          sizeBytes: fs.existsSync(portableFile) ? fs.statSync(portableFile).size : 76230388,
          sizeFormatted: "76.2 MB",
          downloadUrl: "/api/finance/download?target=portable",
        },
        linux: {
          filename: "wellstar-finance-desktop-1.0.0.tar.gz",
          type: "Linux & Cross-Platform Archive",
          sizeBytes: fs.existsSync(linuxFile) ? fs.statSync(linuxFile).size : 6291472,
          sizeFormatted: "6.2 MB",
          downloadUrl: "/api/finance/download?target=linux",
        },
      },
    });
  }

  let filename = "Wellstar Finance POS Setup 1.0.0.exe";
  let clientDownloadName = "Wellstar-Finance-POS-Setup-1.0.0.exe";
  let contentType = "application/vnd.microsoft.portable-executable";

  if (target === "portable") {
    filename = "Wellstar Finance POS 1.0.0.exe";
    clientDownloadName = "Wellstar-Finance-POS-1.0.0.exe";
    contentType = "application/vnd.microsoft.portable-executable";
  } else if (target === "linux" || target === "tar") {
    filename = "wellstar-finance-desktop-1.0.0.tar.gz";
    clientDownloadName = "wellstar-finance-desktop-1.0.0.tar.gz";
    contentType = "application/gzip";
  }

  const filePath = path.join(distDir, filename);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: `Executable package ${filename} was not found in build directory.` },
      { status: 404 }
    );
  }

  const stats = fs.statSync(filePath);
  const stream = fs.createReadStream(filePath);

  // Convert Node readable stream to Web ReadableStream
  const webStream = new ReadableStream({
    start(controller) {
      stream.on("data", (chunk) => controller.enqueue(chunk));
      stream.on("end", () => controller.close());
      stream.on("error", (err) => controller.error(err));
    },
  });

  return new Response(webStream, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${clientDownloadName}"`,
      "Content-Length": stats.size.toString(),
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
    },
  });
}
