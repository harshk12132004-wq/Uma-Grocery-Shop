const fs = require('fs');

const appPath = 'E:\\Shop Sales Uma\\src\\app\\App.tsx';
let appContent = fs.readFileSync(appPath, 'utf8');

// 1. Remove the "Premium admin" text block next to User Profile icon
const userTextPattern = /<div className="hidden lg:block text-right">[\s\S]*?<p className="text-\[9px\] text-emerald-600 font-bold uppercase tracking-wider">Premium<\/p>[\s\S]*?<p className="text-sm font-semibold text-gray-200">\{currentUser\.first_name \|\| currentUser\.username\}<\/p>[\s\S]*?<\/div>/;

if (userTextPattern.test(appContent)) {
    appContent = appContent.replace(userTextPattern, '');
    console.log('Removed Premium admin text block from User Profile icon');
} else {
    console.log('Premium admin text block not found (might already be removed or format changed)');
}

// 2. Add showZero to ShoppingCart Badge
const badgePattern = /<Badge badgeContent=\{totalItems\} color="error"/g;
appContent = appContent.replace(badgePattern, '<Badge badgeContent={totalItems} showZero color="error"');
console.log('Added showZero to Shopping Cart Badge');

// 3. Add Dedicated Category Image to Category Page Banner
// First, find the return block of the category page banner
const returnPattern = /return \(\s*<div className=\{`py-12 px-6 sm:px-12 bg-gradient-to-r \$\{bannerGradient\} text-gray-200 text-left relative overflow-hidden`\}>\s*<div className="absolute -top-12 -left-12 w-48 h-48 bg-\[#1D0130\]\/5 rounded-full blur-3xl pointer-events-none"><\/div>\s*<div className="absolute -bottom-12 -right-12 w-48 h-48 bg-gradient-to-r from-\[#E4C560\] to-amber-600\/10 rounded-full blur-3xl pointer-events-none"><\/div>\s*<div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">/;

if (returnPattern.test(appContent)) {
    const replacement = `const dbCat = dbCategories.find(c => c.name === selectedCategory);
          const bannerImage = dbCat?.image_url;
          
          return (
            <div className={\`py-12 px-6 sm:px-12 bg-gradient-to-r \${bannerGradient} text-gray-200 text-left relative overflow-hidden\`}>
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#1D0130]/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-gradient-to-r from-[#E4C560] to-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 w-full">`;
              
    appContent = appContent.replace(returnPattern, replacement);
    
    // Now find the end of the left column (after the 'Shop Collection' button) and insert the right column for the image
    const endOfLeftColumnPattern = /<\/Button>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;
    
    const imageColumnHtml = `</Button>
                  </div>
                </div>
                {/* Right Column: Dedicated Category Image */}
                {bannerImage && (
                  <div className="hidden md:flex flex-shrink-0 items-center justify-center p-2 rounded-2xl bg-[#1D0130]/20 border border-white/10 backdrop-blur-sm">
                    <img 
                      src={bannerImage} 
                      alt={selectedCategory} 
                      className="w-40 h-40 md:w-56 md:h-56 rounded-xl object-cover shadow-2xl shadow-black/50" 
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>`;
    
    appContent = appContent.replace(endOfLeftColumnPattern, imageColumnHtml);
    console.log('Added Dedicated Category Image rendering to Category Page Banner');
} else {
    console.log('Could not find Category Page Banner return block');
}


fs.writeFileSync(appPath, appContent, 'utf8');
console.log('App.tsx updated successfully.');
