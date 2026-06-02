const fs = require('fs');
const appPath = 'E:\\Shop Sales Uma\\src\\app\\App.tsx';

let lines = fs.readFileSync(appPath, 'utf8').split('\n');

const startIndex = lines.findIndex(l => l.includes('onChange={(e) => {'));
const endIndex = lines.findIndex((l, i) => i > startIndex && l.includes('{/* Deluxe Collage of Categories (User Request 2) */}'));

if (startIndex !== -1 && endIndex !== -1) {
    console.log(`Deleting from line ${startIndex + 1} to ${endIndex}`);
    // We want to delete from startIndex up to (but not including) endIndex
    lines.splice(startIndex, endIndex - startIndex);
    
    fs.writeFileSync(appPath, lines.join('\n'), 'utf8');
    console.log('Successfully deleted hallucinated block.');
} else {
    console.log(`Error: startIndex=${startIndex}, endIndex=${endIndex}`);
}
