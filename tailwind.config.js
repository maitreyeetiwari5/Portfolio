/** Colors point at CSS variables in css/style.css. Change the palette there. */
module.exports = {
  content: ['./index.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        raised: 'var(--raised)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        accent: 'var(--accent)',
        'accent-ink': 'var(--accent-ink)',
        flag: 'var(--flag)',
        blush: 'var(--blush)',
        'blush-soft': 'var(--blush-soft)',
        butter: 'var(--butter)',
        'butter-soft': 'var(--butter-soft)',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        hand: ['Caveat', 'cursive'],
        body: ['Jost', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
