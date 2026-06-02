const fs = require('fs');

const filePath = 'E:\\Shop Sales Uma\\src\\app\\App.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Change header container to flex-col
content = content.replace(
  '<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">',
  '<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">'
);

// 2. Extract Menu Buttons Block
const startMarker = '{/* Premium Home Menu Link */}';
const endMarker = '{/* Premium Styled Search Bar with semi-transparent matching backplate */}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("Markers not found!");
  process.exit(1);
}

// Extract the block (including start marker, excluding end marker)
const menuBlock = content.substring(startIndex, endIndex);

// Remove the block from its original position
content = content.substring(0, startIndex) + content.substring(endIndex);

// 3. Find the end of the top row (after Quick Actions)
// Look for the end of the flex-shrink-0 div that contains quick actions
// It ends around here:
//               </Badge>
//             </IconButton>
//           </div>
//         </div>
//       </div>
//     </header>

const insertMarker = '          </div>\r\n        </div>\r\n      </header>';
// Need to match ignoring \r or \n
const regex = /          <\/div>\s*<\/div>\s*<\/header>/;

const match = content.match(regex);
if (!match) {
  console.error("Insert marker not found!");
  process.exit(1);
}

// Create the bottom row div
const bottomRowDiv = `
          {/* BOTTOM ROW: Navigation Links */}
          <div className="flex items-center justify-start gap-4 pb-3 overflow-x-auto no-scrollbar">
            ${menuBlock.trim()}
          </div>
`;

// Insert the bottom row before the closing of the flex-col wrapper
content = content.substring(0, match.index) + bottomRowDiv + content.substring(match.index);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully restructured the navbar!");
