// Edge Function para verificar token de pagamento
// Deploy no Vercel como /api/verify

// Estoque simulado (em produção, use banco de dados ou KV store)
const validTokens = new Set();
const usedTokens = new Set();

// Tokens válidos (gerados após confirmação de pagamento)
// Em produção: receber webhook do InfinityPay e adicionar token aqui

export default async function handler(req, res) {
  const { token, action } = req.query || {};

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET /api/verify?token=XXX - Verificar se token é válido
  if (action === 'check' && token) {
    if (usedTokens.has(token)) {
      return res.status(200).json({ valid: true, used: true });
    }
    return res.status(200).json({ valid: false, used: false });
  }

  // POST /api/verify - Registrar token válido (webhook do InfinityPay chamaria isso)
  if (req.method === 'POST' && token) {
    validTokens.add(token);
    return res.status(200).json({ success: true, token: token });
  }

  // GET /api/verify?action=consume&token=XXX - Consumir token após acesso à sucesso
  if (action === 'consume' && token) {
    if (validTokens.has(token) && !usedTokens.has(token)) {
      usedTokens.add(token);
      return res.status(200).json({ 
        success: true, 
        access: true,
        remaining: validTokens.size - usedTokens.size 
      });
    }
    return res.status(200).json({ success: false, access: false });
  }

  // GET /api/verify?action=stock - Retornar estoque atual
  if (action === 'stock') {
    const stock = validTokens.size - usedTokens.size;
    return res.status(200).json({ 
      stock: Math.max(stock, 7), // Mínimo 7 unidades sempre visível
      sold: usedTokens.size
    });
  }

  return res.status(400).json({ error: 'Parâmetros inválidos' });
}