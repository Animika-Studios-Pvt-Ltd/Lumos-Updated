document.addEventListener('DOMContentLoaded', function() {

// ========== HELPER FUNCTIONS ==========

// Extract clean amount from button text (returns whole rupees, not paise)
function extractAmountFromButton(buttonSelector) {
    const button = document.querySelector(buttonSelector);
    if (!button) {
        console.error('❌ Button not found:', buttonSelector);
        return null;
    }
    
    const buttonText = button.textContent || button.innerText;
    console.log('📝 Button text:', buttonText);
    
    // Remove "Pay" text and all non-digit characters
    // Example: "Pay ₹1,29,600 (10% OFF)" -> "129600"
    const cleanText = buttonText.replace(/Pay|₹|,|\(.*?\)/g, '').trim();
    const amount = parseInt(cleanText);
    
    if (isNaN(amount) || amount <= 0) {
        console.error('❌ Invalid amount extracted:', amount);
        return null;
    }
    
    return amount; // Returns whole rupees
}

// Process payment with Razorpay
async function processPayment(formElement, roomType, amount, extraData = {}) {
    // Validate amount
    if (!amount || amount <= 0) {
        alert('Invalid payment amount. Please check the price and try again.');
        console.error('❌ Invalid amount:', amount);
        window.location.reload();
        return;
    }
    
    if (amount > 200000) {
        alert('Amount exceeds maximum limit of ₹2,00,000. Please contact support.');
        window.location.reload();
        return;
    }
    
    const formData = { roomType, amount, ...extraData };
    
    // Collect all form inputs
    const inputs = formElement.querySelectorAll('input, select, textarea');
    inputs.forEach(el => {
        if (el.id && el.value) {
            formData[el.id] = el.value;
        }
        if (el.name && el.value && el.type !== 'radio') {
            formData[el.name] = el.value;
        }
        if (el.type === 'radio' && el.checked) {
            formData[el.name] = el.value;
        }
    });

    // Map all possible field variations to standard fields
    formData.fullName = formData.fullName ||
        formData.supremeFullName || formData.luxuryFullName ||
        formData.luxuryTwinFullName || formData.luxuryTripleFullName ||
        formData.standardFullName || formData.standardTwinFullName ||
        formData.podFullName || formData.youthLearningCenterFullName || '';

    formData.email = formData.email ||
        formData.supremeEmail || formData.luxuryEmail ||
        formData.luxuryTwinEmail || formData.luxuryTripleEmail ||
        formData.standardEmail || formData.standardTwinEmail ||
        formData.podEmail || formData.youthLearningCenterEmail || '';

    formData.whatsapp = formData.whatsapp ||
        formData.supremeWhatsapp || formData.luxuryWhatsapp ||
        formData.luxuryTwinWhatsapp || formData.luxuryTripleWhatsapp ||
        formData.standardWhatsapp || formData.standardTwinWhatsapp ||
        formData.podWhatsapp || formData.youthLearningCenterWhatsapp || '';

    formData.dormType = formData.dormType || formData.podDormType || '';
    formData.numberOfChildren = formData.numberOfChildren || '';

    // Second attendee
    formData.attendee2Name = formData.attendee2Name ||
        formData.supremeAttendee2Name || formData.luxuryAttendee2Name ||
        formData.luxuryTwinAttendee2Name || formData.luxuryTripleAttendee2Name ||
        formData.standardAttendee2Name || formData.standardTwinAttendee2Name || '';

    formData.attendee2Email = formData.attendee2Email ||
        formData.supremeAttendee2Email || formData.luxuryAttendee2Email ||
        formData.luxuryTwinAttendee2Email || formData.luxuryTripleAttendee2Email ||
        formData.standardAttendee2Email || formData.standardTwinAttendee2Email || '';

    formData.attendee2Whatsapp = formData.attendee2Whatsapp ||
        formData.supremeAttendee2Whatsapp || formData.luxuryAttendee2Whatsapp ||
        formData.luxuryTwinAttendee2Whatsapp || formData.luxuryTripleAttendee2Whatsapp ||
        formData.standardAttendee2Whatsapp || formData.standardTwinAttendee2Whatsapp || '';

    // Third attendee
    formData.attendee3Name = formData.attendee3Name || formData.luxuryTripleAttendee3Name || '';
    formData.attendee3Email = formData.attendee3Email || formData.luxuryTripleAttendee3Email || '';
    formData.attendee3Whatsapp = formData.attendee3Whatsapp || formData.luxuryTripleAttendee3Whatsapp || '';


    try {
        const response = await fetch('https://cirak-payment.onrender.com/create-order', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Server error:', data);
            alert('Error creating order: ' + (data.error || 'Unknown error') + '\n\nPage will reload.');
            window.location.reload();
            return;
        }

        if (!data.orderId) {
            alert('Failed to create order. Please try again.\n\nPage will reload.');
            window.location.reload();
            return;
        }

        console.log('✅ Order created successfully:', data.orderId);

        // Razorpay payment options
        const options = {
            key: data.keyId,
            amount: data.amount,
            currency: data.currency,
            order_id: data.orderId,
            name: 'Mastering Life Retreat',
            description: roomType + ' Booking',
            prefill: {
                name: formData.fullName,
                email: formData.email,
                contact: formData.whatsapp
            },
            handler: function (response) {
                console.log('✅ Payment successful:', response);
                alert('Payment successful! Thank you for booking.');
                
                // Redirect to home page
                const referrer = document.referrer;
                const currentHost = window.location.hostname;
                
                if (referrer.includes('lumos.in')) {
                    window.location.href = 'https://lumos.in/';
                } else if (currentHost.includes('lumos.in')) {
                    window.location.href = 'https://lumos.in/index.html';
                } else if (currentHost.includes('test.lumostechsolutions.com')) {
                    window.location.href = 'https://test.lumostechsolutions.com/lumos-new/index.html';
                } else {
                    window.location.href = 'index.html';
                }
            },
            modal: {
                ondismiss: function() {
                    console.log('⚠️ Payment cancelled by user');
                    alert('Payment was cancelled.');
                    window.location.reload();
                }
            },
            theme: {
                color: '#3399cc'
            }
        };

        const rzp = new Razorpay(options);
        
        // Handle payment failures
        rzp.on('payment.failed', function (response) {
            console.error('❌ Payment failed:', response.error);
            alert('Payment failed: ' + response.error.description + '\n\nPage will reload so you can try again.');
            window.location.reload();
        });
        
        rzp.open();
        
    } catch (err) {
        console.error('❌ Payment processing error:', err);
        alert('Error occurred: ' + err.message + '\n\nPage will reload.');
        window.location.reload();
    }
}

// ========== ROOM TYPE HANDLERS ==========

// ============ SUPREME ROOM ============
const supremeForm = document.getElementById('supremeBookingForm');
if (supremeForm) {
    supremeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const occupancyType = document.querySelector('input[name="supremeOccupancy"]:checked')?.value;
        if (!occupancyType) { 
            alert('Please select occupancy type'); 
            return; 
        }
        
        const amount = extractAmountFromButton('#supremePayButton');
        if (!amount) {
            alert('Could not determine payment amount. Please refresh and try again.');
            window.location.reload();
            return;
        }
        
        processPayment(e.target, 'Supreme Room', amount, { occupancyType });
    });
}

