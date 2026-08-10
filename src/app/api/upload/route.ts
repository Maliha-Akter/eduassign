import { NextRequest, NextResponse } from "next/server";

interface ImgBBResponse {
    success: boolean;
    status: number;
    data?: {
        url: string;
        // Use 'unknown' instead of 'any' for additional properties
        [key: string]: unknown; 
    };
    error?: {
        message: string;
    };
}

export async function POST(req: NextRequest) {
    try {
        const incomingFormData = await req.formData();
        const file = incomingFormData.get("image") as File | null;

        if (!file) {
            return NextResponse.json(
                { success: false, message: "No image file found" },
                { status: 400 }
            );
        }

        // Re-package exactly what ImgBB expects with clean typings
        const imgbbFormData = new FormData();
        imgbbFormData.append("image", file);

        const apiKey = process.env.NEXT_PUBLIC_IMAGE_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { success: false, message: "Missing Image API Key configuration" },
                { status: 500 }
            );
        }

        const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: "POST",
            body: imgbbFormData,
        });

        const imgbbData = (await res.json()) as ImgBBResponse;

        if (!imgbbData.success || !imgbbData.data) {
            console.error("ImgBB Error Response:", imgbbData);
            return NextResponse.json(
                { success: false, message: imgbbData.error?.message || "ImgBB upload failed" },
                { status: res.status }
            );
        }

        // Restructure the object so your frontend's `data.data.url` matches perfectly
        return NextResponse.json({
            success: true,
            data: {
                url: imgbbData.data.url,
            },
        });

    } catch (error: unknown) { // Changed 'any' to 'unknown'
        console.error("Upload API Route Error:", error);
        
        // Safely extract the error message
        const errorMessage = error instanceof Error ? error.message : "Internal server error";
        
        return NextResponse.json(
            { success: false, message: errorMessage },
            { status: 500 }
        );
    }
}