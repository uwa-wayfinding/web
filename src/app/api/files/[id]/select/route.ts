import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth-server";
import { isNullish } from "remeda";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;

	try {
		const user = await getUser();
		if (isNullish(user)) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const file = await db.file.findUnique({
			where: { id },
		});

		if (isNullish(file)) {
			return NextResponse.json({ error: "File not found" }, { status: 404 });
		}

		if (file.userId !== user.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (file.status !== "SUCCESS") {
			return NextResponse.json(
				{ error: "Only successful files can be set as public" },
				{ status: 400 },
			);
		}

		// Start a transaction to update all files atomically
		await db.$transaction([
			// Set all user's files to not public
			db.file.updateMany({
				where: { userId: user.id },
				data: { isPublic: false },
			}),
			// Set the selected file to public
			db.file.update({
				where: { id },
				data: { isPublic: true },
			}),
		]);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error selecting file:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
