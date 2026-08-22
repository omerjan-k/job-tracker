const { defineConfig } = require("@meteorjs/rspack");

module.exports = defineConfig(() => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'postcss-loader', // This feeds CSS to PostCSS / Tailwind
          },
        ],
        type: 'css/auto',
      },

       // 2. Afbeeldingen Regel (PNG, JPG, GIF, WEBP)
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        type: 'asset/resource', // Rspack kopieert de afbeelding automatisch naar de build map
      },

       // 3. SVG Regel (Laat je SVG's importeren als React Componenten)
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/, // Alleen toepassen als je de SVG importeert in een JS/TS(X) bestand
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true, // Maakt de SVG schaalbaar via CSS font-size (handig voor iconen)
            },
          },
        ],
      },
    ],
  },
}));
