const fs = require('fs');

const appTsxPath = 'E:\\Shop Sales Uma\\src\\app\\App.tsx';
let appContent = fs.readFileSync(appTsxPath, 'utf8');

// ==========================================
// 1. Cart Drawer Redesign (Light Premium UI)
// ==========================================
// Main Drawer bg: <div className="w-96 h-full flex flex-col bg-[#FAF7FB]"> is already light.
// But the empty state and the items are dark.

// Empty state
appContent = appContent.replace(
  '<Typography variant="caption" color="text.secondary">Add high-quality organic fresh food items to start shopping!</Typography>',
  '<Typography variant="caption" sx={{ color: \'#6B7280\' }}>Add high-quality organic fresh food items to start shopping!</Typography>'
);

// Cart Item Container
appContent = appContent.replace(
  /className="flex gap-4 pb-4 border-b border-\[\#2A0033\] bg-\[\#1D0130\] p-3 rounded-xl shadow-xs relative"/g,
  'className="flex gap-4 pb-4 border-b border-purple-100 bg-white p-3 rounded-xl shadow-sm relative"'
);

// Cart Item Image Background
appContent = appContent.replace(
  /className="w-16 h-16 object-contain bg-\[\#130120\] p-1 rounded-lg"/g,
  'className="w-16 h-16 object-cover rounded-lg"'
);

// Cart Item Subtitle text color
appContent = appContent.replace(
  /<Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '\#2A0033' }}>/g,
  '<Typography variant="subtitle2" sx={{ fontWeight: \'bold\', color: \'#1D0130\' }}>'
);


// ==========================================
// 2. Product Card Linespace
// ==========================================
appContent = appContent.replace(
  '<div className="flex items-center justify-between mt-1 pt-2 font-sans">',
  '<div className="flex items-center justify-between mt-1 font-sans">'
);
appContent = appContent.replace(
  '<CardContent sx={{ p: 3, textAlign: \'left\' }}>',
  '<CardContent sx={{ px: 3, pt: 2, pb: 2, textAlign: \'left\' }}>'
);


// ==========================================
// 3. Product Card "Add button near in quantity add and minus"
// ==========================================
// Perhaps they want the quantity controller to look more like the Add button (a pill with a solid color)
// Or they want the Add button to have +/- right next to it even if it's 0 (like `[ - ] Add [ + ]`)?
// Let's redesign the quantity controller to perfectly match the size and color of the Add button!
const oldQuantityHTML = `<div className="flex items-center gap-2 bg-[#F6EFF7] rounded-full px-2.5 py-1.5 border border-purple-900/40">
                                <IconButton 
                                  size="small" 
                                  onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                                  sx={{ p: 0.5, color: '#4A0E4E', '&:hover': { backgroundColor: 'white' } }}
                                >
                                  <Minus size={12} />
                                </IconButton>
                                <span className="text-xs font-bold text-[#4A0E4E] w-5 text-center">{cartItem.quantity}</span>
                                <IconButton 
                                  size="small" 
                                  onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                                  sx={{ p: 0.5, color: '#4A0E4E', '&:hover': { backgroundColor: 'white' } }}
                                >
                                  <Plus size={12} />
                                </IconButton>
                              </div>`;

const newQuantityHTML = `<div className="flex items-center justify-between bg-[#4A0E4E] text-white rounded-full px-1 py-0.5" style={{ minWidth: '90px' }}>
                                <IconButton 
                                  size="small" 
                                  onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                                  sx={{ color: 'white', p: 0.5, '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}
                                >
                                  <Minus size={14} />
                                </IconButton>
                                <span className="text-sm font-bold w-4 text-center">{cartItem.quantity}</span>
                                <IconButton 
                                  size="small" 
                                  onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                                  sx={{ color: 'white', p: 0.5, '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}
                                >
                                  <Plus size={14} />
                                </IconButton>
                              </div>`;

appContent = appContent.replace(oldQuantityHTML, newQuantityHTML);

// Same for the other places it might be rendered!
fs.writeFileSync(appTsxPath, appContent, 'utf8');
console.log("Cart UI updates applied successfully!");
