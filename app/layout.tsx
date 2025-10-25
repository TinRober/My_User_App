// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "My User App",
  description: "Aplicação de gerenciamento de usuários",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
