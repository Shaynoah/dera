export const initiateMpesaStkPush = async ({ phone, amount, orderRef }) => {
  const response = await fetch('/.netlify/functions/mpesa-stk-push', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, amount, orderRef }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok || !data.ok) {
    throw new Error(data.error || 'Could not start M-PESA payment.')
  }

  return data
}

