const fs = require('fs');

const appTsxPath = 'E:\\Shop Sales Uma\\src\\app\\App.tsx';
let appContent = fs.readFileSync(appTsxPath, 'utf8');

const adminTsxPath = 'E:\\Shop Sales Uma\\src\\app\\components\\AdminPanel.tsx';
let adminContent = fs.readFileSync(adminTsxPath, 'utf8');

// ==========================================
// 1. Admin Panel Users Tab Crash Fix
// ==========================================
adminContent = adminContent.replace(
  /user\.username\.toLowerCase\(\)\.includes\(\(userSearch \|\| ''\)\.toLowerCase\(\)\) \|\|\s*user\.email\.toLowerCase\(\)\.includes\(\(userSearch \|\| ''\)\.toLowerCase\(\)\)/g,
  '(user.username || \'\').toLowerCase().includes((userSearch || \'\').toLowerCase()) || (user.email || \'\').toLowerCase().includes((userSearch || \'\').toLowerCase())'
);
fs.writeFileSync(adminTsxPath, adminContent, 'utf8');

// ==========================================
// 2. Product Card Full Size Image & Remove Unused Lines
// ==========================================
appContent = appContent.replace(
  'className="p-4 bg-[#FAF8FB] rounded-t-[24px] flex items-center justify-center h-48 overflow-hidden relative cursor-pointer group/img"',
  'className="rounded-t-[24px] flex items-center justify-center h-48 overflow-hidden relative cursor-pointer group/img"'
);

appContent = appContent.replace(
  'className="max-h-[90%] max-w-[90%] object-contain p-1 transition-transform duration-500 group-hover:scale-105"',
  'className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"'
);

// Second replacement for regular image inside product card (there is an if/else for tomato)
appContent = appContent.replace(
  'className="max-h-[90%] max-w-[90%] object-contain p-1 transition-transform duration-500 group-hover:scale-105"',
  'className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"'
);

// Reduce top margin/padding for the line above price
appContent = appContent.replace(
  '<div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2A0033] font-sans">',
  '<div className="flex items-center justify-between mt-1 pt-2 font-sans">'
);

// Quantity text color fix
appContent = appContent.replace(
  '<span className="text-xs font-bold text-white w-5 text-center">{cartItem.quantity}</span>',
  '<span className="text-xs font-bold text-[#4A0E4E] w-5 text-center">{cartItem.quantity}</span>'
);


// ==========================================
// 3. Premium Sourcing Categories Background
// ==========================================
appContent = appContent.replace(
  '<section className="py-16 bg-[#130120]">',
  '<section className="py-16 bg-[#FAF7FB] border-t border-[#F3EDF5]">'
);
// Also change the title colors since background is now light!
appContent = appContent.replace(
  '<h2 className="text-3xl font-extrabold text-[#E4C560] font-serif mt-1">Explore Sourced Categories</h2>',
  '<h2 className="text-3xl font-extrabold text-[#1D0130] font-serif mt-1">Explore Sourced Categories</h2>'
);
appContent = appContent.replace(
  '<p className="text-purple-300 text-sm mt-2 max-w-md mx-auto">Click any category image in the collage to split and filter products instantly.</p>',
  '<p className="text-gray-600 text-sm mt-2 max-w-md mx-auto">Click any category image in the collage to split and filter products instantly.</p>'
);


// ==========================================
// 4. Broken Logos/Icons
// ==========================================
// Free Express Delivery
appContent = appContent.replace(
  '<span className="w-5 h-5 rounded-full bg-emerald-600/10 border border-[#E4C560]/30 flex items-center justify-center text-emerald-600 font-bold"></span>',
  '<span className="w-6 h-6 rounded-full bg-emerald-600/10 border border-emerald-600/30 flex items-center justify-center text-emerald-600"><Truck size={12} /></span>'
);
// Secure Real-Time OTP Verification
appContent = appContent.replace(
  '<span className="w-5 h-5 rounded-full bg-emerald-600/10 border border-[#E4C560]/30 flex items-center justify-center text-emerald-600 font-bold"></span>',
  '<span className="w-6 h-6 rounded-full bg-emerald-600/10 border border-emerald-600/30 flex items-center justify-center text-emerald-600"><ShieldCheck size={12} /></span>'
);
// 100% Organic Sourcing
appContent = appContent.replace(
  '<span className="w-5 h-5 rounded-full bg-emerald-600/10 border border-[#E4C560]/30 flex items-center justify-center text-emerald-600 font-bold"></span>',
  '<span className="w-6 h-6 rounded-full bg-emerald-600/10 border border-emerald-600/30 flex items-center justify-center text-emerald-600"><Leaf size={12} /></span>'
);

