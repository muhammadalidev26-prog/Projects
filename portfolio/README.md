# Portfolio: Next.js full-stack

Next.js 15 (App Router) + TypeScript + Tailwind CSS + Postgres (Neon) + Drizzle ORM + Auth.js (GitHub login) + Nodemailer (Gmail).

## What's in it
- Public site: hero, about, skills, projects, services (starting prices), blog, contact form
- `/blog` and `/blog/[slug]`: markdown posts stored in the database
- `GET /api/projects`: published projects as JSON
- `POST /api/contact`: saves the message, emails you, auto-replies to the sender
- `/admin`: messages, projects, services, blog posts (markdown editor with preview), and site text. Only your GitHub account can log in.

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill it in:
   - **DATABASE_URL**: create a free project at neon.tech and copy the connection string.
   - **AUTH_SECRET**: run `npx auth secret` (or `openssl rand -base64 32`).
   - **GitHub OAuth**: github.com/settings/developers > New OAuth App. Homepage `http://localhost:3000`, callback `http://localhost:3000/api/auth/callback/github`. Copy the client ID and secret into `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET`. Set `ADMIN_GITHUB_USERNAME` to your GitHub username.
   - **Gmail**: turn on 2-Step Verification, then create an App password at myaccount.google.com/apppasswords. Use your Gmail address as `GMAIL_USER` and the app password as `GMAIL_APP_PASSWORD`.
3. `npm run db:push` creates the tables. `npm run db:seed` adds the sample content.
4. `npm run dev`, then open http://localhost:3000. Log in at http://localhost:3000/admin.

## Replace the sample content
Everything you see is placeholder text. Edit it in `/admin`: site settings (headline, about, skills, email, links), projects, services and prices, and blog posts. For your photo, put `photo.jpg` in `public/` and set the photo URL to `/photo.jpg` in Site settings.

## Deploy (Vercel)
1. Push the project to GitHub and import it at vercel.com.
2. Add all the `.env.example` variables in Vercel's project settings.
3. Create a second GitHub OAuth app for production (callback `https://YOUR-SITE.vercel.app/api/auth/callback/github`) and use its ID and secret in Vercel.
4. Deploy. Run `npm run db:push` and `npm run db:seed` once against the same `DATABASE_URL` if you haven't already.

## Notes
- Gmail limits sending to roughly 500 emails a day, which is plenty for a portfolio. When you get a custom domain you can switch `src/lib/mail.ts` to a service like Resend.
- The contact rate limit is in memory per server instance. It stops casual spam, not a determined attacker.
