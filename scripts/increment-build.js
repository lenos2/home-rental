const fs = require('fs');
const path = require('path');

const buildFilePath = path.join(__dirname, '../build-number.json');

try {
  const buildData = JSON.parse(fs.readFileSync(buildFilePath, 'utf8'));
  buildData.build += 1;
  
  fs.writeFileSync(buildFilePath, JSON.stringify(buildData, null, 2) + '\n');
  
  console.log(`\n✅ Build number incremented to: ${buildData.build}\n`);
  
  process.exit(0);
} catch (error) {
  console.error('Error incrementing build number:', error);
  process.exit(1);
}
