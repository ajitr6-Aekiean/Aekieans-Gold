// Builds desktop/app/ from the single source file ../esports-arena-planner.html.
// Edit that one file, then run `npm run dist` to make a new installer.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), out = path.join(root, 'app');
const src = fs.readFileSync(path.join(root, '..', 'esports-arena-planner.html'), 'utf8');
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(path.join(out, 'vendor', 'fonts'), { recursive: true });

// three.js, served locally so the app works offline
const three = path.join(root, 'node_modules', 'three');
fs.cpSync(path.join(three, 'build', 'three.module.js'), path.join(out, 'vendor', 'three', 'build', 'three.module.js'));
for (const dir of ['controls','postprocessing','shaders','utils','loaders','libs','environments','geometries','curves','math','objects','helpers'])
  fs.cpSync(path.join(three, 'examples', 'jsm', dir), path.join(out, 'vendor', 'three', 'examples', 'jsm', dir), { recursive: true });

// fonts, bundled
let css = '';
const fonts = [['Lexend','lexend',[300,500,600,700]],['Inter','inter',[400,500,600]],['JetBrains Mono','jetbrains-mono',[400,600]]];
for (const [fam, pkg, weights] of fonts) for (const w of weights) {
  const f = `${pkg}-latin-${w}-normal.woff2`;
  fs.copyFileSync(path.join(root, 'node_modules', '@fontsource', pkg, 'files', f), path.join(out, 'vendor', 'fonts', f));
  css += `@font-face{font-family:"${fam}";font-style:normal;font-weight:${w};font-display:swap;src:url("./fonts/${f}") format("woff2")}\n`;
}
fs.writeFileSync(path.join(out, 'vendor', 'fonts.css'), css);

let html = src
  .replace(/<link rel="preconnect"[^>]*>\n?/, '')
  .replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^"]*">/, '<link rel="stylesheet" href="./vendor/fonts.css">')
  .replace(/https:\/\/cdn\.jsdelivr\.net\/npm\/three@0\.160\.0\//g, './vendor/three/');
if (html.includes('cdn.jsdelivr') || html.includes('fonts.googleapis')) throw new Error('An online link is still in the page');
html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<style>body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style></head><body>\n' + html + '\n</body></html>\n';
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log('app/ built from esports-arena-planner.html');
