const fs = require('fs');
const path = 'E:\\Shop Sales Uma\\src\\app\\services\\api.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
    /image_url\?: string;/,
    "image_url?: string;\n    dedicated_image_url?: string;"
);

fs.writeFileSync(path, content, 'utf8');
console.log('Updated api.ts');
