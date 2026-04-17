# Sistema de Adoção de Animais

Aplicação web para cadastrar, listar e remover animais disponíveis para adoção.

## Estrutura Moderna do Projeto

Este repositório foi organizado em um padrão acadêmico moderno, com separação entre front-end, back-end e documentação.

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
├─ package.json
└─ README.md
```

## Guia de instalação detalhado

- Veja o passo a passo completo em [docs/README-INSTALACAO.md](docs/README-INSTALACAO.md).

## Objetivo do projeto

Facilitar o cadastro de cães e gatos para adoção responsável, com:
- Cadastro de animal com foto.
- Listagem de animais.
- Filtros por espécie e porte.
- Remoção de animais cadastrados.
- Verificação de saúde da API.

## Tecnologias usadas

- Node.js
- Express
- PostgreSQL
- JavaScript (front-end)
- HTML e CSS

## Como executar

1. Instale dependências:

    npm install

2. Configure o arquivo .env na raiz.

3. Inicie a aplicação:

    npm start

4. Acesse no navegador:

- http://localhost:3000

## Pré-requisitos

Antes de começar, você precisa ter instalado:
- Git
- Node.js (versão 18 ou superior recomendada)
- PostgreSQL (local ou em nuvem)

## Guia rápido para quem sabe pouco de Git

### 1) Clonar o projeto

No terminal, vá para a pasta onde quer salvar o projeto e execute:

    git clone https://github.com/D4nielotten/sistema-adocao-animais.git

Entre na pasta:

    cd sistema-adocao-animais

### 2) Ver em qual branch você está

    git branch

A branch atual aparece com um asterisco.

### 3) Trocar para a branch de trabalho

Exemplo (branch fix):

    git checkout fix

### 4) Instalar dependências

    npm install

### 5) Criar o arquivo .env

Na raiz do projeto, crie um arquivo chamado .env e adicione:

    DATABASE_URL=postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO

Exemplo local:

    DATABASE_URL=postgresql://postgres:1234@localhost:5432/adocao_animais

Se seu banco usa certificado próprio (self-signed), adicione também:

    ALLOW_SELF_SIGNED_CERT=true

### 6) Iniciar o servidor

    npm start

Se estiver tudo certo, a API sobe em:
- http://localhost:3000

## Endpoints da API

Base URL:
- http://localhost:3000

Rotas principais:
- GET /animais: lista os animais.
- POST /animais: cadastra um novo animal.
- DELETE /animais/:id: remove um animal por ID.
- GET /health: verifica se API e banco estão funcionando.

## Exemplo de fluxo de trabalho com Git

Depois de fazer alterações:

### 1) Ver o que mudou

    git status

### 2) Adicionar arquivos alterados

    git add .

### 3) Criar um commit

    git commit -m "feat: descreva aqui sua alteração"

### 4) Enviar para o GitHub

    git push origin fix

## Como atualizar sua branch com a main

Se o projeto no GitHub mudou e você quer trazer as novidades:

    git checkout main
    git pull origin main
    git checkout fix
    git merge main

Se houver conflito, o Git avisará quais arquivos precisam de ajuste manual.

## Protocolo seguro para trocar de branch

Para evitar perder alterações ao usar checkout, siga esta sequência:

### 1) Verificar alterações pendentes

    git status

### 2) Se quiser manter no histórico, commitar antes de trocar

    git add .
    git commit -m "wip: checkpoint antes de trocar branch"

### 3) Se não quiser commit, guardar temporariamente com stash

    git stash push -m "checkpoint local"

### 4) Trocar de branch com segurança

    git checkout nome-da-branch

### 5) Se usou stash, restaurar alterações

    git stash list
    git stash pop

Dica: prefira sempre trocar de branch com o working tree limpo (sem arquivos modificados).

## Problemas comuns e soluções

### Erro ao rodar npm start

Se aparecer mensagem dizendo que DATABASE_URL não está definida:
- Verifique se o arquivo .env existe na raiz.
- Verifique se a linha DATABASE_URL está correta.
- Reinicie o servidor após corrigir.

### Erro de conexão com banco

- Confirme se o PostgreSQL está ligado.
- Confira usuário, senha, host, porta e nome do banco na DATABASE_URL.
- Teste a conexão do banco fora do projeto, se necessário.

### Porta 3000 ocupada

Feche o processo que já está usando a porta 3000 ou altere a porta em src/backend/server.js.

## Melhorias futuras

- Adicionar autenticação para administradores.
- Implementar paginação na listagem de animais.
- Melhorar validação de imagens no front-end.
- Criar testes automatizados.

## Licença

Projeto acadêmico para fins de estudo.