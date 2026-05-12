/**
 * Dentaverse Locale Formatter
 * Automatically detects user's location and formats numbers accordingly
 */

(function() {
    'use strict';

    // Detect user's locale automatically
    function detectUserLocale() {
        // Try to get locale from browser
        const browserLocale = navigator.language || navigator.userLanguage;
        
        // Try to get timezone to help determine location
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Determine locale based on timezone and browser settings
        if (timezone) {
            // US timezones
            if (timezone.includes('America/') || timezone.includes('US/')) {
                return 'en-US';
            }
            // UK timezones
            if (timezone.includes('Europe/London') || timezone === 'GMT' || timezone === 'Europe/Belfast') {
                return 'en-GB';
            }
        }
        
        // Fallback to browser locale
        if (browserLocale) {
            if (browserLocale.startsWith('en-US')) return 'en-US';
            if (browserLocale.startsWith('en-GB')) return 'en-GB';
            if (browserLocale.startsWith('en')) return 'en-GB'; // Default English to UK
        }
        
        // Default to browser's locale or en-US
        return browserLocale || 'en-US';
    }

    // Get the detected locale
    const userLocale = detectUserLocale();

    // Store globally for use across the site
    window.DENTAVERSE_LOCALE = userLocale;

    // Create a global number formatter
    window.formatNumber = function(number, options) {
        options = options || {};
        return new Intl.NumberFormat(userLocale, options).format(number);
    };

    // Create a global currency formatter
    window.formatCurrency = function(amount, currency) {
        currency = currency || 'GBP';
        return new Intl.NumberFormat(userLocale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(amount);
    };

    // Create a global percentage formatter
    window.formatPercentage = function(value, decimals) {
        decimals = decimals || 0;
        return new Intl.NumberFormat(userLocale, {
            style: 'percent',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value / 100);
    };

    // Format large numbers with compact notation (e.g., 1.2M, 19.4M)
    window.formatCompact = function(number) {
        return new Intl.NumberFormat(userLocale, {
            notation: 'compact',
            compactDisplay: 'short'
        }).format(number);
    };

    // Auto-format all elements with data-format attribute on page load
    function autoFormatNumbers() {
        // Format numbers
        document.querySelectorAll('[data-format="number"]').forEach(function(el) {
            const value = parseFloat(el.textContent.replace(/[^0-9.-]/g, ''));
            if (!isNaN(value)) {
                el.textContent = formatNumber(value);
            }
        });

        // Format currency
        document.querySelectorAll('[data-format="currency"]').forEach(function(el) {
            const value = parseFloat(el.textContent.replace(/[^0-9.-]/g, ''));
            const currency = el.getAttribute('data-currency') || 'GBP';
            if (!isNaN(value)) {
                el.textContent = formatCurrency(value, currency);
            }
        });

        // Format percentages
        document.querySelectorAll('[data-format="percentage"]').forEach(function(el) {
            const value = parseFloat(el.textContent.replace(/[^0-9.-]/g, ''));
            if (!isNaN(value)) {
                el.textContent = formatPercentage(value);
            }
        });

        // Format compact numbers
        document.querySelectorAll('[data-format="compact"]').forEach(function(el) {
            const value = parseFloat(el.textContent.replace(/[^0-9.-]/g, ''));
            if (!isNaN(value)) {
                el.textContent = formatCompact(value);
            }
        });
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoFormatNumbers);
    } else {
        autoFormatNumbers();
    }

    // Log detected locale for debugging (can be removed in production)
    console.log('%c🌍 Locale Detected: ' + userLocale, 'color: #0066CC; font-weight: bold;');

})();
