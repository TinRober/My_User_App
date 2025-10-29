// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = "supersecret123";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Validação básica
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Busca usuário no banco
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Verifica senha
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Senha incorreta" },
        { status: 400 }
      );
    }

    // Registrar login com IP e User-Agent
    const ip = req.headers.get("x-forwarded-for") || req.ip || "IP desconhecido";
    const userAgent = req.headers.get("user-agent") || "Navegador desconhecido";

    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        timestamp: new Date(),
        ip,
        userAgent,
      },
    });

    // Gerar token JWT (1h de validade)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Retornar token e dados do usuário
    return NextResponse.json({
      message: "Login realizado com sucesso!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Erro ao realizar login" },
      { status: 500 }
    );
  }
}