// ============ LUXURY ROOM ============
const luxuryForm = document.getElementById('luxuryBookingForm');
if (luxuryForm) {
    luxuryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const occupancyType = document.querySelector('input[name="luxuryOccupancy"]:checked')?.value;
        if (!occupancyType) { 
            alert('Please select occupancy type'); 
            return; 
        }
        
        const amount = extractAmountFromButton('#luxuryPayButton');
        if (!amount) {
            alert('Could not determine payment amount. Please refresh and try again.');
            window.location.reload();
            return;
        }
        
        processPayment(e.target, 'Luxury Room', amount, { occupancyType });
    });
}

// ============ LUXURY TWIN ROOM ============
const luxuryTwinForm = document.getElementById('luxuryTwinBookingForm');
if (luxuryTwinForm) {
    luxuryTwinForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const amount = extractAmountFromButton('#luxuryTwinPayButton');
        if (!amount) {
            alert('Could not determine payment amount. Please refresh and try again.');
            window.location.reload();
            return;
        }
        
        processPayment(e.target, 'Luxury Twin Room', amount, { occupancyType: 'Double' });
    });
}

// ============ LUXURY TRIPLE ROOM ============
const luxuryTripleForm = document.getElementById('luxuryTripleBookingForm');
if (luxuryTripleForm) {
    luxuryTripleForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const amount = extractAmountFromButton('#luxuryTriplePayButton');
        if (!amount) {
            alert('Could not determine payment amount. Please refresh and try again.');
            window.location.reload();
            return;
        }
        
        processPayment(e.target, 'Luxury Triple Room', amount, { occupancyType: 'Triple' });
    });
}

// ============ STANDARD ROOM ============
const standardForm = document.getElementById('standardBookingForm');
if (standardForm) {
    standardForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const occupancyType = document.querySelector('input[name="standardOccupancy"]:checked')?.value;
        if (!occupancyType) { 
            alert('Please select occupancy type'); 
            return; 
        }
        
        const amount = extractAmountFromButton('#standardPayButton');
        if (!amount) {
            alert('Could not determine payment amount. Please refresh and try again.');
            window.location.reload();
            return;
        }
        
        processPayment(e.target, 'Standard Room', amount, { occupancyType });
    });
}

// ============ STANDARD TWIN ROOM ============
const standardTwinForm = document.getElementById('standardTwinBookingForm');
if (standardTwinForm) {
    standardTwinForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const amount = extractAmountFromButton('#standardTwinPayButton');
        if (!amount) {
            alert('Could not determine payment amount. Please refresh and try again.');
            window.location.reload();
            return;
        }
        
        processPayment(e.target, 'Standard Twin Room', amount, { occupancyType: 'Double' });
    });
}

// ============ POD ============
const podForm = document.getElementById('podBookingForm');
if (podForm) {
    podForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const dormType = document.querySelector('input[name="podDormType"]:checked')?.value;
        if (!dormType) { 
            alert('Please select dorm type'); 
            return; 
        }
        
        // Pod has fixed price
        const amount = 18000;
        
        processPayment(e.target, 'Pod', amount, { dormType });
    });
}

// ============ YOUTH LEARNING CENTER ============
const youthForm = document.getElementById('youthLearningCenterBookingForm');
if (youthForm) {
    youthForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const numberOfChildren = parseInt(document.getElementById('numberOfChildren')?.value);
        if (!numberOfChildren || numberOfChildren < 1) {
            alert('Please enter number of children');
            return;
        }
        
        const amount = extractAmountFromButton('#youthLearningCenterPayButton');
        if (!amount) {
            alert('Could not determine payment amount. Please refresh and try again.');
            window.location.reload();
            return;
        }
        
        processPayment(e.target, 'Youth Learning Center', amount, { numberOfChildren });
    });
}
});
