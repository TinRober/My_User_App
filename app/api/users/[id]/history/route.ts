import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = Number(params.id);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    // Busca SOMENTE o histórico desse usuário
    const history = await prisma.loginHistory.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      select: {
        id: true,
        timestamp: true,
        ip: true,
        userAgent: true,
      },
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    return NextResponse.json({ error: "Erro ao buscar histórico" }, { status: 500 });
  }
}
