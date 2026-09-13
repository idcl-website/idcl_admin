import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME ?? process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Parses a Cloudinary secure URL and returns the asset's public_id
// e.g. https://res.cloudinary.com/{cloud}/image/upload/v123456/folder/name.png -> folder/name
function extractPublicId(url: string): string | null {
    try {
        const parsed = new URL(url);
        const path = parsed.pathname;
        const marker = "/image/upload/";
        const idx = path.indexOf(marker);
        if (idx === -1) return null;

        let publicId = path.slice(idx + marker.length);
        publicId = publicId.replace(/^v\d+\//, '');
        publicId = publicId.replace(/\.[^.]+$/, '');

        return publicId || null;
    } catch {
        return null;
    }
}

export async function POST(request: NextRequest) {
    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
        return NextResponse.json(
            { message: "Cloudinary delete is not configured on the server." },
            { status: 500 }
        );
    }

    let url: string;
    try {
        const body = await request.json();
        url = body?.url;
    } catch {
        return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
    }

    if (!url || typeof url !== "string") {
        return NextResponse.json({ message: "Missing image URL." }, { status: 400 });
    }

    const publicId = extractPublicId(url);
    if (!publicId) {
        return NextResponse.json(
            { message: "Could not extract a public_id from the given URL." },
            { status: 400 }
        );
    }

    const timestamp = Math.round(Date.now() / 1000).toString();
    const toSign = `public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;
    const signature = crypto.createHash("sha1").update(toSign).digest("hex");

    try {
        const body = new URLSearchParams({
            public_id: publicId,
            timestamp,
            api_key: API_KEY!,
            signature,
        });

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
            { method: "POST", body }
        );

        const data = await response.json();

        if (data.result === "ok" || data.result === "not found") {
            return NextResponse.json({ message: "Deleted", result: data.result });
        }

        return NextResponse.json(
            { message: data.error?.message || "Cloudinary delete failed.", result: data.result },
            { status: 500 }
        );
    } catch {
        return NextResponse.json(
            { message: "Could not reach Cloudinary." },
            { status: 500 }
        );
    }
}