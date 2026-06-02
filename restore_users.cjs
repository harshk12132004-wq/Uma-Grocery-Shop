const fs = require('fs');

// 1. Update AdminPanel.tsx to restore Users Tab
const adminPath = 'E:\\Shop Sales Uma\\src\\app\\components\\AdminPanel.tsx';
let adminContent = fs.readFileSync(adminPath, 'utf8');

// Insert tab definition
adminContent = adminContent.replace(
  "{ key: 'categories', label: 'Categories', icon: <FolderTree size={20} /> },",
  "{ key: 'categories', label: 'Categories', icon: <FolderTree size={20} /> },\n    { key: 'users', label: 'Users', icon: <Users size={20} /> },"
);

// Insert Users tab JSX right before the Feedback tab
const usersJSX = `        {/* ===== USERS TAB ===== */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fade-in max-w-7xl mx-auto p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
              <h2 className="text-2xl font-serif font-bold text-[#1D0130]">User Management</h2>
              <div className="w-full sm:w-72">
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  InputProps={{ startAdornment: <Search className="mr-2 text-gray-400" size={18} /> }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: 'white',
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E4C560' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1D0130' },
                    }
                  }}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                      <th className="p-4">User</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4 hidden sm:table-cell">Address</th>
                      <th className="p-4 text-center">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-purple-50/30 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-[#1D0130]">{user.first_name || user.username || 'N/A'}</p>
                          <p className="text-xs text-gray-500">ID: {user.id}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm font-medium text-gray-800">{user.email || 'No email'}</p>
                          <p className="text-xs text-gray-500">{user.phone || 'No phone'}</p>
                        </td>
                        <td className="p-4 hidden sm:table-cell max-w-xs">
                          <p className="text-xs text-gray-600 truncate">{user.address || 'No address provided'}</p>
                          {user.pincode && <p className="text-[10px] text-gray-400 mt-0.5">PIN: {user.pincode}</p>}
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded-md">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-400 font-semibold">No users found</p>
                </div>
              )}
            </div>
          </div>
        )}

`;

adminContent = adminContent.replace(
  "{/* ===== FEEDBACK TAB ===== */}",
  usersJSX + "        {/* ===== FEEDBACK TAB ===== */}"
);

fs.writeFileSync(adminPath, adminContent, 'utf8');

// 2. Update App.tsx to add Logout button to Profile Settings Dialog
const appPath = 'E:\\Shop Sales Uma\\src\\app\\App.tsx';
let appContent = fs.readFileSync(appPath, 'utf8');

const profileDialogActionsOld = `<DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setIsProfileOpen(false)} sx={{ color: 'gray', fontWeight: 'bold' }}>Cancel</Button>
          <Button 
            onClick={handleSaveProfile} 
            disabled={loading}
            variant="contained" 
            sx={{ backgroundColor: '#1D0130', borderRadius: '12px', px: 4, fontWeight: 'bold', '&:hover': { backgroundColor: '#4A0E4E' } }}
          >
            {loading ? 'Saving...' : 'Save Profile Settings'}
          </Button>
        </DialogActions>`;

const profileDialogActionsNew = `<DialogActions sx={{ p: 3, pt: 0, justifyContent: 'space-between' }}>
          <Button 
            onClick={() => { setIsProfileOpen(false); handleLogout(); }} 
            sx={{ color: '#DC2626', fontWeight: 'bold', textTransform: 'none' }}
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
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </DialogActions>`;

appContent = appContent.replace(profileDialogActionsOld, profileDialogActionsNew);

fs.writeFileSync(appPath, appContent, 'utf8');

console.log("Restored Users Tab and added Profile Logout!");
