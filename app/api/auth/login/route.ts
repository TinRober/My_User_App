import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = "supersecret123";

export async function POST(req: NextRequest) {
  try {
    console.log("Requisição de login recebida");

    const body = await req.json();
    console.log("Body recebido:", body);

    const { email, password } = body;

    if (!email || !password) {
      console.log("Email ou senha não fornecidos");
      return NextResponse.json(
        { error: "Email e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    console.log("Usuário encontrado:", user);

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("Senha bate:", passwordMatch);

    if (!passwordMatch) {
      return NextResponse.json({ error: "Senha incorreta." }, { status: 400 });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("Token gerado:", token);

    return NextResponse.json({ message: "Login realizado com sucesso!", token, user });
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Erro ao realizar login." },
      { status: 500 }
    );
  }
}

