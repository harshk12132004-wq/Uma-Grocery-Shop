const fs = require('fs');

const adminPath = 'E:\\Shop Sales Uma\\src\\app\\components\\AdminPanel.tsx';
let adminContent = fs.readFileSync(adminPath, 'utf8');

// Add state for dedicated image
adminContent = adminContent.replace(
    /const \[formCategoryImage, setFormCategoryImage\] = useState\(''\);/,
    "const [formCategoryImage, setFormCategoryImage] = useState('');\n  const [formDedicatedImage, setFormDedicatedImage] = useState('');"
);

// Add to reset form
adminContent = adminContent.replace(
    /setFormCategoryImage\(''\);/,
    "setFormCategoryImage('');\n    setFormDedicatedImage('');"
);

// Populate when editing
adminContent = adminContent.replace(
    /setFormCategoryImage\(cat.image_url \|\| ''\);/,
    "setFormCategoryImage(cat.image_url || '');\n    setFormDedicatedImage(cat.dedicated_image_url || '');"
);

// Submit payload
adminContent = adminContent.replace(
    /const data = \{ name: formCategoryName, description: formCategoryDescription, image_url: formCategoryImage \};/,
    "const data = { name: formCategoryName, description: formCategoryDescription, image_url: formCategoryImage, dedicated_image_url: formDedicatedImage };"
);

// Add input to JSX
const newImageInput = `
            <div className="pt-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">DEDICATED CATEGORY PAGE IMAGE URL (OPTIONAL)</label>
              <input
                type="text"
                placeholder="https://..."
                value={formDedicatedImage}
                onChange={(e) => setFormDedicatedImage(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500"
              />
              {formDedicatedImage && (
                <div className="mt-3 p-2 border border-purple-100 rounded-xl bg-purple-50 flex items-center gap-4">
                  <img src={formDedicatedImage} alt="Preview" className="w-16 h-16 rounded-lg object-cover shadow-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <span className="text-xs font-bold text-purple-700">Dedicated Image Preview</span>
                </div>
              )}
            </div>`;

adminContent = adminContent.replace(
    /\{\/\* Add Category Image \*\/\}[\s\S]*?\{\/\* End Category Image \*\/\}/,
    (match) => match + '\n' + newImageInput
);

// If the marker comment doesn't exist, try to replace based on the existing image input
if (!adminContent.includes(newImageInput)) {
    const existingInputPattern = /<div className="mt-3 p-2 border border-purple-100 rounded-xl bg-purple-50 flex items-center gap-4">\s*<img src=\{formCategoryImage\}[\s\S]*?<\/div>\s*\)\}\s*<\/div>/;
    
    adminContent = adminContent.replace(existingInputPattern, (match) => match + '\n' + newImageInput);
}

fs.writeFileSync(adminPath, adminContent, 'utf8');

// Now for App.tsx
const appPath = 'E:\\Shop Sales Uma\\src\\app\\App.tsx';
let appContent = fs.readFileSync(appPath, 'utf8');

// 1. Fix the logout button
const dialogActionsPattern = /<DialogActions sx=\{\{ p: 3, pt: 0 \}\}>\s*<Button onClick=\{\(\) => setIsProfileOpen\(false\)\} sx=\{\{ color: 'gray', fontWeight: 'bold' \}\}>Cancel<\/Button>\s*<Button\s*onClick=\{handleSaveProfile\}[\s\S]*?>[\s\S]*?<\/Button>\s*<\/DialogActions>/;

const newDialogActions = `<DialogActions sx={{ p: 3, pt: 0, justifyContent: 'space-between' }}>
          <Button 
            onClick={() => {
              handleLogout();
              setIsProfileOpen(false);
            }} 
            color="error" 
            variant="outlined" 
            sx={{ fontWeight: 'bold', borderRadius: '12px' }}
          >
            Logout Securely
          </Button>
          <div className="flex gap-2">
            <Button onClick={() => setIsProfileOpen(false)} sx={{ color: 'gray', fontWeight: 'bold' }}>Cancel</Button>
            <Button 
              onClick={handleSaveProfile} 
              disabled={loading}
              variant="contained" 
              sx={{ backgroundColor: '#1D0130', borderRadius: '12px', px: 4, fontWeight: 'bold', '&:hover': { backgroundColor: '#4A0E4E' } }}
            >
              {loading ? 'Saving...' : 'Save Profile Settings'}
            </Button>
          </div>
        </DialogActions>`;

if (dialogActionsPattern.test(appContent)) {
    appContent = appContent.replace(dialogActionsPattern, newDialogActions);
}

// 2. Use dedicated_image_url for the banner
appContent = appContent.replace(
    /const bannerImage = dbCat\?\.image_url;/,
    "const bannerImage = dbCat?.dedicated_image_url || dbCat?.image_url;"
);

fs.writeFileSync(appPath, appContent, 'utf8');

console.log('AdminPanel and App updated');
