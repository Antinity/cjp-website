# Cockroach Janta Party (CJP) - Official Website

> *"What began as internet satire has become one of India’s fastest-growing youth political movements, turning mockery into mobilization."* - Cockroach Janta Party

This is the official repository for the Cockroach Janta Party website. It serves as the digital headquarters for our movement, featuring live membership counters, petition signups, volunteer labor forms, and our official manifesto.

## Features

- **Live Statistics**: Real-time trackers for website visitors, members, and petition signatures.
- **Volunteer Forms**: The "Get Off Your Couch" Youth Suggestion & Labor Form.
- **Manifesto & Vision**: Clear, uncompromising stances on youth issues.
- **Responsive Design**: Built with a bold, brutalist, and modern aesthetic using Tailwind CSS.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (React) configured as a static export.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a custom brutalist design system.
- **Backend/API**: PHP endpoints designed for Hostinger deployment.
- **Database**: MySQL.
- **Caching**: APCu for high-performance counter updates.

## Getting Started (Local Development)

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can start editing the page by modifying `src/app/page.tsx`.

## Hostinger Deployment

This project is configured as a static Next.js export with PHP endpoints located in the `public/api` directory.

1. Run the build command to generate static files:
   ```bash
   npm run build
   ```
2. Upload the contents of the generated `out` folder to your Hostinger `public_html` directory.
3. Create the necessary MySQL tables as defined in `HOSTINGER_COUNTER_ARCHITECTURE.md`.
4. Enable **APCu** for the active PHP version in the Hostinger hPanel.
5. Set up a cron job to run every 5 minutes to flush cached counts to the database:

```bash
curl -s "https://your-domain.com/api/counter.php?action=flush&token=YOUR_TOKEN" >/dev/null 2>&1
curl -s "https://your-domain.com/api/petition.php?action=flush&token=YOUR_TOKEN" >/dev/null 2>&1
curl -s "https://your-domain.com/api/members.php?action=flush&token=YOUR_TOKEN" >/dev/null 2>&1
```

**Environment Variables Required on Server:**
Ensure the following variables are set securely in your PHP environment (`.env` or similar depending on configuration):
`FLUSH_TOKEN`, `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `IP_HASH_SALT`, and `ALLOWED_ORIGIN`.
