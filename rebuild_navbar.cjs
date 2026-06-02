const fs = require('fs');

const filePath = 'E:\\Shop Sales Uma\\src\\app\\App.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add state variable
if (!content.includes('const [isSearchOpen, setIsSearchOpen] = useState(false);')) {
  content = content.replace(
    'const [isCartOpen, setIsCartOpen] = useState(false);',
    'const [isCartOpen, setIsCartOpen] = useState(false);\n  const [isSearchOpen, setIsSearchOpen] = useState(false);'
  );
}

// 2. We need to extract the Mega Menu dropdown panel.
// It starts with `{/* Mega Dropdown Panel Panel with custom column alignments`
// and ends with 6 closing divs/ul:
/*
                      </div>
                    ))}
                  </div>
                ))}
              </div>
*/
const megaMenuStartStr = '{/* Mega Dropdown Panel Panel with custom column alignments';
const megaMenuStart = content.indexOf(megaMenuStartStr);
const megaMenuEndStr = '              </div>\r\n            </div>';
const megaMenuEnd = content.indexOf(megaMenuEndStr, megaMenuStart) + '              </div>'.length;

const megaMenuPanel = content.substring(megaMenuStart, megaMenuEnd);

// 3. We also need the mobile search bar section to use isSearchOpen.
content = content.replace(
  '<div className="block md:hidden bg-[#1D0130]/95 backdrop-blur-md px-4 pb-4 pt-1 shadow-sm border-b border-purple-900/40">',
  '<div className={`transition-all duration-300 ease-in-out overflow-hidden ${isSearchOpen ? \'max-h-24 opacity-100\' : \'max-h-0 opacity-0 md:hidden\'} block bg-[#1D0130]/95 backdrop-blur-md px-4 pb-4 pt-1 shadow-sm border-b border-purple-900/40`}>'
);

// 4. Now we build the new single-row header string.
const newHeader = `<header className="bg-[#1D0130]/95 backdrop-blur-md border-b border-purple-900/40 sticky top-0 z-40 shadow-lg transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Left: Logo */}
            <div className="flex items-center gap-3 cursor-pointer animate-fade-in flex-shrink-0" onClick={() => {
              window.history.pushState({}, '', '/');
              setSelectedCategory('All');
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}>
              <img 
                src="/logo.png" 
                alt="Uma Grocery Shop Logo" 
                className="h-16 w-auto object-contain transition-all duration-300 hover:scale-105"
              />
            </div>

            {/* Center: Navigation Links */}
            <div className="hidden lg:flex items-center justify-center gap-6 flex-1">
              <Button
                onClick={() => {
                  window.history.pushState({}, '', '/');
                  setSelectedCategory('All');
                  setCurrentView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                  '&:hover': { color: '#E4C560' }
                }}
              >
                <span className="font-serif">Home</span>
              </Button>

              {/* Premium Products Mega Menu Dropdown */}
              <div className="relative group">
                <Button
                  sx={{
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    '&:hover': { color: '#E4C560' }
                  }}
                  endIcon={<ChevronDown size={14} className="text-emerald-600 group-hover:rotate-180 transition-transform duration-300" />}
                >
                  <span className="font-serif">Products</span>
                </Button>
                
                ${megaMenuPanel}
              </div>

              <Button
                onClick={() => {
                  window.history.pushState({}, '', '/about');
                  setCurrentView('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                  '&:hover': { color: '#E4C560' }
                }}
              >
                <span className="font-serif">About Us</span>
              </Button>

              <Button
                onClick={() => {
                  window.history.pushState({}, '', '/contact');
                  setCurrentView('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                  '&:hover': { color: '#E4C560' }
                }}
              >
                <span className="font-serif">Contact Us</span>
              </Button>
            </div>

            {/* Right: Quick Actions & Icons */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <div id="google_translate_element" className="opacity-0 h-0 w-0 overflow-hidden fixed -top-[1000px] -left-[1000px] pointer-events-none translate-container"></div>
              
              {/* Search Icon */}
              <IconButton 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                sx={{ color: 'white', '&:hover': { color: '#E4C560' } }}
              >
                <Search size={22} />
              </IconButton>

              {/* Wishlist Icon */}
              <IconButton 
                onClick={() => {
                  if (!currentUser) {
                    setIsLoginOpen(true);
                  } else {
                    setIsLikesOpen(true);
                  }
                }} 
                sx={{ color: 'white', '&:hover': { color: '#E4C560' } }}
              >
                <Heart size={22} className={likedProducts.length > 0 ? "fill-red-500 text-red-500" : "text-gray-200"} />
              </IconButton>

              {/* Shopping Cart Icon */}
              <IconButton 
                onClick={() => setIsCartOpen(true)}
                sx={{ color: 'white', '&:hover': { color: '#E4C560' } }}
              >
                <Badge badgeContent={totalItems} color="error" sx={{ '& .MuiBadge-badge': { backgroundColor: '#4A0E4E', color: 'white', fontWeight: 'bold' } }}>
                  <ShoppingCart size={22} />
                </Badge>
              </IconButton>

              {/* User / Sign In */}
              {currentUser ? (
                <div className="hidden sm:flex items-center gap-2 ml-2">
                  <div className="hidden lg:block text-right">
                    <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Premium</p>
                    <p className="text-sm font-semibold text-gray-200">{currentUser.first_name || currentUser.username}</p>
                  </div>
                  <IconButton onClick={openProfile} sx={{ color: 'white', '&:hover': { color: '#E4C560' } }}>
                    <User size={22} />
                  </IconButton>
                  <Button
                    variant="text"
                    onClick={handleLogout}
                    sx={{ color: '#E4C560', textTransform: 'none', fontWeight: 'bold', fontSize: '12px', whiteSpace: 'nowrap', '&:hover': { color: 'white' } }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsLoginOpen(true)}
                  sx={{
                    color: 'white',
                    backgroundColor: '#8B9A46', // Matching Terra Kind Green
                    borderRadius: '9999px',
                    px: 3,
                    ml: 2,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    '&:hover': { backgroundColor: '#7A8836' }
                  }}
                  startIcon={<User size={18} />}
                >
                  Sign in
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>`;

// 5. Replace the old header with the new header
const headerStart = '<header className="bg-[#1D0130]/95 backdrop-blur-md border-b border-purple-900/40 sticky top-0 z-40 shadow-lg transition-colors duration-300">';
const headerEndStr = '          </div>\r\n        </div>\r\n      </header>';
const headerEndFallback = '          </div>\n        </div>\n      </header>';

let headerStartIdx = content.indexOf(headerStart);
let headerEndIdx = content.indexOf(headerEndStr);

if (headerEndIdx === -1) {
  headerEndIdx = content.indexOf(headerEndFallback);
}

if (headerStartIdx !== -1 && headerEndIdx !== -1) {
  headerEndIdx += headerEndStr.length;
  content = content.substring(0, headerStartIdx) + newHeader + content.substring(headerEndIdx);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Navbar successfully rebuilt into single row!");
} else {
  console.log("Could not find header boundaries to replace.");
}
