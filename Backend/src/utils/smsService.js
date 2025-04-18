const twilio = require('twilio');

// Initialize Twilio client only if credentials are available
let client;
try {
  // Only create the client if we have valid credentials
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
    client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }
} catch (error) {
  console.log('Twilio client initialization failed:', error.message);
  // We'll handle the absence of a client in the sendSMS function
}

/**
 * Send SMS using Twilio
 * @param {string} to - Recipient phone number (with country code)
 * @param {string} body - SMS content
 * @returns {Promise} - Twilio message response
 */
const sendSMS = async (to, body) => {
  try {
    // Always log the SMS in development mode or when Twilio is not configured
    if (!client || process.env.NODE_ENV !== 'production') {
      console.log(`[DEV MODE] SMS would be sent to ${to}: ${body}`);
      return { success: true, sid: 'DEV_MODE_SID' };
    }

    // Send the SMS using Twilio
    const message = await client.messages.create({
      body,
      to, // Recipient phone number (with country code)
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
    });

    console.log(`SMS sent with SID: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendSMS };
