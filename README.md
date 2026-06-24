# K3 Order List Bot

A Discord bot that manages a 5-slot order list with slash commands.

## Commands

| Command | Description |
|---|---|
| `/add @user` | Adds the user to the highest open slot and @mentions them |
| `/remove @user` | Removes the user from the list |
| `/list` | Displays the current K3 Order List |
| `/clear` | Clears all 5 slots |

---

## Setup Guide

### Step 1 — Create your bot on Discord

1. Go to https://discord.com/developers/applications
2. Click **New Application** → give it a name (e.g. K3 Bot)
3. Go to the **Bot** tab → click **Add Bot**
4. Under **Token**, click **Reset Token** and copy it — this is your `DISCORD_TOKEN`
5. Copy your **Application ID** from the **General Information** tab — this is your `CLIENT_ID`
6. Under **Privileged Gateway Intents**, enable **Server Members Intent** and **Message Content Intent**

### Step 2 — Invite the bot to your server

Use this URL (replace `YOUR_CLIENT_ID`):

```
https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=274877908992&scope=bot+applications.commands
```

### Step 3 — Run it locally (for testing)

```bash
npm install
DISCORD_TOKEN=your_token CLIENT_ID=your_client_id node index.js
```

---

## Hosting for FREE (so it stays online 24/7)

### Option A: Railway (Recommended — easiest)

1. Go to https://railway.app and sign up (free tier available)
2. Click **New Project** → **Deploy from GitHub repo**
3. Push your bot files to a GitHub repo first, then connect it
4. In Railway, go to **Variables** and add:
   - `DISCORD_TOKEN` = your token
   - `CLIENT_ID` = your client ID
5. Railway auto-detects Node.js and runs `npm start` — done!

### Option B: Render

1. Go to https://render.com and sign up
2. Click **New** → **Web Service** → connect your GitHub repo
3. Set **Build Command** to `npm install`
4. Set **Start Command** to `node index.js`
5. Add your environment variables (`DISCORD_TOKEN`, `CLIENT_ID`) under **Environment**
6. Deploy — it's live!

> ⚠️ Render's free tier spins down after inactivity. Use Railway for always-on hosting.

### Option C: Fly.io

1. Install the Fly CLI: https://fly.io/docs/hands-on/install-flyctl/
2. Run `fly launch` in your project folder
3. Set secrets: `fly secrets set DISCORD_TOKEN=xxx CLIENT_ID=xxx`
4. Run `fly deploy`
