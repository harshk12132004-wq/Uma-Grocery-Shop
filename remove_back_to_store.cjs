const fs = require('fs');

const adminPath = 'E:\\Shop Sales Uma\\src\\app\\components\\AdminPanel.tsx';
let adminContent = fs.readFileSync(adminPath, 'utf8');

// Find and remove the Back to Store button
const backToStorePattern = /<Button\s+onClick=\{onNavigateHome\}[\s\S]*?Back to Store\s*<\/Button>/;
adminContent = adminContent.replace(backToStorePattern, '');

fs.writeFileSync(adminPath, adminContent, 'utf8');
console.log('Back to Store button removed!');
