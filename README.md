<div align="center">

# 💎 Central Logística | HortSoy

**Plataforma Web de Roteirização Imersiva e Segura (Enterprise Grade)**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.7-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.6-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-GeoSpatial-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)

"A essência do alto padrão na malha logística. Inteligência geográfica e precisão tática."

</div>

---

## 📋 Índice

- [💎 Visão do Projeto](#-visão-do-projeto)
- [🚀 Stack Tecnológica](#-stack-tecnológica)
- [🌍 Monitoramento Climático e UX](#-monitoramento-climático-e-ux)
- [🎨 Arquitetura de Roteirização Interativa](#-arquitetura-de-roteirização-interativa)
- [🏛️ Arquitetura (Clean Code)](#%EF%B8%8F-arquitetura-clean-code)
- [🛡️ Cibersegurança e AppSec (CSP & Hardening)](#%EF%B8%8F-cibersegurança-e-appsec-csp--hardening)

---

## 💎 Visão do Projeto

A plataforma da **Central Logística HortSoy** foi projetada para resolver o complexo desafio de conectar múltiplas unidades produtivas e centros de distribuição da forma mais eficiente e fluida possível. Empregando design _Glassmorphism_, navegação tática sem atrito e renderização cartográfica imersiva (Framer Motion), o projeto traz uma experiência de roteirização inigualável no mercado agroindustrial corporativo.

---

## 🚀 Stack Tecnológica

### Interface e Interatividade Cartográfica

- **Framework Core**: Next.js 16.2.9 (App Router) e React 19.
- **Geoprocessamento Visual**: Leaflet (Motor Interativo) e React-Leaflet.
- **Estilização**: Tailwind CSS (Design System nativo) e Lucide-React.
- **Animações Fluidas**: Framer Motion (Transições de painéis, redimensionamento dinâmico e micro-interações de Hover).
- **Gerenciamento de Estado**: Zustand (Store Global ultraleve) e TanStack Query v5 (Server-State e Cache Management).

### Qualidade de Código e DevSecOps

- **Linguagem**: TypeScript (Strict Mode).
- **Validação e Tipagem de Borda**: Zod para segurança estrita nas rotas de API (BFF).
- **Auditoria de Código Base**: Zero avisos de Linter e dependências com _Overrides_ rigorosos aplicados, garantindo ausência de brechas conhecidas e memory leaks no ciclo de vida do mapa em Leaflet.

---

## 🌍 Monitoramento Climático e UX

A plataforma foi arquitetada com suporte nativo a dados meteorológicos hiper-locais integrados diretamente na visualização da malha logística:

- **Inteligência Desacoplada (Open-Meteo)**: Os widgets climáticos das unidades reagem em tempo real, fornecendo temperatura (°C) e probabilidade de precipitação (%) de forma assíncrona.
- **Estratégia de Cache Agressiva**: Para preservar a banda e os limites da API externa, toda requisição de clima possui _Stale-Time_ customizado via React Query e revalidação de 15 minutos em Edge no Next.js (BFF), impedindo gargalos de _rate-limit_ no Client-Side.

---

## 🎨 Arquitetura de Roteirização Interativa

O front-end conta com um ecossistema inteligente de seleção de unidades:

- **Fluxo de Seleção Cronológico (Checklists)**: O menu de navegação lateral rastreia os cliques do usuário em ordem estrita. Ao invés do algoritmo forçado que ignorava a vontade humana, a arquitetura agora constrói a rota tática exatamente no fluxo cronológico planejado pelo despachante.
- **Redimensionamento Tático (Collapsible Layout)**: A barra lateral retrai-se inteligentemente em ambos os eixos (para um quadrado minimalista no topo), liberando 95% do canvas de renderização com animações aveludadas de _Border Radius_.
- **Relatórios Flutuantes**: Modal imersiva em sobreposição contendo os _legs_ (trechos) destrinchados com quilometragem precisa da malha real (OSRM), duração estrita e atalho nativo para execução _turn-by-turn_ direto no Google Maps.

---

## 🏛️ Arquitetura (Clean Code)

O projeto adota uma estrutura modular focada em escalabilidade, tipagem estrita, desacoplamento e isolamento de responsabilidades (_Enterprise Grade_):

```text
/
├── app/                  # Rotas Dinâmicas do Next.js (App Router)
│   ├── api/              # Backend For Frontend (BFF) - Roteamento & Clima
│   └── page.tsx          # Ponto de injeção da Store e QueryClient
├── components/           # Componentes Modulares Isolados
│   ├── Map.tsx           # Cartografia Isolada via dynamic import()
│   ├── Sidebar.tsx       # Controle Tático e Flow de Usuário
│   └── WeatherWidget.tsx # Integração Meteorológica Assíncrona
├── store/                # Estado Global (Zustand) Desacoplado
├── providers/            # React Query Configuration Boundary
├── data/                 # Fontes de Verdade e Dicionários Geográficos
└── utils/                # Lógicas puras de cálculo de tempo
```

---

## 🛡️ Cibersegurança e AppSec (CSP & Hardening)

Nenhuma beleza visual e performance justificam uma vulnerabilidade estrutural. O código-fonte da Central Logística opera sob rigorosos padrões de _Security by Design_:

1. **Proxy Híbrido (Middleware Strict CSP)**
   - Proteção de Borda: O `proxy.ts` (Next.js) possui regras rigorosas de Content Security Policy, blindando a aplicação contra _Clickjacking_ e bloqueando qualquer script invasivo (XSS). Conexões externas só são permitidas para URLs estritamente pré-autorizadas (`api.open-meteo.com` e OSRM).
2. **Eficiência e Proteção de Sub-Dependências (Overrides NPM)**
   - O repositório monitora de perto as árvores secundárias do ecossistema. Modificadores arquiteturais no `package.json` neutralizam falhas em dependências (como PostCSS Injection), blindando os processos de Build sem comprometer a compilação.
3. **Gateway Seguro via Zod no BFF**
   - A requisição para a API pública de trânsito (OSRM) não parte do navegador do cliente para evitar sequestro de carga (SSRF). Toda montagem do itinerário vai para o backend via POST HTTPS seguro, que filtra o array via Schema do **Zod** antes de processar as chamadas pesadas remotamente.

---

<div align="center">
© 2026 <strong>Central Logística | HortSoy</strong>.
</div>
