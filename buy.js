const axios = require('axios');

async function buyBitcoinWithMpesa(amount, phoneNumber) {
    try {
        // Make a request to the M-Pesa API to initiate the payment
        const response = await axios.post('https://mpesa-api.com/pay', {
            amount,
            phoneNumber,
            currency: 'KES',
            paymentMethod: 'M-Pesa',
        });
        // Make a request to the M-Pesa API to check the payment status
        const paymentStatus = await axios.get(`https://mpesa-api.com/payment/${response.data.paymentId}`);

        // Check if the payment was successful
        if (paymentStatus.data.success) {
            // Purchase Bitcoin using the M-Pesa payment
            const bitcoin = await axios.post('https://bitcoin-api.com/buy', {
                amount: response.data.amount,
                paymentId: response.data.paymentId,
                amount: paymentStatus.data.amount,
                paymentId: paymentStatus.data.paymentId
            });
            return bitcoin.data;
        } else {
            throw new Error('Payment failed');
        }
    } catch (error) {
        console.error('Error buying Bitcoin:', error.message);
        throw error;
    }
}