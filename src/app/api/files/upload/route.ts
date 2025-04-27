import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth-server";
import { isNullish } from "remeda";
import { db } from "@/lib/db";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/s3";

export async function POST(request: Request) {
	try {
		const user = await getUser();

		const formData = await request.formData();
		const fileName = formData.get("fileName") as string;
		// const fileType = formData.get("fileType") as string;
		const fileId = formData.get("fileId") as string;

		if (isNullish(user)) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// If fileId is provided, this is a status update request
		if (fileId) {
			// const status = formData.get("status") as string;
			await db.file.update({
				where: { id: fileId },
				data: {
					originalUrl: "xxx",
				},
			});
			return NextResponse.json({ success: true });
		}

		// Otherwise, this is a new file upload request
		const dbFile = await db.file.create({
			data: {
				userId: user.id,
				status: "UPLOADING",
				originalUrl: "",
			},
		});

		// Generate a presigned URL for R2
		const command = new PutObjectCommand({
			Bucket: "uwa-wayfinding",
			Key: `${user.id}/${dbFile.id}/${fileName}`,
		});

		const presignedUrl = await getSignedUrl(s3Client, command, {
			expiresIn: 3600,
		});

		return NextResponse.json({
			file: dbFile,
			presignedUrl,
		});
	} catch (error) {
		console.error("Error handling file upload:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
