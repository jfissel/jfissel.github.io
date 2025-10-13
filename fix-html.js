import fs from 'fs';

// Read the HTML file
let html = fs.readFileSync('dist/index.html', 'utf8');

// Add the CSS links back
html = html.replace(
  '    <!-- CSS -->',
  `    <!-- CSS -->
    <link rel="stylesheet" href="/src/css/base.css" />
    <link rel="stylesheet" href="/src/css/main.css" />
    <link rel="stylesheet" href="/src/css/vendor.css" />`
);

// Fix image paths
html = html.replace(/\/src\/images\//g, '/assets/');

// Write the fixed HTML
fs.writeFileSync('dist/index.html', html);

console.log('HTML file fixed successfully');
