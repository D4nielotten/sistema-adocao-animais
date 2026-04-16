# Sistema de Adoção de Animais

Aplicação web para cadastrar, listar e remover animais disponíveis para adoção.

## Estrutura Moderna do Projeto

Este repositório foi organizado em um padrão acadêmico mais atual, com separação clara entre front-end, back-end e documentação.

```text
sistema-adocao-animais/
├─ src/
│  ├─ backend/
│  │  └─ server.js
│  └─ frontend/
│     ├─ index.html
│     └─ assets/
│        ├─ css/
│        │  └─ style.css
│        └─ js/
│           └─ script.js
├─ docs/
│  └─ README-INSTALACAO.md
├─ .env
├─ .gitignore
├─ package.json
└─ README.md
```

## Objetivo do Projeto

- Cadastro de animais com foto.
- Listagem de animais.
- Filtro por espécie e porte.
- Remoção de animais cadastrados.
- Verificação de saúde da API.

## Tecnologias Utilizadas

- Node.js
- Express
- PostgreSQL
- HTML, CSS e JavaScript

## Guia de Instalação

O passo a passo de instalação das tecnologias está em:

- [docs/README-INSTALACAO.md](docs/README-INSTALACAO.md)

## Como Executar o Projeto

1. Instale as dependências:

```bash
npm install
```

2. Configure o arquivo `.env` na raiz:

```env
DATABASE_URL=postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO
```

3. Inicie a aplicação:

```bash
npm start
```

4. Abra no navegador:

- http://localhost:3000

## Endpoints da API

- `GET /animais`
- `POST /animais`
- `DELETE /animais/:id`
- `GET /health`

## Licença

Projeto acadêmico para fins de estudo.