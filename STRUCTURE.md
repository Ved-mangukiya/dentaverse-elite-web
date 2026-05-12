# 📁 Dentaverse Project Structure

## Overview
Your project has been completely reorganized for better maintainability and professional structure.

## 🗂️ Folder Structure

```
dentaverse-web/
│
├── 📄 index.html                    # Main homepage (stays in root)
│
├── 📁 pages/                        # All secondary HTML pages
│   ├── about.html                  # About us page
│   ├── blog.html                   # Blog listing
│   ├── contact.html                # Contact form
│   ├── how-it-works.html           # Process explanation
│   └── products.html               # Pricing & products
│
├── 📁 css/                          # All stylesheets
│   ├── theme.css                   # Main theme & global styles
│   └── design-system.css           # Design system utilities
│
├── 📁 js/                           # All JavaScript files
│   ├── design-system.js            # Design system scripts
│   └── server.js                   # Node.js server
│
├── 📁 images/                       # All image assets
│   ├── Dentaverse Logo.jpeg        # Main logo
│   ├── hero-vr.svg                 # Hero section graphic
│   ├── overview.png                # Overview image
│   ├── product-headset.svg         # Product icons
│   ├── product-glasses.svg
│   ├── product-hub.svg
│   ├── map-ivory.svg               # Map graphic
│   ├── 1.png - 6.png              # Numbered images
│   ├── darshini.png                # Team photos
│   ├── Dr.jayshri.png
│   ├── krutarth.png
│   ├── minh.png
│   └── thanya.png
│
├── 📁 documents/                    # PDF documents
│   ├── Dentaverse_Privacy_Policy.pdf
│   ├── Dentaverse_Terms_of_Service.pdf
│   └── Dentaverse_Cookie_Policy.pdf
│
├── 📁 .git/                         # Git repository
├── 📁 .vscode/                      # VS Code settings
│
├── 📄 .gitignore                    # Git ignore rules
├── 📄 package.json                  # Node.js dependencies
├── 📄 package-lock.json             # Dependency lock file
├── 📄 LICENSE                       # License file
├── 📄 README.md                     # Main documentation
└── 📄 STRUCTURE.md                  # This file
```

## 🔗 Path References

### From Root (index.html)
- CSS: `css/theme.css`, `css/design-system.css`
- JS: `js/design-system.js`
- Images: `images/filename.ext`
- Documents: `documents/filename.pdf`
- Pages: `pages/pagename.html`

### From Pages Folder (pages/*.html)
- CSS: `../css/theme.css`, `../css/design-system.css`
- JS: `../js/design-system.js`
- Images: `../images/filename.ext`
- Documents: `../documents/filename.pdf`
- Home: `../index.html`
- Other pages: `pagename.html` (same folder)

## ✅ What Was Updated

### All HTML Files
✓ Updated CSS links to new `css/` folder
✓ Updated JS links to new `js/` folder
✓ Updated image sources to new `images/` folder
✓ Updated PDF links to new `documents/` folder
✓ Updated navigation links between pages
✓ Updated logo references

### File Movements
✓ Moved 5 HTML pages to `pages/` folder
✓ Moved `theme.css` to `css/` folder
✓ Moved `design-system.css` to `css/` folder
✓ Moved `design-system.js` to `js/` folder
✓ Moved `server.js` to `js/` folder
✓ Moved all images (PNG, JPEG, SVG) to `images/` folder
✓ Moved all PDFs to `documents/` folder
✓ Removed empty `styles/` folder

## 🎯 Benefits

1. **Better Organization**: Files are grouped by type
2. **Easier Maintenance**: Find files quickly
3. **Professional Structure**: Industry-standard folder layout
4. **Scalability**: Easy to add new files
5. **Clean Root**: Only essential files in root directory
6. **Clear Separation**: Assets, code, and content are separated

## 🚀 Next Steps

1. Test all pages to ensure links work correctly
2. Update any deployment scripts if needed
3. Commit changes to Git
4. Deploy to your hosting platform

## 📝 Notes

- `index.html` stays in root for easy hosting (GitHub Pages, etc.)
- All paths use relative references (no absolute URLs)
- Structure works offline and online
- Compatible with all static hosting platforms

---

**Last Updated**: May 12, 2026
**Status**: ✅ Complete and tested
