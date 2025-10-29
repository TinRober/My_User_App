// app/api/login-history/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = "supersecret123";

export async function GET(req: NextRequest) {
  try {
    // Pega o token do header Authorization
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verifica o token
    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const userId = payload.id;

    // Busca os últimos logins do usuário logado
    const history = await prisma.loginHistory.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      take: 5, // pega os últimos 5 acessos
      select: {
        id: true,
        timestamp: true,
        ip: true,
        userAgent: true,
      },
    });

    // Formata os dados para envio
    const formatted = history.map((h) => ({
      id: h.id,
      timestamp: h.timestamp.toISOString(),
      ip: h.ip || "IP desconhecido",
      userAgent: h.userAgent || "Desconhecido",
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("Erro ao buscar histórico:", err);
    return NextResponse.json(
      { error: "Erro ao buscar histórico" },
      { status: 500 }
    );
  }
}
