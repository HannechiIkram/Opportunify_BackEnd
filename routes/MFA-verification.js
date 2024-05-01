const express = require('express');
const router = express.Router();
const twilio = require('twilio');

const accountSid = 'AC249d8c49d4b8baad69601510a32d7e81';
const authToken = '36faa938df5db8fc1001ab7a22a0db77';
const client = twilio(accountSid, authToken);

// Generate a random 6-digit code
const generateMfaCode = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

// Send MFA code via SMS
const sendMfaCode = (phoneNumber, code) => {
    const message = `Your MFA code for Opportunifu login is: ${code}`;

    return client.messages.create({
        body: message,
        to: phoneNumber,
        from: '+21699130576'
    });
};

// Route to initiate MFA and send code
router.post('/send-verification', (req, res) => {
    const { phoneNumber } = req.body;

    const mfaCode = generateMfaCode();

    sendMfaCode(phoneNumber, mfaCode)
        .then(() => {
            res.status(200).json({ message: 'MFA code sent successfully.' });
        })
        .catch(error => {
            console.error('Error sending MFA code:', error);
            res.status(500).json({ error: 'Failed to send MFA code.' });
        });
});

/* Route to verify MFA code
router.post('/mfa/verify', (req, res) => {
    const { phoneNumber, code } = req.body;
    const expectedCode = ;

    if (code === expectedCode) {
        res.status(200).json({ message: 'MFA code verification successful.' });
    } else {
        res.status(400).json({ error: 'Invalid MFA code.' });
    }
});*/

module.exports = router;
