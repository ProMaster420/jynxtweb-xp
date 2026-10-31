/* ==========================================================================
   jynxt API - Message Webhook
   Endpoint to receive messages from NGL.link
   ========================================================================== */

// Handle incoming messages from NGL.link
// Configure the webhook URL in your NGL.link profile settings

const WEBHOOK_PORTS = [3000, 3001, 8080];

async function handleMessage(message) {
  // Validate message structure
  if (!message || !message.from) {
    return { error: "Invalid message format" };
  }

  // Sanitize message content
  const sanitizedMessage = {
    id: message.id || Date.now().toString(),
    from: sanitize(message.from),
    content: sanitize(message.content || message.message || ""),
    received: new Date().toISOString()
  };

  // TODO: Store message (in production, use a database)
  console.log("Received message:", sanitizedMessage);

  return { success: true, message: sanitizedMessage };
}

function sanitize(text) {
  if (typeof text !== "string") return "";
  return text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
               .replace(/on\w+="[^"]*"/gi, "");
}

export { handleMessage };