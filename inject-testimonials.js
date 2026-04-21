const fs = require('fs');
const indexHtml = fs.readFileSync('index.html', 'utf8');

// Extract testimonials
const startMarker = '<!-- ======================= TESTIMONIALS ======================= -->';
const endMarker = '<!-- ======================= FAQ ======================= -->';
const startIndex = indexHtml.indexOf(startMarker);
const endIndex = indexHtml.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error('Could not find testimonials markers');
    process.exit(1);
}

const testimonialsBlock = indexHtml.substring(startIndex, endIndex);

// Function to inject block
function injectBlock(filename) {
    let content = fs.readFileSync(filename, 'utf8');
    const footerMarker = '<!-- ======================= FOOTER ======================= -->';
    
    if (content.includes(startMarker)) {
        console.log(filename + ' already has testimonials section.');
        return;
    }
    
    if (!content.includes(footerMarker)) {
        console.error('Could not find footer in ' + filename);
        return;
    }
    
    content = content.replace(footerMarker, testimonialsBlock + '\n\n    ' + footerMarker);
    fs.writeFileSync(filename, content);
    console.log('Successfully injected testimonials into ' + filename);
}

injectBlock('how-it-works.html');
injectBlock('products.html');
