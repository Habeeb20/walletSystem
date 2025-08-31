import axios from "axios"

export const buyAirtime = async (phone, amount, network, secretKey) => {
  try {
    const response = await axios.post(
      `${process.env.FLUTTERWAVE_BASE_URL}/virtual-account/topup`,
      {
        phone_number: phone,
        amount,
        network,
        currency: 'NGN',
      },
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Flutterwave VTU failed: ${error.response?.data?.message || error.message}`);
  }
};

export const buyData = async (phone, amount, network, plan, secretKey) => {
  try {
    const response = await axios.post(
      `${process.env.FLUTTERWAVE_BASE_URL}/virtual-account/data`,
      {
        phone_number: phone,
        amount,
        network,
        plan_code: plan, // Use the plan code from Flutterwave docs
        currency: 'NGN',
      },
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Flutterwave Data failed: ${error.response?.data?.message || error.message}`);
  }
};

