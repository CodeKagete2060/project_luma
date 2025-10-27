// Use CommonJS export because the project `package.json` is using "type": "module"
// and PostCSS loads this file via CommonJS loader when file has .cjs extension.
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
