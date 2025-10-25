import { NextResponse } from "next/server";
import { prisma } from "../../../prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json(users);
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    return NextResponse.json({ message: "Erro ao buscar usuários" }, { status: 500 });
  }
}
