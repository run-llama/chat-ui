const fs = require('fs')
const path = require('path')

const registryPath = path.join(__dirname, '../public/r/chat.json')

try {
  // Read the built registry file
  const registryData = JSON.parse(fs.readFileSync(registryPath, 'utf8'))

  // Add the CSS source directive
  registryData.css = {
    "@source '../node_modules/@llamaindex/chat-ui/**/*.{ts,tsx}'": '',
  }

  // Write back the modified registry
  fs.writeFileSync(registryPath, JSON.stringify(registryData, null, 2))

  console.log('✅ CSS source directive added to registry')
} catch (error) {
  console.error('❌ Error modifying registry:', error.message)
  process.exit(1)
}
