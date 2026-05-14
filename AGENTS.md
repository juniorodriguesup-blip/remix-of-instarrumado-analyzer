# Instarrumado — Contexto do Projeto

## O que é
SaaS brasileiro que oferece diagnóstico de Instagram com IA. Usuário informa o @ do perfil, tipo, nicho e objetivo, e o sistema gera um relatório personalizado via Supabase Edge Functions. Modelo freemium com plano premium via Kiwify.

## Stack
- Frontend: React 19 + TypeScript + Vite + shadcn/ui + Tailwind CSS
- Backend: Supabase (Auth, DB, Edge Functions)
- Pagamentos: Kiwify (webhook)
- Deploy: Vercel + domínio instarrumado.com.br
- Origem: template Lovable, reestruturado manualmente

## Estrutura de diretórios
```
src/
├── components/
│   ├── diagnostico/   # Formulário, resultado, paywall, CTA
│   ├── landing/       # Hero, Features, Pricing, etc
│   └── ui/            # shadcn/ui + componentes custom (SEO, Tracking, Loading, etc)
├── hooks/             # useAuth (autenticação + subscription polling)
├── integrations/
│   └── supabase/      # client, types
├── lib/               # exportReport, utils
└── pages/             # Index, Diagnostico, Auth, Dashboard, Admin, etc
supabase/
├── functions/         # generate-diagnostico, kiwify-webhook, save-lead, etc
└── migrations/
```

## Rotas principais
- `/` — Landing page
- `/diagnostico` — Diagnóstico grátis
- `/auth` — Login/cadastro
- `/dashboard` — Painel do usuário
- `/admin` — Painel admin
- `/obrigado` — Pós-compra premium (valida token)
- `/entrega-premium` — Entrega do conteúdo premium (valida token)

## Sistema de Acesso Premium (Token-based)
- **kiwify-webhook**: Gera token de 32 bytes + salva em `premium_access` (validade 30 dias). Se usuário existir, também atualiza subscription.
- **validate-premium-token**: Edge function pública que valida token (existência + expiração).
- **link-premium-to-user**: Edge function que vincula token a user_id + atualiza subscription.
- **generate-diagnostico**: Valida token no servidor se `isPremium=true`. Sem token válido → erro 401.
- **Fluxo**: Kiwify → webhook gera token → redirect `/obrigado?token=xxx` → frontend valida → mostra conteúdo premium.
- **Account linking**: Na página /obrigado, usuário não-logado vê banner "Crie uma conta para salvar seu acesso". Ao criar conta, subscription vira premium automaticamente.
- **Proteção**: /entrega-premium também valida token. Sem token válido → redirect.
- **Token storage**: localStorage (`instarrumado_premium_token`).

## Comandos
- `npm run dev` — Desenvolvimento
- `npm run build` — Build produção
- `npm run lint` — ESLint

## Observações importantes
- Diagnóstico é gerado localmente (remoção de dependência externa no commit 66902f8)
- Subscription status faz polling a cada 8s por 2min após checkout + no visibilitychange
- .env NÃO deve ser commitado (contém chaves Supabase)
- Projeto tem 102+ commits de evolução desde o template Lovable
- Premium tokens expiram em 30 dias por padrão
