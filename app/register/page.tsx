"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";
import PageTransition from "../components/PageTransition";

// Página de registro
export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cep, setCep] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success" | "">("");
  const [shake, setShake] = useState(false);

  // Validação de senha
  const isPasswordValid = (password: string) => {
  // Mínimo 8 caracteres, pelo menos 1 maiúscula, 1 número e 1 símbolo (!@#$%^&*()-_=+)
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/;
    return regex.test(password);
};

  // Validação de email
  const isEmailValid = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  // Gatilho de erro
  const triggerError = (msg: string) => {
    setMessageType("error");
    setMessage(msg);
    setShake(true);
    setTimeout(() => setShake(false), 400);
    setTimeout(() => setMessage(""), 4000);
  };

  // Manipula o registro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    // lista de erros
    const errors = [];

    if (!isEmailValid(email)) errors.push("email");
    if (!isPasswordValid(password)) errors.push("senha");
    if (!name.trim()) errors.push("nome");
    if (cep && !/^\d{8}$/.test(cep)) errors.push("cep");

    // Tratamento de erros
    if (errors.length > 1) {
      triggerError("Preencha corretamente todos os campos obrigatórios");
      return;
    } else if (errors.length === 1) {
      switch (errors[0]) {
        case "email":
          triggerError("Email inválido");
          return;
        case "senha":
          triggerError(
            "Senha deve ter pelo menos 8 caracteres, uma letra maiúscula, um número e um caractere especial"
          );
          return;
        case "nome":
          triggerError("Nome é obrigatório");
          return;
        case "cep":
          triggerError("CEP inválido. Deve conter 8 números");
          return;
      }
    }

    // Chama API de registro
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, cep, state, city }),
      });

      const data = await res.json();

      if (!res.ok) {
        triggerError(data.error || data.message || "Erro ao cadastrar usuário");
        return;
      }

      setMessageType("success");
      setMessage("Cadastro realizado com sucesso!");
      setTimeout(() => setMessage(""), 4000);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      console.error(err);
      triggerError("Erro ao conectar com o servidor");
    }
  };

  // Busca endereço pelo CEP
  const handleCepBlur = async () => {
    if (!cep) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setState(data.uf || "");
        setCity(data.localidade || "");
      } else {
        triggerError("CEP não encontrado.");
      }
    } catch (err) {
      console.error("Erro ao buscar CEP", err);
      triggerError("Erro ao buscar CEP");
    }
  };

  // Renderização
  return (
    <PageTransition>
      <div className={`${styles.container} ${shake ? styles.shake : ""}`}>
        <h1 className={styles.title}>Cadastro</h1>

        {message && (
          <p className={messageType === "error" ? styles.error : styles.success}>
            {message}
          </p>
        )}

        <form className={styles.form} onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="CEP"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            onBlur={handleCepBlur}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Estado"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Cidade"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Cadastrar
          </button>
        </form>

        <p className={styles.login}>
          Já tem uma conta?{" "}
          <span className={styles.loginLink} onClick={() => router.push("/login")}>
            Entre aqui
          </span>
        </p>
      </div>
    </PageTransition>
  );
}
