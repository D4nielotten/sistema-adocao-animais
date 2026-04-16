# Guia de Instalação das Tecnologias

Este guia mostra como preparar o ambiente para executar o projeto.

## Tecnologias necessárias

- Git
- Node.js (recomendado: versão 18 ou superior)
- npm (instalado junto com Node.js)
- PostgreSQL

## 1) Instalar Git

1. Acesse https://git-scm.com/downloads
2. Baixe e instale para seu sistema operacional.
3. Valide no terminal:

```bash
git --version
```

## 2) Instalar Node.js e npm

1. Acesse https://nodejs.org/
2. Instale a versão LTS.
3. Valide no terminal:

```bash
node -v
npm -v
```

## 3) Instalar PostgreSQL

1. Acesse https://www.postgresql.org/download/
2. Instale e defina uma senha para o usuário `postgres`.
3. Confira a porta de execução (normalmente `5432`).

## 4) Clonar o projeto

```bash
git clone https://github.com/D4nielotten/sistema-adocao-animais.git
cd sistema-adocao-animais
```

## 5) Instalar dependências

```bash
npm install
```

## 6) Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO
```

Exemplo local:

```env
DATABASE_URL=postgresql://postgres:1234@localhost:5432/adocao_animais
```

Se o banco usar certificado self-signed:

```env
ALLOW_SELF_SIGNED_CERT=true
```

## 7) Executar a aplicação

```bash
npm start
```

A aplicação ficará disponível em:

- http://localhost:3000

## Problemas comuns

### DATABASE_URL não definida

- Confira se o `.env` está na raiz do projeto.
- Verifique se a variável foi escrita corretamente.

### Erro de conexão com PostgreSQL

- Verifique se o serviço do PostgreSQL está ativo.
- Revise usuário, senha, host, porta e nome do banco.

### Porta 3000 em uso

- Finalize o processo que está usando a porta ou defina a variável `PORT` no `.env`.
