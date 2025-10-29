import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = "supersecret123"; 

// Função utilitária para verificar se o usuário é admin
async function verifyAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return { error: "Acesso negado: token não fornecido", status: 401 };
  }

  const token = authHeader.split(" ")[1];
  if (!token) return { error: "Acesso negado: token inválido", status: 401 };

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
    if (decoded.role !== "admin") {
      return { error: "Acesso negado: você não é administrador", status: 403 };
    }
    return { decoded };
  } catch {
    return { error: "Acesso negado: token inválido ou expirado", status: 401 };
  }
}

// GET → listar usuários
export async function GET(req: NextRequest) {
  const check = await verifyAdmin(req);
  if ("error" in check) return NextResponse.json({ error: check.error }, { status: check.status });

  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao listar usuários" }, { status: 500 });
  }
}

// PATCH → editar nome do usuário
export async function PATCH(req: NextRequest) {
  const check = await verifyAdmin(req);
  if ("error" in check) return NextResponse.json({ error: check.error }, { status: check.status });

  try {
    const { id, name } = await req.json();
    if (!id || !name) return NextResponse.json({ error: "ID e nome são obrigatórios" }, { status: 400 });

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 });
  }
}

// DELETE → deletar usuário
export async function DELETE(req: NextRequest) {
  const check = await verifyAdmin(req);
  if ("error" in check) return NextResponse.json({ error: check.error }, { status: check.status });

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao deletar usuário" }, { status: 500 });
  }
}
