const fs = require('fs');

const appPath = 'E:\\Shop Sales Uma\\src\\app\\App.tsx';
let appContent = fs.readFileSync(appPath, 'utf8');

// The marker we use to replace everything between it and the target
const startMarker = "const imgUrl = dbCat?.image_url || categoryImages[category] || fallbackImages[hash % fallbackImages.length];\n                  const label = categoryLabels[category] || `✨ ${category}`;";

const endMarker = `          const dbCat = dbCategories.find(c => c.name === selectedCategory);
          const bannerImage = dbCat?.image_url;`;

const restoredCode = `                  
                  // Give some collage grid span items for variety
                  const isLarge = idx === 0 || idx === 4;

                  return (
                    <div
                      key={category}
                      onClick={() => {
                        const slug = categoryToSlug[category] || category.toLowerCase().replace(/\\s+/g, '-');
                        window.history.pushState({}, '', slug === 'all' ? '/' : \`/category/\${slug}\`);
                        setSelectedCategory(category);
                        setCurrentView(slug === 'all' ? 'home' : 'category-page');
                        
                        setTimeout(() => {
                          if (slug === 'all') {
                            document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' });
                          } else {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }, 50);
                      }}
                      className={\`relative overflow-hidden rounded-2xl cursor-pointer group shadow-md transition-all duration-500 border-2 hover:shadow-xl hover:-translate-y-1 \${
                        isActive ? 'border-[#E4C560] scale-102 ring-4 ring-purple-100' : 'border-[#2A0033] hover:border-purple-900/40'
                      } \${isLarge ? 'col-span-2' : 'col-span-1'} h-48 sm:h-56\`}
                    >
                      <img
                        src={imgUrl}
                        alt={category}
                        onError={handleImageError}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Luxury Purple Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2A0033]/90 via-[#4A0E4E]/40 to-transparent transition-opacity duration-300 group-hover:opacity-90"></div>
                      
                      {/* Category Details Text */}
                      <div className="absolute bottom-4 left-4 right-4 text-gray-200 z-10">
                        <span className="text-[10px] text-[#E4C560] font-extrabold uppercase tracking-widest block mb-1">
                          {isActive ? '● Currently Active' : 'Sourced Organic'}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold font-serif leading-tight">
                          {label}
                        </h3>
                        <div className="h-0.5 w-8 bg-amber-400 mt-2 transition-all duration-300 group-hover:w-16"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Deluxe Daily Deals Banner */}
          <section className="py-4 px-4">
            <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden bg-gradient-to-r from-amber-50 via-purple-50/50 to-pink-50 border border-purple-900/40 p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
              <div className="space-y-4 max-w-xl text-left">
                <span className="bg-gray-800 text-[#E4C560] py-1 px-3.5 rounded-full text-xs font-bold uppercase tracking-wider">DELUXE DEALS OF THE WEEK</span>
                <h3 className="text-3xl font-extrabold text-[#E4C560] font-serif leading-tight">Fresh organic broccoli & veggies up to 50% discount!</h3>
                <p className="text-gray-400 text-sm">
                  Eat clean, stay healthy! Grab today's select high-grade vegetables, sourced from certified local farms. Offers end tonight!
                </p>
                <div className="flex items-center gap-6 pt-2">
                  <div className="text-center bg-[#1D0130] border border-purple-900/40 p-2 w-16 rounded-xl shadow-xs">
                    <span className="block font-bold text-white text-xl">12</span>
                    <span className="text-[10px] text-purple-300 font-bold uppercase">Hrs</span>
                  </div>
                  <div className="text-center bg-[#1D0130] border border-purple-900/40 p-2 w-16 rounded-xl shadow-xs">
                    <span className="block font-bold text-white text-xl">45</span>
                    <span className="text-[10px] text-purple-300 font-bold uppercase">Min</span>
                  </div>
                  <div className="text-center bg-[#1D0130] border border-purple-900/40 p-2 w-16 rounded-xl shadow-xs">
                    <span className="block font-bold text-white text-xl">30</span>
                    <span className="text-[10px] text-purple-300 font-bold uppercase">Sec</span>
                  </div>
                </div>
              </div>
              <div className="w-full max-w-[340px] bg-[#1D0130] border border-purple-900/40 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
                <div className="absolute top-3 left-3 bg-red-600 text-gray-200 font-bold text-[10px] uppercase py-0.5 px-2 rounded">
                  HOT SALE
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=300" 
                  alt="Broccoli Deal" 
                  onError={handleImageError}
                  className="w-full h-44 object-contain mx-auto transition-transform duration-500 group-hover:scale-105"
                />
                <div className="text-center mt-3">
                  <h4 className="font-bold text-white">Organic Fresh Broccoli</h4>
                  <div className="flex items-center justify-center gap-1 my-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-emerald-600" />)}
                  </div>
                  <p className="text-xs text-purple-300 mb-2">1.0 kg unit</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xl font-bold text-white">₹80.00</span>
                    <span className="text-xs line-through text-purple-300">₹160.00</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : currentView === 'category-page' ? (
        /* Render Beautiful Category Landing Page Header Banners! */
        (() => {
          // Custom category banner styles
          let bannerTitle = selectedCategory === 'All' ? "Premium Sourced Catalog" : \`\${selectedCategory} Delights\`;
          let bannerHighlight = selectedCategory === 'All' ? "Premium handpicked organic essentials" : \`Explore our fresh and premium \${selectedCategory.toLowerCase()}\`;
          let bannerGradient = "from-purple-950 via-[#1D0130] to-indigo-950";
          let bannerIcon = "🛍️";
          
          if (selectedCategory === 'Dairy') {
            bannerTitle = "Farm-Fresh Dairy & Creamy Delights";
            bannerHighlight = "Fresh dairy, farm butter, curd & premium cow milk";
            bannerGradient = "from-blue-950 via-[#1D0130] to-slate-900";
            bannerIcon = "🥛";
          } else if (selectedCategory === 'Vegetables') {
            bannerTitle = "Fresh Garden Sourced Vegetables";
            bannerHighlight = "Crispy green leaf vegetables, organic roots & daily greens";
            bannerGradient = "from-emerald-950 via-[#1D0130] to-teal-950";
            bannerIcon = "🥦";
          } else if (selectedCategory === 'Chocolates') {
            bannerTitle = "Rich Cocoa & Chocolates Delights";
            bannerHighlight = "Sweets, premium dark chocolates & organic treats";
            bannerGradient = "from-amber-950 via-[#1D0130] to-rose-950";
            bannerIcon = "🍫";
          } else if (selectedCategory === 'Masala Powder') {
            bannerTitle = "Indian Spices & Culinary Masalas";
            bannerHighlight = "Organic spices, premium ground masala & turmeric";
            bannerGradient = "from-orange-950 via-[#1D0130] to-amber-950";
            bannerIcon = "🌶️";
          }
`;

const startIndex = appContent.indexOf(startMarker);
const endIndex = appContent.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    appContent = appContent.substring(0, startIndex + startMarker.length) + "\n" + restoredCode + "\n" + appContent.substring(endIndex);
    
    // Also fix the pill text for point 1 of the request
    appContent = appContent.replace(
        /<span>\{bannerIcon\} Dedicated category page<\/span>/,
        '<span>{bannerIcon} Explore Sourced Categories</span>'
    );
    
    fs.writeFileSync(appPath, appContent, 'utf8');
    console.log('App.tsx restored and updated successfully!');
} else {
    console.log('Could not find markers to restore code.');
    console.log('Start marker found:', startIndex !== -1);
    console.log('End marker found:', endIndex !== -1);
}
