export const countryCodes = [
    { 
        value: "+45", 
        label: "🇩🇰 +45", 
        country: "DK",
        maxLength: 8,
        format: (phone: string) => {
            // Format: 12 34 56 78
            const cleaned = phone.replace(/\D/g, '');
            const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})$/);
            if (match) {
                return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
            }
            return cleaned;
        }
    },
    { 
        value: "+1", 
        label: "🇺🇸 +1", 
        country: "US",
        maxLength: 10,
        format: (phone: string) => {
            // Format: (555) 123-4567
            const cleaned = phone.replace(/\D/g, '');
            const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
            if (match) {
                return `(${match[1]}) ${match[2]}-${match[3]}`;
            }
            return cleaned;
        }
    },
    { 
        value: "+44", 
        label: "🇬🇧 +44", 
        country: "GB",
        maxLength: 10,
        format: (phone: string) => {
            // Format: 20 7123 4567
            const cleaned = phone.replace(/\D/g, '').replace(/^0+/, ''); // Remove leading zeros
            const match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
            if (match) {
                return `${match[1]} ${match[2]} ${match[3]}`;
            }
            return cleaned;
        }
    },
    { 
        value: "+91", 
        label: "🇮🇳 +91", 
        country: "IN",
        maxLength: 10,
        format: (phone: string) => {
            // Format: 98765 43210
            const cleaned = phone.replace(/\D/g, '').replace(/^0+/, '');
            const match = cleaned.match(/^(\d{5})(\d{5})$/);
            if (match) {
                return `${match[1]} ${match[2]}`;
            }
            return cleaned;
        }
    },
    { 
        value: "+61", 
        label: "🇦🇺 +61", 
        country: "AU",
        maxLength: 9,
        format: (phone: string) => {
            // Format: 412 345 678
            const cleaned = phone.replace(/\D/g, '').replace(/^0+/, '');
            const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})$/);
            if (match) {
                return `${match[1]} ${match[2]} ${match[3]}`;
            }
            return cleaned;
        }
    },
    { 
        value: "+81", 
        label: "🇯🇵 +81", 
        country: "JP",
        maxLength: 10,
        format: (phone: string) => {
            // Format: 90-1234-5678
            const cleaned = phone.replace(/\D/g, '').replace(/^0+/, '');
            const match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
            if (match) {
                return `${match[1]}-${match[2]}-${match[3]}`;
            }
            return cleaned;
        }
    },
    { 
        value: "+49", 
        label: "🇩🇪 +49", 
        country: "DE",
        maxLength: 11,
        format: (phone: string) => {
            // Format: 030 12345678
            const cleaned = phone.replace(/\D/g, '').replace(/^0+/, '');
            const match = cleaned.match(/^(\d{3})(\d{8})$/);
            if (match) {
                return `${match[1]} ${match[2]}`;
            }
            return cleaned;
        }
    },
];

// Get max length for phone number based on country
export const getMaxLength = (countryCode: string): number => {
    const country = countryCodes.find(c => c.value === countryCode);
    return country ? country.maxLength + 5 : 15; // Add buffer for formatting characters
};

// Format for display in input field - handles leading zeros automatically
export const formatForDisplay = (phoneNumber: string, countryCode: string): string => {
    const country = countryCodes.find(c => c.value === countryCode);
    
    if (!country) {
        return phoneNumber;
    }

    // Remove all non-digits
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Apply country-specific formatting
    return country.format(cleaned);
};

// Format for database - removes leading zeros and returns international format
export const formatToInternational = (countryCode: string, phoneNumber: string): string => {
    // Remove all non-digits and leading zeros
    const digits = phoneNumber.replace(/\D/g, '').replace(/^0+/, '');
    return `${countryCode}${digits}`;
};

// Validate phone number for any country
export const validatePhoneNumber = (phoneNumber: string, countryCode: string): boolean => {
    const country = countryCodes.find(c => c.value === countryCode);
    
    if (!country) {
        return false;
    }

    // Remove all non-digits and leading zeros
    const cleaned = phoneNumber.replace(/\D/g, '').replace(/^0+/, '');
    
    // Check if length matches expected length
    return cleaned.length === country.maxLength;
};