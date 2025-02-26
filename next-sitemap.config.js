/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  generateRobotsTxt: true,
  exclude: ["/admin/*", "/login"],
  robotsTxtOptions: {
    additionalSitemaps: [`${process.env.NEXT_PUBLIC_APP_URL}/server-sitemap.xml`],
  },
  transform: async (config, path) => {
    // Personalizar prioridad basada en la ruta
    const priorities = {
      "/": 1.0,
      "/gallery": 0.8,
      "/contact": 0.7,
    }

    return {
      loc: path,
      changefreq: "daily",
      priority: priorities[path] || 0.5,
      lastmod: new Date().toISOString(),
    }
  },
}

