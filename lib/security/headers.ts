export const securityHeaders = {
  // Prevenir XSS y otras inyecciones
  "Content-Security-Policy": `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `
    .replace(/\s+/g, " ")
    .trim(),

  // Prevenir clickjacking
  "X-Frame-Options": "DENY",

  // Prevenir MIME-type sniffing
  "X-Content-Type-Options": "nosniff",

  // Habilitar protecciones XSS en navegadores antiguos
  "X-XSS-Protection": "1; mode=block",

  // Prevenir filtración de información del referrer
  "Referrer-Policy": "strict-origin-when-cross-origin",

  // Habilitar HSTS
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",

  // Prevenir exposición de información sensible
  "X-Permitted-Cross-Domain-Policies": "none",

  // Deshabilitar cache para contenido dinámico
  "Cache-Control": "no-store, max-age=0",
}

