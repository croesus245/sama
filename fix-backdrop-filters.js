// Script to fix backdrop-filter ordering issues
// This script will update CSS files to ensure -webkit-backdrop-filter comes before backdrop-filter

const fs = require('fs');
const path = require('path');

const filesToFix = [
    'universal-bg-system.css',
    'perfect-vibe-theme.css', 
    'glass-morphism-global.css',
    'realtor-style.css',
    'inline-styles-cleanup.css',
    'production-enhancements.css'
];

function fixBackdropFilterOrder(content) {
    // Pattern to match backdrop-filter before -webkit-backdrop-filter
    const pattern = /(\s+)backdrop-filter:\s*([^;]+);(\s+)-webkit-backdrop-filter:\s*([^;]+);/g;
    
    return content.replace(pattern, (match, indent1, value1, indent2, value2) => {
        // Swap the order: -webkit- first, then standard
        return `${indent1}-webkit-backdrop-filter: ${value2};${indent2}backdrop-filter: ${value1};`;
    });
}

function addWebkitPrefix(content) {
    // Pattern to match standalone backdrop-filter without -webkit- prefix
    const lines = content.split('\n');
    const result = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(/(\s+)backdrop-filter:\s*([^;]+);/);
        
        if (match) {
            const [, indent, value] = match;
            // Check if the previous line has -webkit-backdrop-filter
            const prevLine = i > 0 ? lines[i - 1] : '';
            const hasWebkitBefore = prevLine.includes('-webkit-backdrop-filter');
            
            if (!hasWebkitBefore) {
                // Add -webkit- version before the standard one
                result.push(`${indent}-webkit-backdrop-filter: ${value};`);
                result.push(line);
            } else {
                result.push(line);
            }
        } else {
            result.push(line);
        }
    }
    
    return result.join('\n');
}

// Process each file
filesToFix.forEach(filename => {
    const filePath = path.join(__dirname, filename);
    
    if (fs.existsSync(filePath)) {
        console.log(`Processing ${filename}...`);
        
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Fix order issues first
        content = fixBackdropFilterOrder(content);
        
        // Add missing -webkit- prefixes
        content = addWebkitPrefix(content);
        
        fs.writeFileSync(filePath, content);
        console.log(`✓ Fixed ${filename}`);
    } else {
        console.log(`⚠ File not found: ${filename}`);
    }
});

console.log('Backdrop-filter fixes completed!');