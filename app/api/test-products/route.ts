import { NextResponse } from "next/server"
import { getAllProductsFromDb } from "@/lib/products-db"

export async function GET() {
  try {
    const products = await getAllProductsFromDb()
    return NextResponse.json({
      ok: true,
      count: products.length,
      data: products.slice(0, 3),
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}