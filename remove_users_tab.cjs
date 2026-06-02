const fs = require('fs');

// 1. App.tsx Changes
const appTsxPath = 'E:\\Shop Sales Uma\\src\\app\\App.tsx';
let appContent = fs.readFileSync(appTsxPath, 'utf8');

appContent = appContent.replace(
  "minHeight: '52px',",
  "// minHeight removed"
);
appContent = appContent.replace(
  '<div className="flex items-center gap-1.5 mb-4">',
  '<div className="flex items-center gap-1.5 mb-1">'
);

fs.writeFileSync(appTsxPath, appContent, 'utf8');


// 2. AdminPanel.tsx Changes
const adminTsxPath = 'E:\\Shop Sales Uma\\src\\app\\components\\AdminPanel.tsx';
let adminContent = fs.readFileSync(adminTsxPath, 'utf8');

// Remove the Users tab definition
adminContent = adminContent.replace(
  "    { key: 'users', label: 'Users', icon: <Users size={20} /> },\n",
  ""
);

// Remove the entire USERS TAB section
// We'll find the start and end of it.
const usersTabStartStr = '{/* ===== USERS TAB ===== */}';
const usersTabStartIndex = adminContent.indexOf(usersTabStartStr);
const nextTabStartStr = '{/* ===== ADD/EDIT CATEGORY DIALOG ===== */}';
const nextTabStartIndex = adminContent.indexOf(nextTabStartStr);

if (usersTabStartIndex !== -1 && nextTabStartIndex !== -1) {
  // Extract everything from the users tab up to the next dialog
  const textToRemove = adminContent.substring(usersTabStartIndex, nextTabStartIndex);
  adminContent = adminContent.replace(textToRemove, '\n        ');
  
  fs.writeFileSync(adminTsxPath, adminContent, 'utf8');
  console.log("Admin Users tab removed successfully.");
} else {
  console.log("Could not find boundaries in AdminPanel.tsx");
}

