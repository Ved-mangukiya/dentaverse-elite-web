const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

const files = [
    'about.html',
    'blog.html',
    'contact.html',
    'how-it-works.html',
    'pricing.html',
    'products.html'
];

try {
    let indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

    // 1. Extract Header & Footer HTML 
    const headerMatch = indexHtml.match(/<!-- ======================= HEADER ======================= -->\s*<header class="dv-header".*?<\/header>/s);
    const footerMatch = indexHtml.match(/<!-- ======================= FOOTER ======================= -->\s*<footer.*?<\/footer>/s);

    if (!headerMatch || !footerMatch) {
       console.log("Could not find header or footer");
       process.exit(1);
    }

    const masterHeader = headerMatch[0];
    const masterFooter = footerMatch[0];

    // 2. Extract footer CSS from index.html (Simple lines parsing)
    const lines = indexHtml.split('\n');
    let footerCssStart = -1;
    let styleEnd = -1;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('FOOTER') && lines[i-1] && lines[i-1].includes('====')) {
            footerCssStart = i - 1; // start of the comment block
        }
        if (footerCssStart !== -1 && lines[i].includes('</style>')) {
            styleEnd = i;
            break;
        }
    }

    if (footerCssStart !== -1 && styleEnd !== -1) {
        // We found the footer CSS chunk
        const footerCssChunk = lines.slice(footerCssStart, styleEnd).join('\n');
        
        // Remove it from index.html
        lines.splice(footerCssStart, styleEnd - footerCssStart);
        indexHtml = lines.join('\n');
        fs.writeFileSync(path.join(rootDir, 'index.html'), indexHtml);

        console.log("Extracted footer CSS from index.html");

        // Append to theme.css
        let themeCss = fs.readFileSync(path.join(rootDir, 'theme.css'), 'utf8');
        if (!themeCss.includes('.footer-bottom {')) {
            themeCss += '\n\n' + footerCssChunk;
            fs.writeFileSync(path.join(rootDir, 'theme.css'), themeCss);
            console.log("Injected footer CSS into theme.css");
        }
    }

    // 3. Sync all pages
    const pageMap = {
        'how-it-works.html': 'How It Works',
        'products.html': 'Products',
        'pricing.html': 'Pricing',
        'about.html': 'About',
        'blog.html': 'Blog'
    };

    files.forEach(file => {
        let content = fs.readFileSync(path.join(rootDir, file), 'utf8');

        // Replace Header
        // Finds ANY existing header implementation across the files and swaps it.
        const headerRegex = /<!-- ======================= (HEADER|header|Header) ======================= -->\s*<header.*?<\/header>/s;
        if (headerRegex.test(content)) {
            content = content.replace(headerRegex, masterHeader);
        } else {
             content = content.replace(/<header.*?<\/header>/s, masterHeader);
        }

        // Replace Footer
        const footerRegex = /<!-- ======================= (FOOTER|footer|Footer) ======================= -->\s*<footer.*?<\/footer>/s;
        if (footerRegex.test(content)) {
            content = content.replace(footerRegex, masterFooter);
        } else {
             content = content.replace(/<footer.*?<\/footer>/s, masterFooter);
        }

        // Handle active class
        const targetNavName = pageMap[file];
        
        // First drop all active classes inside dv-nav-links and dv-mobile-menu
        content = content.replace(/class="active"/g, '');
        content = content.replace(/class=" active"/g, '');
        content = content.replace(/class="active "/g, '');
        
        if (targetNavName) {
            // Find `<a href="file.html">Target</a>` and convert back to active
            // e.g., `<a href="about.html">About</a>` -> `<a href="about.html" class="active">About</a>`
            const linkRegex = new RegExp(`(<a href="${file}"(?:\\s+class="[^"]*")?>)(${targetNavName})<\/a>`, 'g');
            content = content.replace(linkRegex, `<a href="${file}" class="active">$2</a>`);
            
            // Fix double classes if any sneaked in
            content = content.replace(/class="class="active""/g, 'class="active"');
        }

        // Make sure contact CTA class is preserved in mobile menu
        content = content.replace(/<a href="contact.html"(.*?)>Book Experience<\/a>/g, (match, p1) => {
            if (!match.includes('dv-btn-book')) {
                return `<a href="contact.html" class="dv-mobile-cta">Book Experience</a>`;
            }
            return match; // preserve desktop book btn
        });

        fs.writeFileSync(path.join(rootDir, file), content);
        console.log(`Synced ${file}`);
    });

} catch (err) {
    console.error(err);
}
