const jsonResponse = (statusCode, payload) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
})

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' })
  }

  try {
    const payload = JSON.parse(event.body || '{}')
    const callback =
      payload?.Body?.stkCallback ||
      payload?.body?.stkCallback ||
      payload?.Body?.StkCallback ||
      null

    // This endpoint is intentionally lightweight for now.
    // You can persist callback payloads to Supabase once Daraja credentials are active.
    console.log('M-PESA callback received:', JSON.stringify(callback || payload))

    return jsonResponse(200, { ok: true })
  } catch (error) {
    return jsonResponse(200, { ok: true, warning: error.message || 'Callback parse warning.' })
  }
}

