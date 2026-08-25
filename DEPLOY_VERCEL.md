# Publicar no GitHub + Vercel

O projeto usa React + Vite e está configurado para publicação como site estático na Vercel.

## 1. Criar o repositório

No GitHub, crie um repositório vazio e envie a pasta inteira do projeto. Não remova `vercel.json`, pois ele define a saída correta do build e o fallback de rotas.

```bash
git init
git add .
git commit -m "primeira versão do Text Similarity Lab"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
git push -u origin main
```

## 2. Importar na Vercel

Na Vercel, selecione **Add New Project**, escolha o repositório do GitHub e mantenha:

| Configuração | Valor |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist/public` |
| Install Command | `npm install` |

Depois selecione **Deploy**.

## 3. Configurar domínio próprio

Abra o projeto na Vercel e acesse **Settings → Domains → Add**. Informe seu domínio. A Vercel exibirá os registros DNS necessários. No painel do seu registrador, crie os registros indicados, normalmente um registro `A` para o domínio raiz e/ou um `CNAME` para `www`. A propagação pode levar algum tempo.

## Observação

O protótipo calcula a comparação no navegador e não exige variáveis de ambiente. A leitura de arquivos PDF/DOCX e o armazenamento de histórico ainda não fazem parte desta versão.
