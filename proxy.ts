import { NextResponse } from "next/server";

export function proxy() {
  // Configuração avançada de segurança e rotas (Enterprise Grade)
  const response = NextResponse.next();

  // 1. Definição de Cabeçalhos de Segurança (Security Headers)

  // CSP (Content Security Policy) restrita
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline' https://unpkg.com;
    img-src 'self' blob: data: https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com https://unpkg.com;
    font-src 'self' data:;
    connect-src 'self' https://router.project-osrm.org https://api.open-meteo.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  response.headers.set("Content-Security-Policy", cspHeader);

  // Previne XSS (Cross-Site Scripting) restabelecendo validação no client-side
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Previne clickjacking garantindo que a aplicação não possa ser embutida em iframes maliciosos
  response.headers.set("X-Frame-Options", "DENY");

  // Previne MIME-sniffing, forçando o navegador a respeitar o Content-Type declarado
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Controle estrito de cache remoto para referências (privacidade e segurança da origem)
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // HSTS: Força conexões HTTPS strictly via navegador, reduzindo downgrade attacks
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload",
  );

  response.headers.set("x-secured-by", "HortSoy-Logistics-Hub-Enterprise");

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.png$).*)"],
};
