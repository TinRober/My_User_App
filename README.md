# My User App

Aplicação web completa de **gerenciamento de usuários** desenvolvida com
**Next.js**, **TypeScript** e **SQLite**, como parte de um desafio
técnico Fullstack.\
Inclui autenticação, controle de permissões e histórico detalhado de
acessos.

------------------------------------------------------------------------

## ⚙️ Funcionalidades Principais

### 📝 Cadastro de Usuário

-   Campos obrigatórios: **nome**, **e-mail**, **senha**
-   Campos opcionais: **CEP**, **estado**, **cidade**
-   Integração automática com a **API ViaCEP** para preencher estado e
    cidade a partir do CEP.
-   Validação de senha (mínimo de 6 caracteres e critérios definidos no
    frontend).

### 🔐 Login

-   Autenticação via **e-mail e senha**.
-   Registro automático no banco de dados do:
    -   **Horário do login**
    -   **Endereço IP**
    -   **Navegador utilizado**
-   Redirecionamento automático para a área autenticada após login.

### 🧭 Dashboard do Usuário

-   Visualização de **mensagem de boas-vindas personalizada**.
-   Exibição dos **dados pessoais** do usuário autenticado.
-   Exibição dos **últimos acessos**, mostrando data, IP e navegador.
-   Opção de **logout** segura.

### 🧑‍💼 Área do Administrador

-   Acesso restrito ao usuário com papel `admin`.
-   Funcionalidades:
    -   Listagem completa de usuários.
    -   Edição de nome de qualquer usuário.
    -   Exclusão de qualquer usuário.
-   Proteção de rota: apenas administradores podem acessar `/admin`.

------------------------------------------------------------------------

## 👑 Administrador Pré-Cadastrado

Ao iniciar o projeto pela primeira vez, existe um **administrador
padrão** configurado:
  --------------------- -------------
Login: `admin@example.com` Senha: `admin123!`

------------------------------------------------------------------------

## 🧰 Tecnologias Utilizadas

-   **Next.js 14 (App Router)**
-   **React**
-   **TypeScript**
-   **SQLite (via Prisma ORM)**
-   **Tailwind CSS / CSS Modules** (para estilização)
-   **API pública ViaCEP** (para integração de CEP)
-   **Lucide React Icons**
-   **Validação de formulários e autenticação no frontend**
-   **Histórico de login (LoginHistory via Prisma)**

------------------------------------------------------------------------

## 🧾 Estrutura do Banco (Prisma)

``` prisma
model User {
  id           Int            @id @default(autoincrement())
  name         String
  email        String         @unique
  password     String
  cep          String?
  state        String?
  city         String?
  role         String         @default("user")
  loginHistory LoginHistory[]
}

model LoginHistory {
  id        Int      @id @default(autoincrement())
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  timestamp DateTime @default(now())
  ip        String?
  userAgent String?
}
```

------------------------------------------------------------------------

## 🧩 Requisitos

-   Node.js 18+
-   npm ou yarn

------------------------------------------------------------------------

## 🚀 Instalação e Execução

1️⃣ **Clonar o repositório**

``` bash
git clone https://github.com/TinRober/My-User-App.git
cd my-user-app
```

2️⃣ **Instalar dependências**

``` bash
npm install
```

3️⃣ **Criar o banco de dados (SQLite via Prisma)**

``` bash
npx prisma migrate dev --name init
```

💡 Caso esteja usando conexão direta (sem Prisma), o banco será criado
automaticamente na primeira execução.

4️⃣ **Rodar a aplicação**

``` bash
npm run dev
```

Acesse em: <http://localhost:3000>

------------------------------------------------------------------------

## 🧠 Destaques Técnicos

-   Boas práticas de **autenticação e autorização**
-   **Organização modular** com o App Router
-   **UX/UI moderna e responsiva**
-   Integração real com API externa (ViaCEP)
-   Registro e exibição de **histórico de logins**
