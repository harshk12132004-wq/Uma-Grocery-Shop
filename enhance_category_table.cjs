const fs = require('fs');

const adminPath = 'E:\\Shop Sales Uma\\src\\app\\components\\AdminPanel.tsx';
let adminContent = fs.readFileSync(adminPath, 'utf8');

// 1. Table Header
const oldTableHeader = `<th className="text-left px-5 py-4 text-xs font-bold text-purple-800 uppercase tracking-wider">Name</th>`;
const newTableHeader = `<th className="text-left px-5 py-4 text-xs font-bold text-purple-800 uppercase tracking-wider w-20">Image</th>
                      <th className="text-left px-5 py-4 text-xs font-bold text-purple-800 uppercase tracking-wider">Name</th>`;

adminContent = adminContent.replace(oldTableHeader, newTableHeader);

// 2. Table Row
const oldTableRow = `<td className="px-5 py-4 font-semibold text-[#1D0130]">{cat.name}</td>`;
const newTableRow = `<td className="px-5 py-4">
                          {cat.image_url ? (
                            <img src={cat.image_url} alt={cat.name} className="w-10 h-10 rounded-lg object-cover border border-purple-100 shadow-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center border border-purple-100">
                              <FolderTree size={16} className="text-purple-300" />
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4 font-semibold text-[#1D0130]">{cat.name}</td>`;

adminContent = adminContent.replace(oldTableRow, newTableRow);

fs.writeFileSync(adminPath, adminContent, 'utf8');
console.log('Category table enhanced with image column!');
