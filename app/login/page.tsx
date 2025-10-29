"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import PageTransition from "../components/PageTransition";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação de campos obrigatórios
    if (!email || !password) {
      setError("Preencha todos os campos obrigatórios");
      const container = document.querySelector(`.${styles.container}`);
      if (container) {
        container.classList.add(styles.shake);
        setTimeout(() => container.classList.remove(styles.shake), 300);
      }
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Usuário ou senha incorretos");

        const container = document.querySelector(`.${styles.container}`);
        if (container) {
          container.classList.add(styles.shake);
          setTimeout(() => container.classList.remove(styles.shake), 300);
        }

        setTimeout(() => setError(""), 3000);
        return;
      }

      // Salva user e token
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      // Mensagem de sucesso
      setSuccess("Login efetuado com sucesso!");
      setTimeout(() => setSuccess(""), 3000);

      // Redireciona
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar com o servidor");

      const container = document.querySelector(`.${styles.container}`);
      if (container) {
        container.classList.add(styles.shake);
        setTimeout(() => container.classList.remove(styles.shake), 300);
      }

      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <PageTransition>
      <div className={styles.container}>
        <h1 className={styles.title}>Login</h1>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <form className={styles.form} onSubmit={handleLogin}>
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
          <button type="submit" className={styles.button}>
            Entrar
          </button>
        </form>

        <p className={styles.register}>
          Ainda não tem uma conta?{" "}
          <span
            className={styles.registerLink}
            onClick={() => router.push("/register")}
          >
            Crie uma aqui
          </span>
        </p>
      </div>
    </PageTransition>
  );
}
