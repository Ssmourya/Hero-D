const { Vonage } = require('@vonage/server-sdk');

// Initialize the Vonage client with proper credentials
const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY || "bf7d2c88",
  apiSecret: process.env.VONAGE_API_SECRET || "YLeG1D3zv3r1sovK"
});

console.log('Vonage client initialized with:', {
  apiKey: process.env.VONAGE_API_KEY || "bf7d2c88",
  // Don't log the full secret
  apiSecretProvided: !!process.env.VONAGE_API_SECRET
});

/**
 * Send SMS using Vonage
 * @param {string} to - Recipient phone number (without country code)
 * @param {string} text - SMS content
 * @returns {Promise<object>} - Result of the operation
 */
const sendSMS = async (to, text) => {
  try {
    // Default sender ID
    const from = process.env.VONAGE_SENDER_ID || "Vonage APIs";

    // Format the phone number (add country code if not present)
    // Make sure to remove any spaces or special characters
    const cleanedNumber = to.replace(/[^0-9]/g, '');
    const formattedTo = cleanedNumber.startsWith('91') ? `+${cleanedNumber}` : `+91${cleanedNumber}`;

    // Always log the SMS attempt
    console.log(`Attempting to send SMS from ${from} to ${formattedTo}`);
    console.log(`Message: ${text}`);

    // In development mode, we'll still try to send the SMS but also log it
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV MODE] SMS would be sent from ${from} to ${formattedTo}: ${text}`);
      // We'll continue to actually send the SMS even in development mode
    }

    // Send the SMS
    try {
      return new Promise((resolve, reject) => {
        vonage.sms.send({
          from,
          to: formattedTo,
          text
        })
        .then(resp => {
          console.log('Message sent successfully');
          console.log(JSON.stringify(resp, null, 2));

          // Check if the message was actually sent successfully
          if (resp && resp.messages && resp.messages.length > 0) {
            const message = resp.messages[0];
            if (message.status === '0') {
              console.log(`Message sent successfully to ${formattedTo} with ID: ${message.messageId || message.message_id}`);
              resolve({ success: true, response: resp });
            } else {
              const errorText = message.errorText || message.error_text || 'Unknown error';
              console.error(`Failed to send message. Status: ${message.status}, Error: ${errorText}`);
              resolve({ success: false, error: errorText, response: resp });
            }
          } else {
            console.error('Unexpected response format from Vonage API');
            resolve({ success: false, error: 'Unexpected response format', response: resp });
          }
        })
        .catch(err => {
          console.log('There was an error sending the messages.');
          console.error(err);
          reject({ success: false, error: err });
        });
      });
    } catch (error) {
      console.error('Exception while sending SMS:', error);
      return { success: false, error: error.message };
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendSMS };
