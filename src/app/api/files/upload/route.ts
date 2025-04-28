import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth-server";
import { isNullish } from "remeda";
import { db } from "@/lib/db";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/s3";
import { FileStatus } from "@/prisma/index";
import { z } from "zod";

const uploadSchema = z.object({
	fileName: z.string().min(1, "fileName is required"),
});

const updateSchema = z.object({
	fileId: z.string().min(1, "fileId is required"),
	originalUrl: z.string().nullable().optional(),
});

export async function POST(request: Request) {
	try {
		const user = await getUser();

		const data = await request.json();
		const validationResult = uploadSchema.safeParse(data);
		if (!validationResult.success) {
			console.error("Validation error:", validationResult.error);
			return NextResponse.json(
				{ error: validationResult.error.errors[0].message },
				{ status: 400 },
			);
		}

		if (isNullish(user)) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const dbFile = await db.file.create({
			data: {
				userId: user.id,
				status: FileStatus.UPLOADING,
				originalUrl: "",
			},
		});

		const command = new PutObjectCommand({
			Bucket: "uwa-wayfinding",
			Key: dbFile.id,
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

export async function PATCH(request: Request) {
	try {
		const data = await request.json();

		const validationResult = updateSchema.safeParse(data);
		if (!validationResult.success) {
			console.error("Validation error:", validationResult.error);
			return NextResponse.json(
				{ error: validationResult.error.errors[0].message },
				{ status: 400 },
			);
		}

		const { fileId, originalUrl } = validationResult.data;

		const updateData: { status: FileStatus; originalUrl?: string } = {
			status: Math.random() < 0.5 ? FileStatus.CONVERTING : FileStatus.SUCCESS,
		};

		if (originalUrl) {
			updateData.originalUrl = originalUrl;
		}

		await db.file.update({
			where: { id: fileId },
			data: updateData,
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error handling file status update:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
