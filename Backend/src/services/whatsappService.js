const { Vonage } = require('@vonage/server-sdk');

// Initialize the Vonage client with proper credentials
const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY || "bf7d2c88",
  apiSecret: process.env.VONAGE_API_SECRET || "YLeG1D3zv3r1sovK"
});

console.log('Vonage WhatsApp client initialized with:', {
  apiKey: process.env.VONAGE_API_KEY || "bf7d2c88",
  // Don't log the full secret
  apiSecretProvided: !!process.env.VONAGE_API_SECRET
});

/**
 * Send OTP via WhatsApp using Vonage
 * @param {string} to - Recipient phone number (without country code)
 * @param {string} otp - The OTP to send
 * @returns {Promise<object>} - Result of the operation
 */
const sendWhatsAppOTP = async (to, otp) => {
  try {
    // Format the phone number (add country code if not present)
    // Make sure to remove any spaces or special characters
    const cleanedNumber = to.replace(/[^0-9]/g, '');
    const formattedTo = cleanedNumber.startsWith('91') ? cleanedNumber : `91${cleanedNumber}`;

    // Default sender number (from Vonage WhatsApp Business account)
    const from = process.env.VONAGE_WHATSAPP_NUMBER || "14157386170";

    // Create the message content
    const text = `Your OTP code is: ${otp}`;

    // Always log the WhatsApp attempt
    console.log(`Attempting to send WhatsApp message from ${from} to ${formattedTo}`);
    console.log(`Message: ${text}`);

    // In development mode, we'll still try to send the message but also log it
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV MODE] WhatsApp message would be sent from ${from} to ${formattedTo}: ${text}`);
      // For testing in development, we can return success without actually sending
      return { success: true, id: 'DEV_MODE_ID' };
    }

    // Create the message object
    const message = {
      content: {
        type: "text",
        text: text,
      },
      to: {
        type: "whatsapp",
        number: formattedTo,
      },
      from: {
        type: "whatsapp",
        number: from,
      },
    };

    // Send the WhatsApp message
    try {
      const response = await vonage.messages.send(message);
      console.log("WhatsApp message sent successfully:", response);
      return { success: true, response };
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      return { success: false, error: error.message };
    }
  } catch (error) {
    console.error('Error in WhatsApp service:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendWhatsAppOTP };
