# Comparação: Repositório local vs. site publicado

**Site comparado:** https://pontalcarapitangui.clubemkt.digital/pontal-carapitangui/
**Data da comparação:** 2026-07-20
**Commit local no momento da comparação:** `47d1a86` ("feat: Automated deployment 2026-04-17 19:53:22"), com um volume grande de alterações não commitadas na working tree (ver seção 5).

## 1. Resumo

O site publicado em `clubemkt.digital` **é, em essência, uma build antiga deste mesmo projeto** — o hero, os textos, o logo, a paleta e a estrutura da landing page batem quase palavra por palavra com `src/pages/public/Landing.tsx` e `src/i18n/translations.ts`. Não é um site de terceiros nem um template genérico "parecido"; é o mesmo produto, só que hospedado sob um domínio/plataforma diferente (`clubemkt.digital`, um path multi-tenant `/pontal-carapitangui/`) e com uma versão de código mais antiga que a que está no repositório hoje.

Isso explica por que o `<title>` da aba mostra **"Pontal Stock - Sistema de Gestão de Estoque"** — um nome de sistema/template genérico que não bate com o `<title>` atual do `index.html` local (`PONTAL Carapitangui — Praia Bar em Barra Grande`). O HTML servido ao vivo não é o `index.html` atual do repo.

## 2. O que bate exatamente

- Hero, headline "Onde o rio encontra o mar", subtítulo, CTAs ("Ver cardápio" / "Como chegar").
- Seções "Uma experiência completa" (Família, Pet-Friendly, Pôr do sol, Esportes), "Gastronomia", "Maré baixa", "Da vila de pescadores ao destino", "Estrutura", "Eventos & Casamentos", "Sistema de Pedidos Digital", "Visual" (galeria), "Contato & Como chegar".
- Logo, header sticky com seletor PT/EN e botão Admin, footer com Instagram e horário.
- Endereço, telefone/WhatsApp placeholder (`+55 (73) 99999-9999`), texto de "Como chegar" de Salvador via Ilhéus/Camamu.

Ou seja: o conteúdo institucional (`Landing.tsx` + `translations.ts`) está fielmente publicado.

## 3. Divergências encontradas

### 3.1 Horário de funcionamento
- **Site ao vivo:** "Aberto todos os dias • 9h às 18h" (hero/contato) e "9h – 18h" no rodapé.
- **Código local:** `translations.ts` diz `"Aberto todos os dias • 9h às 22h"` e `Footer.tsx` tem `"9h – 22h"` hardcoded.
- O site publicado está rodando uma versão do texto anterior à mudança para 22h (ou o texto foi revertido ao vivo). Vale confirmar qual horário é o correto operacionalmente e sincronizar.

### 3.2 Roteamento quebrado / rota legada
- Clicar em **"Cardápio"** no header do site ao vivo navega para `https://pontalcarapitangui.clubemkt.digital/menu-qr/` — uma rota **`/menu-qr` que não existe em nenhum lugar do repositório atual** (`grep` por "menu-qr" não retorna nada; `App.tsx` só define `/menu`).
- Navegar diretamente para `.../pontal-carapitangui/menu` (a rota atual do código) retorna **404 "This page could not be found"** no site ao vivo.
- Confirma que o build publicado é de uma versão anterior do app, onde a rota do cardápio ainda se chamava `/menu-qr`, e que o host não faz fallback de SPA para deep links na rota nova.
- Efeito prático: um cliente que acesse `/menu` diretamente (ex.: um QR code impresso com a URL atual) recebe 404 no ambiente publicado.

### 3.3 Cardápio: dados estáticos (`menu.ts`) vs. cardápio real em produção
A página `/menu-qr` ao vivo é o **cardápio de pedidos real, dinâmico**, puxado do Supabase (o mesmo padrão usado em `src/pages/public/LandingMenu.tsx`, que já busca produtos via `supabase`). Ele diverge bastante do arquivo estático `src/data/menu.ts` usado hoje na página de marketing:

| Item no site ao vivo | Preço ao vivo | Presente em `menu.ts`? |
|---|---|---|
| Ceviche de Camarão (no abacaxi tostado) | R$ 159 | ❌ Não existe |
| Cheeseburguer Pontal | R$ 49 | ❌ Não existe |
| Salada Carapitangui | R$ 49 | ❌ Não existe |
| Tartar de Atum | R$ 89 | ❌ Não existe |
| Atum do Japa | R$ 99 | ❌ Não existe |
| Picadinho de Carne | R$ 69 | ❌ Não existe |
| Talharim Al Mare | R$ 149 | ❌ Não existe |
| Filé de Peixe Branco (avulso, c/ arroz feijão e fritas) | R$ 69 | Parecido, mas `menu.ts` só tem "Filé de Peixe Branco Grelhado" (R$ 198, porção p/ 2) |
| Ceviche de Peixe Branco | R$ 85 (igual) | Descrição diferente: ao vivo "com chips de banana da terra", local "com torradas" |
| Vinagrete de Polvo | R$ 138 (igual) | Descrição ao vivo tem erro de digitação ("forradas artesanais" em vez de "torradas") |
| Fritas Carapitangui | R$ 79 (igual) | Texto quase idêntico, pequena variação de redação |

Categorias ao vivo também não batem 1:1 com `menu.ts`: existe uma categoria **"Pratos Individuais" (4 itens)** que não existe no arquivo local; "Bebidas sem Álcool" tem 5 itens ao vivo contra 2 no arquivo local; "Sobremesas" tem 2 ao vivo contra 4 no arquivo local; "Drinks Clássicos" aparece com 15 itens ao vivo (provavelmente agregando várias subcategorias que no código estão separadas em `drinks-classicos`, `drinks-experiencia`, `ice-drinks`).

**Conclusão:** `src/data/menu.ts` é conteúdo de vitrine/institucional e está desatualizado em relação ao cardápio real gerenciado no banco (Supabase) — que é o que os clientes efetivamente veem e usam para pedir. Se `menu.ts` também é usado para SEO/compartilhamento ou para a página `/menu` (ver `Menu.tsx`, que importa de `@/data/menu`), essa página vai mostrar preços e pratos que não existem mais / não batem com o que é vendido.

### 3.4 Build publicada desatualizada em relação ao repositório
- O `<title>` da aba ("Pontal Stock - Sistema de Gestão de Estoque"), a rota `/menu-qr`, e o texto de horário (22h→18h) indicam que o ambiente ao vivo está rodando um build mais antigo que o HEAD atual do repositório.
- A working tree local atualmente tem uma quantidade grande de arquivos deletados/modificados ainda não commitados (dezenas de `.md`/`.sql` de documentação de deploy antigos sendo removidos, além de mudanças em `App.tsx`, componentes de header/footer, `package.json`, etc.) — ou seja, o próprio repositório local está no meio de uma limpeza que também ainda não foi publicada.
- Não foi possível confirmar neste momento se `clubemkt.digital` é alimentado pelo mesmo pipeline de deploy do Cloudflare Pages (`_redirects`/`_routes.json` no repo) ou se é uma cópia/mirror servido por uma plataforma white-label separada (o path multi-tenant `/pontal-carapitangui/` e o título genérico "Pontal Stock" sugerem uma plataforma de terceiros, não o Cloudflare Pages direto).

## 4. O que o repositório tem que não é visível no site ao vivo

O projeto local é um sistema completo de gestão de restaurante, muito além da landing page pública:
- Autenticação e papéis (`admin`, `waiter`, `cashier`, `kitchen`) via `ProtectedRoute`.
- Fluxo de pedido do cliente via QR (`QRLanding` → `Menu` → `Checkout`/`CheckoutLegacy` → `Payment` → `OrderStatus`), com integração Mercado Pago (PIX, cartão) e polling de pagamento.
- Painel do garçom (`Waiter`, `WaiterDashboard`, `WaiterSetup`, `WaiterManagement`).
- Painel administrativo (`Admin`, `AdminProducts`, `AdminSettings`, `AdminWaiterReportsPage`, `Reports`, `CustomerManagement`, `WhatsAppAdmin`, `PrintServerConfig`).
- Caixa/cozinha (`Cashier`, `Kitchen`).
- Notificações via WhatsApp (Baileys/Evolution API), impressão de pedidos (PrintNode / print-server), geração de contrato em PDF, diagnóstico de sistema.

Nada disso é (nem deveria ser) visível publicamente em `clubemkt.digital` — são áreas autenticadas. Não foi feita varredura dessas áreas contra o ambiente ao vivo pois exigiria login com credenciais reais.

## 5. Recomendações

1. **Decidir a fonte da verdade do cardápio.** Se o cardápio real é gerenciado via Supabase (como em `LandingMenu.tsx`), considerar também migrar `Menu.tsx`/a página pública `/menu` para consumir o banco em vez do arquivo estático `src/data/menu.ts`, ou manter `menu.ts` sincronizado manualmente com o banco a cada mudança de cardápio.
2. **Corrigir o horário exibido.** Confirmar com a operação se é 18h ou 22h e alinhar `translations.ts` + `Footer.tsx` com o horário real publicado.
3. **Verificar o pipeline de deploy de `clubemkt.digital`.** Confirmar se esse domínio consome o mesmo build do Cloudflare Pages deste repo; se for uma plataforma separada, garantir que ela seja atualizada após cada deploy para não divergir (rota `/menu-qr` órfã é sintoma disso).
4. **Testar deep links em produção.** `/pontal-carapitangui/menu` retornando 404 é um problema real de SPA fallback nesse host — qualquer QR code ou link direto para o cardápio quebra.
5. **Fazer commit/push das mudanças pendentes na working tree local** antes de comparar novamente, já que o estado atual do repo (não commitado) já diverge do commit publicado.
