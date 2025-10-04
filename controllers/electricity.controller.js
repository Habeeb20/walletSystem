
import User from "../models/user/userModel.js"
import Electricty from "../models/others/electrictyModel.js"
import dotenv from "dotenv"

dotenv.config()

const MCD_API_URL =  'https://reseller.mcd.5starcompany.com.ng/api/v1';
const MCD_API_TOKEN = process.env.MCD_API_TOKEN;
const MCD_TOKEN = process.env.MCD_TOKEN

export const buyElectricity = async (req, res) => {
    try {
      const {number, amount} = req.body
       const user = await User.findOne({ email: req.user.email });
       if (!user) return res.status(404).json({ error: 'User not found' });

        if ( !number || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 500) {
      return res.status(400).json({ error: 'you cant buy below 500' });
    }
     if (user.wallet.balance < parsedAmount) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    const provider = "ikeja-electric"
      const country = "NG"
      const promo = "0"
      const payment = "wallet"
      const reference = `mcd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const existingData = await Electricty.findOne({ ref: reference }); // Updated to Data
              if (existingData) {
                return res.status(400).json({ error: 'Duplicate transaction reference' });
              }

               // Validate phone number/service (using /validate endpoint)
    const validateResponse = await fetch(`${MCD_API_URL}/validate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MCD_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service: 'airtime',
        provider,
        number,
      }),
    });

    if (!validateResponse.ok) {
      console.log(validateResponse)
      throw new Error(`Validation failed: ${validateResponse.status}`);
    }

    const electricity = new Electricty({
        userId: user._id,
        number,
        provider,
        amount: parsedAmount,
        ref: reference,
        promo,
        payment,
        country,
        status:"pending"

    })

    await electricity.save()

     user.wallet.balance -= parsedAmount;
    await user.save();


  const response = await fetch(`${MCD_API_URL}/electricity`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MCD_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        number,
        provider,
        amount: parsedAmount,
        ref: reference,
        promo,
        payment,
        country,
      }),
    });
 

       if (!response.ok) {
      // Roll back wallet balance and update transaction status
      user.wallet.balance += parsedAmount;
      data.status = 'failed'; // Updated to data
      await Promise.all([user.save(), data.save()]);
      throw new Error(`MCD API error: ${response.status}`);
    }

    const result = await response.json();

   electricity.status = "success";
   electricty.electricityDetails = result.data || {}

  await electricity.save()
 user.wallet.transactions.push({
      type: 'debit',
      amount: parsedAmount,
      provider: 'mcd',
      reference,
      status: 'success',
      details: { amount, number, country, type: 'electricty-bill' },
      timestamp: new Date(),
    });
    await user.save();
console.log(result)
    res.json({ success: true, message: 'Data purchase successful', reference });
    } catch (error) {
            console.error('Data purchase error:', error);
    res.status(500).json({ error: error.message || 'Failed to purchase data' });
    }
}



