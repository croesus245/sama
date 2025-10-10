function formatPhoneForWhatsApp(phone) {
    if (!phone) return null;
    
    // Remove all non-digits
    let cleaned = phone.replace(/\D/g, '');
    
    // Add country code if missing (Nigeria = 234)
    if (cleaned.startsWith('0')) {
        cleaned = '234' + cleaned.substring(1);
    } else if (!cleaned.startsWith('234')) {
        cleaned = '234' + cleaned;
    }
    
    return cleaned;
}

function openWhatsApp(phone, message) {
    const formattedPhone = formatPhoneForWhatsApp(phone);
    
    if (!formattedPhone) {
        alert('Invalid phone number');
        return;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    
    // Test if link works
    console.log('WhatsApp URL:', url);
    
    window.open(url, '_blank');
}

// Example usage
// openWhatsApp('08012345678', 'Hi, I saw your hostel on MWG Hostels');