import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../prisma";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

// Rota de registro
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, password, cep, state, city } = data;

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Campos obrigatórios faltando" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "Email já cadastrado" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        cep,
        state,
        city,
        role: "user", 
      },
    });

    return NextResponse.json({ message: "Usuário criado com sucesso!", user: newUser });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Erro ao conectar com o servidor" }, { status: 500 });
  }
}
