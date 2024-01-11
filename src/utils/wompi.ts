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

export  async function generateSignature(reference: string, amount: number, currency: string) {
  const signature_seed = `${reference}${amount}${currency}${process.env.WOMPI_INTEGRITY_SIGNATURE}`;

  const encondedText = new TextEncoder().encode(signature_seed);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encondedText);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return signature;
}

export async function generateTransaction(
  reference: string,
  amount: number,
  currency: string,
  email: string,
  paymentSourceId: number,
  signature: string,
) {
  const PAYMENT_URL = `https://sandbox.wompi.co/v1/transactions`;

  const paymentResponse = await axios.post(
    PAYMENT_URL,
    {
      reference,
      amount_in_cents: amount,
      currency,
      customer_email: email,
      payment_method: {
        installments: 1
      },
      payment_source_id: paymentSourceId,
      signature: signature
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}`,
      },
    },
  );

  return paymentResponse.data.data;
}