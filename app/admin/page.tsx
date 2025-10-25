"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function AdminPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  // Inicializa o usuário logado e protege a rota
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      router.push("/login");
      return;
    }

    const parsedUser: User = JSON.parse(storedUser);

    // Checagem de papel
    if (parsedUser.role !== "admin") {
      alert("Você não tem permissão para acessar esta página.");
      router.push("/dashboard");
      return;
    }

    setUser(parsedUser);
    setLoading(false);
  }, [router]);

  // Busca usuários sempre que o usuário admin estiver carregado
  useEffect(() => {
    if (user) fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Erro ao carregar lista de usuários");

      const data: User[] = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Erro no fetchUsers:", err);
      setMessage("Erro ao carregar lista de usuários");
      setMessageType("error");
    }
  };

  const handleEditUser = async (id: number) => {
    const newName = prompt("Digite o novo nome do usuário:");
    if (!newName) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessageType("error");
        setMessage(data.message || "Erro ao editar usuário");
        return;
      }

      setMessageType("success");
      setMessage("Usuário atualizado com sucesso!");
      fetchUsers();
    } catch {
      setMessageType("error");
      setMessage("Erro ao conectar com o servidor");
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este usuário?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json();
        setMessageType("error");
        setMessage(data.message || "Erro ao deletar usuário");
        return;
      }

      setMessageType("success");
      setMessage("Usuário deletado com sucesso!");
      fetchUsers();
    } catch {
      setMessageType("error");
      setMessage("Erro ao conectar com o servidor");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) return <p className={styles.loading}>Carregando...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Área do Administrador</h1>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <p className={styles.welcome}>Bem-vindo, {user?.name}</p>

      {message && (
        <div
          className={
            messageType === "success"
              ? styles.messageSuccess
              : styles.messageError
          }
        >
          {message}
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <button
                  className={styles.editButton}
                  onClick={() => handleEditUser(u.id)}
                >
                  Editar
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteUser(u.id)}
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
