import "./globals.css";

// Metadados do site
export const metadata = {
  title: "My User App",
  description: "Aplicação de gerenciamento de usuários",
};

// Layout raiz
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
