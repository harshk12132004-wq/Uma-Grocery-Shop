const fs = require('fs');
const appPath = 'E:\\Shop Sales Uma\\src\\app\\App.tsx';

let appContent = fs.readFileSync(appPath, 'utf8');

const missingBlock = `          onChange={(e) => {
            const val = e.target.value;
            setSearchQuery(val);
            if (val) {
              const match = products.find(p => p.name.toLowerCase().includes(val.toLowerCase()) || p.description?.toLowerCase().includes(val.toLowerCase()));
              if (match) {
                const matchedCat = match.category_name;
                const slug = categoryToSlug[matchedCat] || matchedCat.toLowerCase().replace(/\\s+/g, '-');
                setSelectedCategory(matchedCat);
                setCurrentView('category-page');
                window.history.pushState({}, '', \`/category/\${slug}?search=\${encodeURIComponent(val.toLowerCase())}\`);
              } else {
                setSelectedCategory('All');
                setCurrentView('home');
                window.history.pushState({}, '', \`/?search=\${encodeURIComponent(val.toLowerCase())}\`);
              }
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
              '&:hover fieldset': { borderColor: '#E4C560' },
            },
            '& .MuiInputBase-input::placeholder': {
              color: 'rgba(255, 255, 255, 0.6)',
              opacity: 1
            }
          }}
          InputProps={{
            startAdornment: <Search className="mr-2 text-emerald-600" size={18} />,
          }}
        />
      </div>

      {currentView === 'home' ? (
        <>
          {/* Balanced Modave Style Hero Carousel */}
          <section className="relative overflow-hidden bg-[#2A0033]">
            <div className="relative h-[420px] sm:h-[480px] w-full transition-all duration-700 ease-in-out">
              {slides.map((slide, idx) => (
                <div
                  key={idx}
                  className={\`absolute inset-0 w-full h-full flex flex-col md:flex-row items-center justify-between p-8 sm:p-14 transition-opacity duration-1000 bg-gradient-to-br \${slide.bgGradient} \${
                    idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }\`}
                >
                  {/* Slide Text Content */}
                  <div className="flex-1 text-gray-200 max-w-xl space-y-4 text-left">
                    <div className="inline-flex items-center gap-2 bg-gray-800/50 border border-[#2A0033]0/30 text-[#E4C560] py-1 px-3.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                      <Percent size={14} />
                      <span>{slide.badge}</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-emerald-600 text-xs sm:text-sm font-bold tracking-widest uppercase">{slide.subtitle}</p>
                      <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-200 leading-tight font-serif">
                        {slide.title}
                      </h2>
                      <h3 className="text-lg sm:text-xl text-gray-400 font-medium">
                        {slide.highlight}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm max-w-lg leading-relaxed">
                      {slide.description}
                    </p>
                    <div className="pt-2 flex items-center gap-4">
                      <button
                        onClick={() => {
                          const element = document.getElementById('shop-section');
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-gradient-to-r from-[#E4C560] to-[#C9A637] hover:from-white hover:to-white hover:text-white text-white font-bold text-xs py-2.5 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 tracking-wider uppercase"
                      >
                        {slide.cta}
                      </button>
                      <div className="hidden sm:flex items-center gap-2 text-[10px] text-gray-400">
                        <ShieldCheck size={16} className="text-emerald-600" />
                        <span>Secure Checkout</span>
                      </div>
                    </div>
                  </div>

                  {/* Slide Image Mockup */}
                  <div className="flex-1 w-full max-w-[260px] sm:max-w-[380px] h-[160px] sm:h-[280px] relative overflow-hidden rounded-2xl shadow-2xl border border-purple-900/40 mt-4 md:mt-0 transition-transform duration-700 hover:scale-105">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      onError={handleImageError}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-950/40 to-transparent"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Slider Arrows */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-25 bg-[#1D0130]/10 hover:bg-[#1D0130] text-gray-200 hover:text-white p-2.5 rounded-full transition-all duration-300 border border-white/20 hidden sm:block shadow-md"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-25 bg-[#1D0130]/10 hover:bg-[#1D0130] text-gray-200 hover:text-white p-2.5 rounded-full transition-all duration-300 border border-white/20 hidden sm:block shadow-md"
            >
              <ArrowRight size={18} />
            </button>

            {/* Slide Indicators Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-25 flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={\`h-2 rounded-full transition-all duration-500 \${
                    index === currentSlide ? 'w-6 bg-emerald-600' : 'w-2 bg-[#1D0130]/40'
                  }\`}
                ></button>
              ))}
            </div>
          </section>

          {/* Trust Values Section */}
          <section className="bg-[#1D0130] border-b border-[#2A0033] py-6 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#1D0130]/50 transition-colors duration-300">
                  <div className="bg-[#F6EFF7] text-[#4A0E4E] p-2.5 rounded-xl">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs tracking-wide uppercase">Free Shipping</h4>
                    <p className="text-[10px] text-purple-300">On all orders above ₹500</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#1D0130]/50 transition-colors duration-300">
                  <div className="bg-[#F6EFF7] text-[#4A0E4E] p-2.5 rounded-xl">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs tracking-wide uppercase">100% Quality</h4>
                    <p className="text-[10px] text-purple-300">Pure freshness guarantee</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#1D0130]/50 transition-colors duration-300">
                  <div className="bg-[#F6EFF7] text-[#4A0E4E] p-2.5 rounded-xl">
                    <Award size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs tracking-wide uppercase">Best Pricing</h4>
                    <p className="text-[10px] text-purple-300">Direct farm rates</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#1D0130]/50 transition-colors duration-300">
                  <div className="bg-[#F6EFF7] text-[#4A0E4E] p-2.5 rounded-xl">
                    <RefreshCw size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs tracking-wide uppercase">Easy Returns</h4>
                    <p className="text-[10px] text-purple-300">Exchanges made simple</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

`;

appContent = appContent.replace(
    '          value={searchQuery}\n          {/* Deluxe Collage of Categories (User Request 2) */}',
    '          value={searchQuery}\n' + missingBlock + '          {/* Deluxe Collage of Categories (User Request 2) */}'
);

fs.writeFileSync(appPath, appContent, 'utf8');
console.log('Successfully restored missing code block.');
