# Rosa Viva — site educativo

Projeto React + TypeScript + Vite com quiz de 10 perguntas e assistente educativa Lia (API Gemini via backend Express).

## Requisitos
- Node.js 20 ou superior
- npm
- Para a IA: chave Gemini válida e acesso ao modelo configurado

## Rodar localmente
1. Descompacte o ZIP e abra um terminal na pasta `rosa-viva`.
2. Instale dependências: `npm install`
3. Inicie o site: `npm run dev`
4. Para testar a IA em outro terminal, copie `.env.example` para `.env`, preencha `GEMINI_API_KEY` e confirme `GEMINI_MODEL` no Google AI Studio.
5. Execute `npm run server` em outro terminal. A API ficará em `http://localhost:3001`.
6. Abra o endereço mostrado pelo Vite, normalmente `http://localhost:5173`.

O frontend funciona sem a IA; a Lia só responderá de verdade depois de configurar e iniciar o backend com uma chave válida. Nunca exponha a chave no código frontend nem publique o arquivo `.env`.

## Publicação
### Frontend no Netlify
- Suba o projeto para um repositório Git sem `.env`.
- Crie um site no Netlify conectado ao repositório. O build é `npm run build`, diretório publicado `dist`.
- Configure a variável `VITE_API_URL` com a URL pública do backend Render, sem barra final, por exemplo `https://seu-servico.onrender.com`.

### Backend no Render
- Crie um Web Service a partir do mesmo repositório.
- Root directory: `server` não é necessário; o arquivo é `server/index.js` na raiz do projeto.
- Build command: `npm install`; Start command: `npm run server`.
- Configure `GEMINI_API_KEY`, `GEMINI_MODEL` (modelo confirmado no AI Studio) e `FRONTEND_URL` com a URL do site Netlify.
- Após o deploy, teste `https://SUA-API/api/health`; deve retornar JSON com `status: "ok"` e `aiConfigured: true`.
- Faça novo deploy do frontend depois de definir `VITE_API_URL`.

## Checklist de validação
- `npm run build` deve terminar sem erros.
- Faça o quiz até o fim: são exatamente 10 perguntas, com quatro opções cada, pontuação e revisão.
- Teste “Refazer o quiz”.
- Sem chave da IA, a Lia deve apresentar uma mensagem de configuração, não simular uma resposta.
- Com chave e backend válidos, faça uma pergunta geral e confira se a API responde.
- Teste no celular, navegação por teclado, ampliação de texto e alto contraste.

## Logo
O cabeçalho e o rodapé reservam um espaço temporário marcado “SEU LOGO”. Substitua-o pelo logo final antes da entrega.

## Fontes educativas
- INCA — Detecção precoce: https://www.inca.gov.br/publicacoes/folhetos/deteccao-precoce-do-cancer-de-mama
- Ministério da Saúde — Câncer de mama: https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/c/cancer-de-mama/cancer-de-mama
- OMS — Breast cancer: https://www.who.int/news-room/fact-sheets/detail/breast-cancer
- Biblioteca Virtual em Saúde: https://bvsalud.org/

Conteúdo educativo; não substitui avaliação profissional. Verifique as recomendações oficiais vigentes antes da publicação final.
