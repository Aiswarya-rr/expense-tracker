import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    return NextResponse.json({ message: "MongoDB connected successfully" })
  } catch (error) {
    console.error("MongoDB connection error:", error)
    return NextResponse.json(
      { error: "Failed to connect to MongoDB" },
      { status: 500 }
    )
  }
}
