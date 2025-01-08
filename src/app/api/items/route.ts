// src/app/api/items/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')

  try {
    let where: Prisma.ItemWhereInput = {}
    
    if (search) {
      where = {
        OR: [
          { name: { contains: search } },
          { position: { contains: search } },
          { details: { contains: search } }
        ]
      }
    }

    const items = await prisma.item.findMany({
      where,
      orderBy: {
        position: 'asc'
      },
    })

    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    )
  }
}