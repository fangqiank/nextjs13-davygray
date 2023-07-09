import { NextRequest, NextResponse } from "next/server"
import { revalidateTag } from "next/cache"

export const GET =async (req: NextRequest) => {
	const tag = req.nextUrl.searchParams.get('settings') as string
	revalidateTag(tag)
	return NextResponse.json({ revalidated: true, now: Date.now() })
}