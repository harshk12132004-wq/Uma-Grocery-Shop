const fs = require('fs');

const appTsxPath = 'E:\\Shop Sales Uma\\src\\app\\App.tsx';
let appContent = fs.readFileSync(appTsxPath, 'utf8');

// 1. App.tsx: Add email to profileForm state
appContent = appContent.replace(
  "const [profileForm, setProfileForm] = useState({ first_name: '', phone: '', address: '', pincode: '', language: 'en' });",
  "const [profileForm, setProfileForm] = useState({ first_name: '', phone: '', email: '', address: '', pincode: '', language: 'en' });"
);

// 2. App.tsx: Map email in openProfile
appContent = appContent.replace(
  "pincode: user?.pincode || '',",
  "pincode: user?.pincode || '',\n                            email: user?.email || '',"
);

// 3. App.tsx: Add Email field to Profile Settings Dialog
const phoneFieldHtml = `            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>`;
const emailAndPhoneHtml = `            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email ID</label>
              <input
                type="email"
                value={profileForm.email}
                disabled
                className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-xl px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>`;
appContent = appContent.replace(phoneFieldHtml, emailAndPhoneHtml);

// 4. App.tsx: Remove Logout from Desktop Header (the `<Button onClick={handleLogout}...>Logout</Button>`)
// It is around line 1020:
// <Button variant="text" onClick={handleLogout} sx={{ ... }}> Logout </Button>
const logoutButtonRegex = /<Button[^>]*onClick=\{handleLogout\}[^>]*>\s*Logout\s*<\/Button>/;
appContent = appContent.replace(logoutButtonRegex, "");
// And also remove the divider if it's there? Let's just remove the button.

// 5. App.tsx: Feature Icon Colors
// They are `<div className="bg-[#F6EFF7] text-white p-2.5 rounded-xl">`
appContent = appContent.replace(
  /className="bg-\[\#F6EFF7\] text-white p-2\.5 rounded-xl"/g,
  'className="bg-[#F6EFF7] text-[#4A0E4E] p-2.5 rounded-xl"'
);

fs.writeFileSync(appTsxPath, appContent, 'utf8');

// ==========================================
// AdminPanel.tsx Changes
const adminTsxPath = 'E:\\Shop Sales Uma\\src\\app\\components\\AdminPanel.tsx';
let adminContent = fs.readFileSync(adminTsxPath, 'utf8');

// 1. Remove Back to Store button
const backToStoreRegex = /<Button[^>]*onClick=\{\(\)\s*=>\s*\{\s*window\.location\.href\s*=\s*'http:\/\/localhost:5174\/'[^}]*\}\}[^>]*>[\s\S]*?Back to Store\s*<\/Button>/;
adminContent = adminContent.replace(backToStoreRegex, "");

// 2. Add image preview for Category
const categoryImageInputHtml = `placeholder="https://..."
            />
          </div>`;
const categoryImageInputWithPreviewHtml = `placeholder="https://..."
            />
          </div>
          
          {formCategoryImage && (
              <div className="flex items-center gap-4 p-4 mt-2 bg-purple-50/50 rounded-xl border border-purple-100">
                <img src={formCategoryImage} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-purple-200 shadow-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <p className="text-sm text-gray-600 font-medium">Image Preview</p>
              </div>
          )}`;
adminContent = adminContent.replace(categoryImageInputHtml, categoryImageInputWithPreviewHtml);

fs.writeFileSync(adminTsxPath, adminContent, 'utf8');

console.log("Final UI updates applied!");
