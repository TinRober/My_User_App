# My User App

Aplicação web completa de **gerenciamento de usuários** desenvolvida com **Next.js**, **TypeScript** e **SQLite**, como parte de um desafio técnico Fullstack.

---

##  Funcionalidades Principais

###  Cadastro Público de Usuário
- Campos obrigatórios: **nome**, **e-mail**, **senha**  
- Campos opcionais: **CEP**, **estado**, **cidade**
- Integração automática com a **API ViaCEP** para preencher estado e cidade a partir do CEP.
- Validação de senha (mínimo de 6 caracteres e critérios definidos no frontend).

###  Login Público
- Autenticação via **e-mail e senha**.
- Redirecionamento automático para a área autenticada após login.

###  Área do Usuário
- Visualização de **mensagem de boas-vindas personalizada**.
- Exibição dos **dados pessoais** do usuário autenticado.
- O usuário **não pode visualizar nem editar** dados de outros usuários.

###  Área do Administrador
- Acesso restrito ao usuário com papel `admin`.
- Funcionalidades:
  - Listagem completa de usuários.
  - Edição de nome de qualquer usuário.
  - Exclusão de qualquer usuário.
- Proteção de rota: apenas administradores podem acessar `/admin`.

---

##  Administrador Pré-Cadastrado

Ao iniciar o projeto pela primeira vez, existe um **administrador padrão** configurado:

| **Email** | `admin@example.com` |
| **Senha** | `admin123!` |

---

##  Tecnologias Utilizadas

- **Next.js 14 (App Router)**
- **React**
- **TypeScript**
- **SQLite (via Prisma ou Database API interna)**
- **Tailwind CSS / CSS Modules** (para estilização)
- **API pública ViaCEP** (para integração de CEP)
- **Validação de formulários no frontend**

---

##  Requisitos

- Node.js 18+
- npm ou yarn

---

##  Instalação e Execução

1️⃣ Clonar o repositório
https://github.com/TinRober/My-User-App.git
cd my-user-app

2️⃣ Instalar dependências
npm install

3️⃣ Criar o banco de dados (SQLite)

Se estiver usando Prisma:

npx prisma migrate dev --name init

Se estiver usando conexão direta (sem Prisma), o banco será criado automaticamente na primeira execução.

4️⃣ Rodar a aplicação
npm run dev


