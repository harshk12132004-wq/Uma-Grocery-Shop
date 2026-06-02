const fs = require('fs');

const appTsxPath = 'E:\\Shop Sales Uma\\src\\app\\App.tsx';
let appContent = fs.readFileSync(appTsxPath, 'utf8');

const emptyStateStart = appContent.indexOf('              <div className="text-center py-16 space-y-4">');
const emptyStateEndStr = '          {cart.length > 0 && (';
const emptyStateEnd = appContent.indexOf(emptyStateEndStr);

if (emptyStateStart !== -1 && emptyStateEnd !== -1) {
  const badSection = appContent.substring(emptyStateStart, emptyStateEnd);
  
  const correctSection = `              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-[#1D0130] text-white rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <ShoppingCart size={28} />
                </div>
                <div>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'purple.950' }}>Your bag is empty</Typography>
                  <Typography variant="caption" sx={{ color: '#6B7280' }}>Add high-quality organic fresh food items to start shopping!</Typography>
                </div>
                <Button 
                  onClick={() => setIsCartOpen(false)}
                  variant="contained" 
                  sx={{ backgroundColor: '#4A0E4E', color: 'white', px: 4, borderRadius: '9999px', mt: 2 }}
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-purple-100 bg-white p-3 rounded-xl shadow-sm relative">
                    <img
                      src={item.product_details.image_url}
                      alt={item.product_details.name}
                      onError={handleImageError}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 text-left">
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1D0130' }}>
                        {item.product_details.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#8E2DE2', fontWeight: 'bold' }}>
                        ₹{item.product_details.price} {item.product_details.unit}
                      </Typography>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center justify-between bg-[#4A0E4E] text-white rounded-full px-1 py-0.5" style={{ minWidth: '90px' }}>
                          <IconButton 
                            size="small" 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            sx={{ color: 'white', p: 0.5, '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}
                          >
                            <Minus size={14} />
                          </IconButton>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <IconButton 
                            size="small" 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            sx={{ color: 'white', p: 0.5, '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}
                          >
                            <Plus size={14} />
                          </IconButton>
                        </div>
                        <IconButton
                          size="small"
                          onClick={() => removeFromCart(item.id)}
                          color="error"
                          className="ml-auto"
                          sx={{ p: 0.5, border: '1px solid #FFEDEE' }}
                        >
                          <X size={12} />
                        </IconButton>
                      </div>
                    </div>
                    <div className="text-right">
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#4A0E4E' }}>
                        ₹{parseFloat(item.total_price.toString()).toFixed(2)}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

`;

  appContent = appContent.replace(badSection, correctSection);
  
  // Also fix the bottom part of the cart drawer to be light mode UI
  appContent = appContent.replace(
    '<div className="p-5 border-t border-purple-900/40 bg-[#1D0130] rounded-t-3xl shadow-2xl">',
    '<div className="p-5 border-t border-purple-100 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">'
  );
  
  fs.writeFileSync(appTsxPath, appContent, 'utf8');
  console.log("Restored Cart Drawer!");
} else {
  console.log("Could not find boundaries.");
}
