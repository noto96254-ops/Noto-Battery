const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'client', 'src', 'pages', 'AdminDashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Use regex to be more flexible with whitespace and line endings
const searchPattern = /}\)\s+<\/tbody>\s+<\/table>\s+<\/div>\s+<\/div>\s+\)}\s+<\/div>\s+<\/main>/;
const replacement = `})\n                       </tbody>\n                    </table>\n                 </div>\n              </div>\n           )}\n\n           {activeTab === 'Reports' && <ReportManager />}\n        </div>\n      </main>`;

if (searchPattern.test(content)) {
    content = content.replace(searchPattern, replacement);
    fs.writeFileSync(filePath, content);
    console.log('Successfully updated AdminDashboard.jsx');
} else {
    console.log('Pattern not found. Checking alternate pattern...');
    // Try a simpler marker
    const marker = "activeTab === 'Users' && (";
    if (content.includes(marker)) {
        console.log('Found Users tab marker. Attempting insertion after its block.');
        // This is harder with regex, let's just use a simpler marker if possible
    }
}
