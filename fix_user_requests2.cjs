const fs = require('fs');

const appPath = 'E:\\Shop Sales Uma\\src\\app\\App.tsx';
let appContent = fs.readFileSync(appPath, 'utf8');

const endOfLeftColumnPattern = /<div className="text-8xl select-none opacity-20 filter saturate-50 animate-pulse hidden md:block">\s*\{bannerIcon\}\s*<\/div>/;

const imageColumnHtml = `{bannerImage ? (
                  <div className="hidden md:flex flex-shrink-0 items-center justify-center p-2 rounded-2xl bg-[#1D0130]/20 border border-white/10 backdrop-blur-sm z-10">
                    <img 
                      src={bannerImage} 
                      alt={selectedCategory} 
                      className="w-40 h-40 md:w-56 md:h-56 rounded-xl object-cover shadow-2xl shadow-black/50" 
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                ) : (
                  <div className="text-8xl select-none opacity-20 filter saturate-50 animate-pulse hidden md:block">
                    {bannerIcon}
                  </div>
                )}`;

if (endOfLeftColumnPattern.test(appContent)) {
    appContent = appContent.replace(endOfLeftColumnPattern, imageColumnHtml);
    console.log('Successfully injected the banner image column');
} else {
    console.log('Could not find the text-8xl banner icon');
}

fs.writeFileSync(appPath, appContent, 'utf8');
