"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";
import PageTransition from "../components/PageTransition";
import { UserIcon, ClockIcon, SettingsIcon } from "lucide-react";

// Tipo para usuário
type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

// Tipo para histórico de login
type LoginHistory = {
  id: number;
  timestamp: string;
  ip: string | null;
  userAgent: string | null;
};

// Página do dashboard
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<LoginHistory[]>([]);
  
  // Verifica autenticação e busca histórico de login
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      router.push("/login");
      return;
    }
    
    // Carrega dados do usuário
    const parsedUser: User = JSON.parse(storedUser);
    setUser(parsedUser);

    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/login-history", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Erro ao buscar histórico");
        }

        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("Falha ao buscar histórico:", err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) return <p className={styles.loading}>Carregando...</p>;

  // Renderização
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
            {history.length === 0 ? (
              <p>Nenhum acesso registrado.</p>
            ) : (
              <ul className={styles.historyList}>
                {history.slice(0, 5).map((h) => (
                  <li key={h.id}>
                    {new Date(h.timestamp).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}
          </div>


          <div
            className={styles.card}
            onClick={() => router.push("/settings")}
            style={{ cursor: "pointer" }}
          >
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
