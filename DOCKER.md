# Guia Docker - Vulpes Web

Este guia explica como executar a aplicação Vulpes Web usando Docker e Docker Compose.

## Pré-requisitos

- Docker (versão 20.10 ou superior)
- Docker Compose (versão 2.0 ou superior)

## Estrutura dos Arquivos

- `Dockerfile`: Define a imagem Docker da aplicação Next.js
- `docker-compose.yml`: Orquestra os serviços (web, api, database)
- `.dockerignore`: Lista arquivos/pastas a serem ignorados no build
- `.env.docker`: Variáveis de ambiente para Docker

## Configuração Inicial

### 1. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e ajuste conforme necessário:

```bash
cp .env.docker .env
```

Edite o arquivo `.env` e configure as variáveis:

```
NEXT_PUBLIC_API_BASE=http://api:8080/api
NODE_ENV=production
```

### 2. Configurar a API Backend

No arquivo `docker-compose.yml`, você precisa configurar o serviço da API:

- Se você tem um Dockerfile para a API, descomente e configure a seção `build`
- Se você usa uma imagem Docker existente, substitua `placeholder/vulpes-api:latest` pela imagem correta
- Adicione as variáveis de ambiente necessárias para a API

## Comandos Docker

### Build e Iniciar os Serviços

```bash
# Build das imagens e iniciar os containers
docker-compose up --build

# Executar em background (modo detached)
docker-compose up -d --build
```

### Gerenciar Containers

```bash
# Ver logs
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f web

# Parar os serviços
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Reiniciar um serviço específico
docker-compose restart web
```

### Build Apenas da Aplicação Web

```bash
# Build da imagem
docker build -t vulpes-web .

# Executar o container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE=http://localhost:8080/api \
  vulpes-web
```

## Desenvolvimento vs Produção

### Desenvolvimento Local

Para desenvolvimento, é recomendado usar o ambiente local sem Docker:

```bash
npm install
npm run dev
```

### Produção com Docker

O Dockerfile está otimizado para produção com:

- Multi-stage build para reduzir o tamanho da imagem
- Output standalone do Next.js
- Usuário não-root para segurança
- Cache de dependências otimizado

## Portas Utilizadas

- **3000**: Aplicação Web (Next.js)
- **8080**: API Backend
- **5432**: PostgreSQL (se habilitado)

## Volumes e Persistência

Se você habilitar o banco de dados no `docker-compose.yml`, os dados serão persistidos no volume `postgres_data`.

Para fazer backup dos dados:

```bash
docker-compose exec database pg_dump -U vulpes vulpes_db > backup.sql
```

## Troubleshooting

### Erro "module not found"

Limpe os containers e rebuilde:

```bash
docker-compose down -v
docker-compose up --build
```

### Porta já em uso

Certifique-se de que as portas 3000 e 8080 não estão sendo usadas:

```bash
# macOS/Linux
lsof -i :3000
lsof -i :8080

# Windows
netstat -ano | findstr :3000
```

### Problemas de permissão

O container roda com usuário `nextjs` (UID 1001). Se houver problemas de permissão, verifique os volumes montados.

## Otimizações

### Reduzir Tamanho da Imagem

O Dockerfile já usa multi-stage build e Node.js Alpine. Para reduzir ainda mais:

1. Revise as dependências no `package.json`
2. Use `.dockerignore` para excluir arquivos desnecessários
3. Considere usar `npm prune --production` após o build

### Melhorar Performance

- Use cache do Docker: `docker-compose build --no-cache` apenas quando necessário
- Configure health checks no `docker-compose.yml`
- Use redes Docker dedicadas para comunicação entre serviços

## Segurança

- Nunca commite arquivos `.env` com credenciais reais
- Use secrets do Docker Swarm ou Kubernetes para produção
- Atualize regularmente as imagens base (`node:20-alpine`)
- Execute scan de segurança: `docker scan vulpes-web`

## Próximos Passos

1. Configure a API backend no `docker-compose.yml`
2. Adicione banco de dados se necessário
3. Configure CI/CD para build automático
4. Considere usar Docker Swarm ou Kubernetes para orquestração em produção
