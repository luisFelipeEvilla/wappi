import axios from 'axios';

export async function getAcceptanceToken() {
  const ACCEPTANCE_TOKEN_URL = `https://sandbox.wompi.co/v1/merchants/${process.env.WOMPI_PUBLIC_KEY}`;

  const tokenResponse = await axios.get(ACCEPTANCE_TOKEN_URL);

  return tokenResponse.data.data.presigned_acceptance.acceptance_token;
}

export async function createPaymentSource(
  cardToken: string,
  email: string,
  acceptanceToken: string,
) {
  const PAYMENT_SOURCE_URL = `https://sandbox.wompi.co/v1/payment_sources`;

  const paymentSourceResponse = await axios.post(
    PAYMENT_SOURCE_URL,
    {
      type: 'CARD',
      token: cardToken,
      customer_email: email,
      acceptance_token: acceptanceToken,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}`,
      },
    },
  );

  return paymentSourceResponse.data.data.id;
}
