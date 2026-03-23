const requiredEnv = [
  'MPESA_CONSUMER_KEY',
  'MPESA_CONSUMER_SECRET',
  'MPESA_BUSINESS_SHORTCODE',
  'MPESA_PASSKEY',
  'MPESA_CALLBACK_URL',
]

const toKenyanPhone = (input) => {
  const digits = String(input || '').replace(/\D/g, '')
  if (digits.startsWith('254') && digits.length === 12) return digits
  if (digits.startsWith('0') && digits.length === 10) return `254${digits.slice(1)}`
  if (digits.length === 9) return `254${digits}`
  return ''
}

const amountToInteger = (value) => {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount <= 0) return 0
  return Math.round(amount)
}

const jsonResponse = (statusCode, payload) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
})

const getMpesaAccessToken = async () => {
  const { MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET } = process.env
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64')
  const response = await fetch(
    'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    {
      method: 'GET',
      headers: { Authorization: `Basic ${auth}` },
    },
  )
  const data = await response.json()
  if (!response.ok || !data.access_token) {
    throw new Error(data.errorMessage || data.error || 'Failed to get M-PESA access token.')
  }
  return data.access_token
}

const getTimestamp = () => {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return (
    now.getFullYear() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds())
  )
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' })
  }

  const missing = requiredEnv.filter((key) => !process.env[key])
  if (missing.length) {
    return jsonResponse(500, {
      error: `Missing required M-PESA env vars: ${missing.join(', ')}`,
    })
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const phone = toKenyanPhone(body.phone)
    const amount = amountToInteger(body.amount)
    const orderRef = String(body.orderRef || `DERA-${Date.now()}`).slice(0, 20)

    if (!phone) {
      return jsonResponse(400, { error: 'Invalid phone number. Use Kenyan format.' })
    }
    if (!amount) {
      return jsonResponse(400, { error: 'Invalid amount.' })
    }

    const timestamp = getTimestamp()
    const shortcode = process.env.MPESA_BUSINESS_SHORTCODE
    const password = Buffer.from(`${shortcode}${process.env.MPESA_PASSKEY}${timestamp}`).toString(
      'base64',
    )
    const token = await getMpesaAccessToken()

    const stkPayload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerBuyGoodsOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: orderRef,
      TransactionDesc: 'Dera Drip Order Payment',
    }

    const response = await fetch('https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPayload),
    })
    const data = await response.json()

    if (!response.ok || data.ResponseCode !== '0') {
      return jsonResponse(400, {
        error: data.errorMessage || data.ResponseDescription || 'STK push request failed.',
        raw: data,
      })
    }

    return jsonResponse(200, {
      ok: true,
      checkoutRequestId: data.CheckoutRequestID,
      merchantRequestId: data.MerchantRequestID,
      customerMessage: data.CustomerMessage || 'STK push sent.',
    })
  } catch (error) {
    return jsonResponse(500, { error: error.message || 'Could not initiate payment.' })
  }
}

