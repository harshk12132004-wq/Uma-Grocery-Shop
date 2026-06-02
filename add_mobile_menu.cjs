const fs = require('fs');

const filePath = 'E:\\Shop Sales Uma\\src\\app\\App.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add `Menu` to lucide-react imports if not there
if (content.includes('lucide-react') && !content.includes('Menu,')) {
  content = content.replace('ShoppingCart,', 'ShoppingCart,\n  Menu,');
}

// 2. Add isMobileMenuOpen state
if (!content.includes('isMobileMenuOpen')) {
  content = content.replace(
    'const [isSearchOpen, setIsSearchOpen] = useState(false);',
    'const [isSearchOpen, setIsSearchOpen] = useState(false);\n  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);'
  );
}

// 3. Add Hamburger Menu Button to Navbar
const hamburgerHTML = `
            {/* Hamburger Menu (Mobile Only) */}
            <div className="flex items-center lg:hidden">
              <IconButton onClick={() => setIsMobileMenuOpen(true)} sx={{ color: 'white' }}>
                <Menu size={26} />
              </IconButton>
            </div>
`;
if (!content.includes('setIsMobileMenuOpen(true)')) {
  content = content.replace(
    '{/* Left: Logo */}',
    `${hamburgerHTML}\n            {/* Left: Logo */}`
  );
}

// 4. Add Mobile Menu Drawer
const mobileMenuDrawerHTML = `
      {/* Mobile Navigation Drawer */}
      <Drawer anchor="left" open={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
        <div className="w-72 h-full flex flex-col bg-[#1D0130] text-white">
          <div className="p-5 flex items-center justify-between border-b border-purple-900/40">
            <img src="/logo.png" alt="Uma Grocery" className="h-10 w-auto object-contain" />
            <IconButton onClick={() => setIsMobileMenuOpen(false)} sx={{ color: 'white' }}>
              <X size={20} />
            </IconButton>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <Button
              onClick={() => {
                window.history.pushState({}, '', '/');
                setSelectedCategory('All');
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsMobileMenuOpen(false);
              }}
              sx={{ color: 'white', justifyContent: 'flex-start', textTransform: 'none', fontSize: '16px' }}
            >
              <span className="font-serif">Home</span>
            </Button>
            <div className="border-t border-purple-900/40 my-2"></div>
            <Typography variant="overline" sx={{ px: 2, color: '#E4C560' }}>Categories</Typography>
            {dbCategories.map((cat) => (
              <Button
                key={cat.id}
                onClick={() => {
                  const slug = categoryToSlug[cat.name] || cat.name.toLowerCase().replace(/\\s+/g, '-');
                  window.history.pushState({}, '', \`/category/\${slug}\`);
                  setSelectedCategory(cat.name);
                  setCurrentView('category-page');
                  setSearchQuery('');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setIsMobileMenuOpen(false);
                }}
                sx={{ color: 'gray', justifyContent: 'flex-start', textTransform: 'none', pl: 4 }}
              >
                {cat.name}
              </Button>
            ))}
            <div className="border-t border-purple-900/40 my-2"></div>
            <Button
              onClick={() => {
                window.history.pushState({}, '', '/about');
                setCurrentView('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsMobileMenuOpen(false);
              }}
              sx={{ color: 'white', justifyContent: 'flex-start', textTransform: 'none', fontSize: '16px' }}
            >
              <span className="font-serif">About Us</span>
            </Button>
            <Button
              onClick={() => {
                window.history.pushState({}, '', '/contact');
                setCurrentView('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsMobileMenuOpen(false);
              }}
              sx={{ color: 'white', justifyContent: 'flex-start', textTransform: 'none', fontSize: '16px' }}
            >
              <span className="font-serif">Contact Us</span>
            </Button>
          </div>
        </div>
      </Drawer>
`;

if (!content.includes('Mobile Navigation Drawer')) {
  content = content.replace(
    '{/* Cart Drawer */}',
    `${mobileMenuDrawerHTML}\n      {/* Cart Drawer */}`
  );
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Mobile Menu successfully added!");
