
# Vercel API Receiver

This is a minimal API endpoint to receive MCP prompts from Claude via your MCP server.

## What it does

- Exposes an API endpoint at `/api/receive`
- Logs the prompt
- Responds with a simple JSON confirmation

## How to deploy

1. Click "Deploy to Vercel" button (link provided by your Claude assistant)
2. Follow Vercel flow → deploy this repo
3. After deploy → get the URL:

    https://your-project-name.vercel.app/api/receive

4. Copy that URL into your Claude Desktop `VERCEL_URL` config.

That's it! 🚀
