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
      setMessageType("error");
      setMessage("Acesso negado! Você precisa ser um administrador para acessar esta página.");
      setTimeout(() => {
        router.push("/dashboard"); 
      }, 4000);
      setLoading(false);
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
      const res = await fetch("/api/admin/users");
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
      const res = await fetch(`/api/admin/users`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: newName }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessageType("error");
        setMessage(data.error || "Erro ao editar usuário");
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
      const res = await fetch(`/api/admin/users`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessageType("error");
        setMessage(data.error || "Erro ao deletar usuário");
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

  if (loading) return <p className={styles.loading}>Carregando...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Área do Administrador</h1>
      </div>

      {message && (
        <div
          className={
            messageType === "success"
              ? styles.success
              : styles.error
          }
        >
          {message}
        </div>
      )}

      {user?.role === "admin" && (
        <>

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
        </>
      )}
    </div>
  );
}
