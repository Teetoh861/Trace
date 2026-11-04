// Assemble the final site after `expo export`:
//   /          -> landing/index.html   (marketing site)
//   /app/*     -> dist/app.html        (the Expo app, client-side routed)
//   /console   -> landing/console.html (staff console demo)
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');
const landing = path.join(__dirname, '..', 'landing');

fs.renameSync(path.join(dist, 'index.html'), path.join(dist, 'app.html'));
for (const f of fs.readdirSync(landing)) {
  fs.copyFileSync(path.join(landing, f), path.join(dist, f));
}
console.log('Site assembled: index.html (landing), app.html (app), console.html (console)');
