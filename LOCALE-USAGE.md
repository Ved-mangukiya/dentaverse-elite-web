# 🌍 Automatic Locale Number Formatting

## Overview
The Dentaverse website now automatically detects the user's location and formats all numbers according to their regional preferences.

## How It Works

### Automatic Detection
The system automatically detects the user's locale based on:
1. **Browser timezone** (most accurate)
2. **Browser language settings**
3. **Fallback to browser locale**

### Supported Locales
- **🇺🇸 US (en-US)**: 1,234,567.89
- **🇬🇧 UK (en-GB)**: 1,234,567.89
- **🇪🇺 Europe**: Varies by country (e.g., 1.234.567,89 for Germany)
- **Others**: Uses browser's default locale

## Usage Methods

### Method 1: Automatic HTML Formatting
Add `data-format` attribute to any element:

```html
<!-- Format as number -->
<span data-format="number">1234567</span>
<!-- Output: 1,234,567 (US) or 1,234,567 (UK) -->

<!-- Format as currency -->
<span data-format="currency" data-currency="GBP">49</span>
<!-- Output: £49 (UK) or £49 (US) -->

<!-- Format as percentage -->
<span data-format="percentage">60</span>
<!-- Output: 60% -->

<!-- Format as compact -->
<span data-format="compact">19400000</span>
<!-- Output: 19M (US) or 19M (UK) -->
```

### Method 2: JavaScript Functions
Use the global formatting functions:

```javascript
// Format a number
window.formatNumber(1234567);
// US: "1,234,567"
// UK: "1,234,567"

// Format currency
window.formatCurrency(49, 'GBP');
// US: "£49"
// UK: "£49"

// Format percentage
window.formatPercentage(60);
// Output: "60%"

// Format compact
window.formatCompact(19400000);
// Output: "19M"
```

### Method 3: Get User's Locale
Access the detected locale:

```javascript
console.log(window.DENTAVERSE_LOCALE);
// Output: "en-US" or "en-GB" or other locale
```

## Examples in Use

### Live Counter (products.html)
```javascript
var current = 19400000;
function fmt(n) { 
    return window.formatNumber ? window.formatNumber(n) : n.toLocaleString(); 
}
el.textContent = fmt(current);
```

### Pricing Display
```html
<div class="price">
    <span data-format="currency" data-currency="GBP">49</span>
    <span>/month</span>
</div>
```

### Statistics
```html
<div class="stat">
    <span data-format="percentage">60</span>
    <span>Anxiety Reduction</span>
</div>
```

## Regional Differences

### Number Formatting
| Locale | Format | Example |
|--------|--------|---------|
| en-US | 1,234,567.89 | 19,400,000 |
| en-GB | 1,234,567.89 | 19,400,000 |
| de-DE | 1.234.567,89 | 19.400.000 |
| fr-FR | 1 234 567,89 | 19 400 000 |

### Currency Formatting
| Locale | Format | Example |
|--------|--------|---------|
| en-US | $1,234.56 | £49 |
| en-GB | £1,234.56 | £49 |
| de-DE | 1.234,56 € | 49 £ |

## Browser Console
When the page loads, you'll see:
```
🌍 Locale Detected: en-US
```
or
```
🌍 Locale Detected: en-GB
```

## Benefits

✅ **Automatic** - No user input required
✅ **Accurate** - Uses timezone + browser settings
✅ **Global** - Works for all locales
✅ **Consistent** - Same formatting across entire site
✅ **Easy to use** - Simple HTML attributes or JS functions
✅ **Fallback safe** - Defaults to browser locale if detection fails

## Technical Details

### Files
- **`js/locale-formatter.js`** - Main locale detection and formatting script
- Loaded on all pages before other scripts

### Detection Priority
1. Timezone-based detection (most accurate)
2. Browser language (navigator.language)
3. Browser default locale

### Timezone Detection
- US: `America/*`, `US/*` timezones → `en-US`
- UK: `Europe/London`, `GMT`, `Europe/Belfast` → `en-GB`
- Others: Uses browser locale

## Testing

To test different locales:
1. Change your computer's timezone
2. Change browser language settings
3. Reload the page
4. Check console for detected locale

---

**Last Updated**: May 12, 2026
**Status**: ✅ Active on all pages