// Other features section
appContent = appContent.replace(
  '<span className="w-5 h-5 rounded-full bg-emerald-600/10 border border-[#E4C560]/30 flex items-center justify-center text-emerald-600 font-bold"></span>\n                <span>Direct Organic Farm Sourcing</span>',
  '<span className="w-6 h-6 rounded-full bg-emerald-600/10 border border-emerald-600/30 flex items-center justify-center text-emerald-600"><Leaf size={12} /></span>\n                <span>Direct Organic Farm Sourcing</span>'
);
appContent = appContent.replace(
  '<span className="w-5 h-5 rounded-full bg-emerald-600/10 border border-[#E4C560]/30 flex items-center justify-center text-emerald-600 font-bold"></span>\n                <span>Fast & Safe Checkout Delivery</span>',
  '<span className="w-6 h-6 rounded-full bg-emerald-600/10 border border-emerald-600/30 flex items-center justify-center text-emerald-600"><Truck size={12} /></span>\n                <span>Fast & Safe Checkout Delivery</span>'
);
appContent = appContent.replace(
  '<span className="w-5 h-5 rounded-full bg-emerald-600/10 border border-[#E4C560]/30 flex items-center justify-center text-emerald-600 font-bold"></span>\n                <span>Instant OTP Verification Security</span>',
  '<span className="w-6 h-6 rounded-full bg-emerald-600/10 border border-emerald-600/30 flex items-center justify-center text-emerald-600"><ShieldCheck size={12} /></span>\n                <span>Instant OTP Verification Security</span>'
);
if (appContent.includes('lucide-react') && !appContent.includes('Leaf,')) {
  appContent = appContent.replace('Menu,', 'Menu,\n  Leaf,');
}


// ==========================================
// 5. Mobile Menu - Add Profile & Logout
// ==========================================
const mobileMenuProfileLogout = `
            {currentUser && (
              <>
                <div className="border-t border-purple-900/40 my-2"></div>
                <Typography variant="overline" sx={{ px: 2, color: '#E4C560' }}>Account</Typography>
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openProfile();
                  }}
                  sx={{ color: 'white', justifyContent: 'flex-start', textTransform: 'none', fontSize: '16px' }}
                  startIcon={<User size={18} />}
                >
                  <span className="font-serif">My Profile</span>
                </Button>
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  sx={{ color: 'tomato', justifyContent: 'flex-start', textTransform: 'none', fontSize: '16px' }}
                >
                  <span className="font-serif">Logout</span>
                </Button>
              </>
            )}
`;
appContent = appContent.replace(
  '<span className="font-serif">Contact Us</span>\n            </Button>',
  '<span className="font-serif">Contact Us</span>\n            </Button>' + mobileMenuProfileLogout
);


// ==========================================
// 6. Phone Number in Registration
// ==========================================
// Add signup form field
if (!appContent.includes('signupForm.phone')) {
  appContent = appContent.replace(
    'const [signupForm, setSignupForm] = useState({ username: \'\', email: \'\', password: \'\', password2: \'\' });',
    'const [signupForm, setSignupForm] = useState({ username: \'\', email: \'\', password: \'\', password2: \'\', phone: \'\' });'
  );
  
  const phoneInputHTML = `
                <TextField
                  fullWidth
                  label="Phone Number"
                  variant="outlined"
                  size="small"
                  value={signupForm.phone}
                  onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                />
  `;
  appContent = appContent.replace(
    'onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}\n                />',
    'onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}\n                />' + phoneInputHTML
  );
}

// ==========================================
// 7. Phone Number in User Profile
// ==========================================
// App.tsx profileForm already has `phone`, let's just make sure it's rendered!
const profilePhoneInputHTML = `
              <div className="flex gap-4">
                <TextField
                  fullWidth
                  label="Phone Number"
                  variant="outlined"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  sx={{ backgroundColor: '#FAF8FB' }}
                />
              </div>
`;
if (!appContent.includes('profileForm.phone')) {
  appContent = appContent.replace(
    'onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}\n                  sx={{ backgroundColor: \'#FAF8FB\' }}\n                />\n              </div>',
    'onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}\n                  sx={{ backgroundColor: \'#FAF8FB\' }}\n                />\n              </div>' + profilePhoneInputHTML
  );
}

fs.writeFileSync(appTsxPath, appContent, 'utf8');
console.log("All UI updates applied successfully!");
