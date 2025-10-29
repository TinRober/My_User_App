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

  useEffect(() => {
    const fetchUsers = async () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!storedUser || !token) {
        setMessageType("error");
        setMessage("Acesso negado! Token não fornecido.");
        setLoading(false);
        setTimeout(() => router.push("/login"), 4000);
        return;
      }

      const parsedUser: User = JSON.parse(storedUser);

      if (parsedUser.role !== "admin") {
        setMessageType("error");
        setMessage("Acesso negado! Você precisa ser um administrador para acessar esta página.");
        setLoading(false);
        setTimeout(() => router.push("/dashboard"), 4000);
        return;
      }

      setUser(parsedUser);

      try {
        const res = await fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const data = await res.json();
          setMessageType("error");
          setMessage(data.error || "Acesso negado!");
          setLoading(false);
          return;
        }

        const data: User[] = await res.json();
        setUsers(data);
      } catch {
        setMessageType("error");
        setMessage("Erro ao conectar com o servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  const handleEditUser = async (id: number) => {
    const newName = prompt("Digite o novo nome do usuário:");
    if (!newName) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/users`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
      const updatedUsers = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === updatedUsers.id ? updatedUsers : u)));
    } catch {
      setMessageType("error");
      setMessage("Erro ao conectar com o servidor");
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este usuário?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/users`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      setMessageType("error");
      setMessage("Erro ao conectar com o servidor");
    }
  };

  if (loading) return <p className={styles.loading}>Carregando...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Área do Administrador</h1>

      {message && (
        <div className={messageType === "success" ? styles.success : styles.error}>
          {message}
        </div>
      )}

      {user?.role === "admin" && users.length > 0 && (
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
                  <button className={styles.editButton} onClick={() => handleEditUser(u.id)}>
                    Editar
                  </button>
                  <button className={styles.deleteButton} onClick={() => handleDeleteUser(u.id)}>
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
