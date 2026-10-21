import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const allowedOrigins = new Set(['http://localhost:5173', process.env.FRONTEND_URL].filter(Boolean));
app.use(cors({ origin(origin, cb) { if (!origin || allowedOrigins.has(origin)) return cb(null, true); return cb(new Error('Origem não autorizada pelo CORS')); } }));
app.use(express.json({ limit: '16kb' }));
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const systemPrompt = `Você é Lia, assistente educativa do projeto Rosa Viva sobre saúde das mamas e câncer de mama. Responda em português brasileiro simples, com empatia e até 5 parágrafos. Não diagnostique, não estime risco individual, não prescreva medicamentos, exames ou tratamentos e não interprete imagens. Não substitua profissionais de saúde. Não peça nome, CPF, endereço, fotos nem histórico pessoal detalhado. Se a pessoa relatar um sintoma ou alteração nova, oriente procurar uma UBS ou profissional de saúde para avaliação; não diga que é câncer nem que não é. Sintomas não devem esperar a idade de rastreamento. Explique que hábitos saudáveis podem reduzir riscos, mas não garantem prevenção. Diferencie rastreamento em pessoas sem sintomas de investigação de sintomas. Para urgência médica no Brasil, orientar SAMU 192. Não invente fontes nem estatísticas; quando não souber, admita.`;
app.get('/api/health', (_req, res) => res.json({ status: 'ok', aiConfigured: Boolean(API_KEY), model: MODEL }));
app.post('/api/chat', async (req, res) => {
  if (!API_KEY) return res.status(503).json({ error: 'A Lia ainda não foi configurada. O responsável pelo site precisa adicionar GEMINI_API_KEY no servidor.' });
  const message = req.body?.message;
  if (typeof message !== 'string' || !message.trim()) return res.status(400).json({ error: 'Escreva uma pergunta antes de enviar.' });
  if (message.length > 1500) return res.status(400).json({ error: 'A pergunta é muito longa. Use até 1.500 caracteres.' });
  try {
    const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': API_KEY },
      body: JSON.stringify({ system_instruction: { parts: [{ text: systemPrompt }] }, contents: [{ role: 'user', parts: [{ text: message.trim() }] }], generationConfig: { temperature: 0.35, maxOutputTokens: 700 } })
    });
    if (!upstream.ok) { console.error('Gemini status:', upstream.status, await upstream.text()); return res.status(502).json({ error: 'Não foi possível obter resposta da IA. Verifique a configuração do modelo e tente novamente.' }); }
    const data = await upstream.json();
    const reply = data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('').trim();
    if (!reply) return res.status(502).json({ error: 'A IA retornou uma resposta vazia. Tente reformular a pergunta.' });
    return res.json({ reply });
  } catch (error) { console.error('Erro de conexão com Gemini:', error); return res.status(500).json({ error: 'Falha de conexão com o serviço de IA. Tente novamente mais tarde.' }); }
});
const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`Rosa Viva API em http://localhost:${port} | modelo: ${MODEL} | chave configurada: ${Boolean(API_KEY)}`));
