"use client";

import { useRouter } from "next/navigation";
import styles from "./Home.module.css";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bem-vindo ao My User App</h1>
      <div className={styles.boxContainer}>
        <div
          className={styles.box}
          onClick={() => router.push("/login")}
        >
          Login
        </div>
        <div
          className={styles.boxCreate}
          onClick={() => router.push("/register")}
        >
          Criar minha conta
        </div>
      </div>
    </div>
  );
}
