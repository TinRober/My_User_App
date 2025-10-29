"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";
import PageTransition from "../components/PageTransition";
import { UserIcon, ClockIcon, SettingsIcon } from "lucide-react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser: User = JSON.parse(storedUser);
    setUser(parsedUser);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) return <p className={styles.loading}>Carregando...</p>;

  return (
    <PageTransition>
      <div className={styles.container}>

        <h1 className={styles.appTitle}>My User App</h1>
        <h2 className={styles.title}>Dashboard</h2>
        <p className={styles.welcome}>Bem-vindo, {user?.name}!</p>
        <div className={styles.cardsContainer}>
          <div className={styles.card}>
            <UserIcon size={40} color="#c084fc" />
            <h3>Informações</h3>
            <p><strong>ID:</strong> {user?.id}</p>
            <p><strong>Nome:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Função:</strong> {user?.role}</p>
          </div>

          <div className={styles.card}>
            <ClockIcon size={40} color="#c084fc" />
            <h3>Últimos Acessos</h3>
            <p>Acesso 1: 29/10/2025 10:00</p>
            <p>Acesso 2: 28/10/2025 14:30</p>
            <p>Acesso 3: 27/10/2025 09:45</p>
          </div>

          <div className={styles.card} onClick={() => router.push("/settings")}>
            <SettingsIcon size={40} color="#c084fc" />
            <h3>Configurações</h3>
            <p>Altere suas preferências, senha ou informações da conta</p>
          </div>
        </div>

        <button className={styles.logout} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </PageTransition>
  );
}
