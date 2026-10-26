/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        negro: '#000000',
        panel: '#151515',
        'panel-2': '#1f1f1f',
        linea: '#2e2e2e',
        rojo: '#e3131b',
        'rojo-hondo': '#b30d14',
        led: '#ff2a1f',
        'led-off': '#2a0806',
        tiza: '#f1f1ef',
        gris: '#a3a3a3',
        verde: '#2bd65a',
      },
      fontFamily: {
        // Barlow Condensed = títulos (itálica 900, como los flyers). Barlow = texto.
        cond: ['"Barlow Condensed"', '"Arial Narrow"', 'Impact', 'sans-serif'],
        sans: ['Barlow', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
      spacing: {
        gutter: 'clamp(16px, 4vw, 56px)',
      },
      transitionTimingFunction: {
        golpe: 'cubic-bezier(.7,0,.25,1)',
      },
    },
  },
  plugins: [],
};
