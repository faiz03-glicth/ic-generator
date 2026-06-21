// api/trigger-webhook.js
export default async function handler(req, res) {
  // GitHub webhooks send POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // This is the data GitHub sends you!
  const payload = req.body;

  console.log('🚀 GitHub Webhook Received!');
  
  // Example: Check what kind of event happened
  if (payload.repository) {
    console.log(`Repository: ${payload.repository.full_name}`);
    console.log(`Action performed by: ${payload.sender.login}`);
  }

  // Always return a 200 OK to GitHub immediately so it knows you received it
  return res.status(200).json({ success: true, message: 'Webhook received' });
}