const Nexmo = require('nexmo');
require('dotenv').config();

const nexmo = new Nexmo({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET
}, { apiHost: 'messages-sandbox.nexmo.com' });

function sendWhatsAppOTP(to, otp) {
  const from = 'whatsapp:+14157386170'; // Vonage Sandbox number
  const text = `Your OTP is ${otp}`;

  return new Promise((resolve, reject) => {
    nexmo.channel.send(
      { type: 'whatsapp', number: to },
      { type: 'whatsapp', number: from },
      { content: { type: 'text', text } },
      (err, data) => {
        if (err) reject(err);
        else resolve(data);
      }
    );
  });
}

module.exports = { sendWhatsAppOTP };
