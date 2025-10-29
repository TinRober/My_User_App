"use client";

import { useRouter } from "next/navigation";
import styles from "./Home.module.css";
import PageTransition from "./components/PageTransition";

// Página inicial
export default function HomePage() {
  const router = useRouter();

  // Renderização
  return (
    <PageTransition>
      <div className={styles.container}>
        <h1 className={styles.title}>My User App</h1>
        <h2 className={styles.text}>Aplicação web de gerenciamento de usuários</h2>
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
    </PageTransition>
  );
}
