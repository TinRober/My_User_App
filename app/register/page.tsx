"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cep, setCep] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, cep, state, city }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || data.message);
      } else {
        setError("");
        alert("Cadastro realizado com sucesso!");
        router.push("/login");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor.");
    }
  };

  const handleCepBlur = async () => {
    if (!cep) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setState(data.uf || "");
        setCity(data.localidade || "");
      }
    } catch (err) {
      console.error("Erro ao buscar CEP", err);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cadastro</h1>
      <form className={styles.form} onSubmit={handleRegister}>
        {error && <p className={styles.error}>{error}</p>}
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
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
        <span
          className={styles.loginLink}
          onClick={() => router.push("/login")}
        >
          Entre aqui
        </span>
      </p>
    </div>
  );
}
