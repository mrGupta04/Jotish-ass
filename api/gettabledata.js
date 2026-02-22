export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const payload = req.body && Object.keys(req.body).length > 0
    ? req.body
    : { username: 'test', password: '123456' }

  try {
    const upstreamResponse = await fetch(
      'https://backend.jotish.in/backend_dev/gettabledata.php',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    )

    const text = await upstreamResponse.text()

    if (!upstreamResponse.ok) {
      return res.status(upstreamResponse.status).json({
        error: 'Upstream API error',
        status: upstreamResponse.status,
      })
    }

    try {
      return res.status(200).json(JSON.parse(text))
    } catch {
      return res.status(200).send(text)
    }
  } catch {
    return res.status(502).json({ error: 'Failed to fetch upstream API' })
  }
}
