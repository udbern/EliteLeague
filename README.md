# EliteLeague

A modern, visually engaging e-football league management platform. Track fixtures, live match stats, standings, top scorers, and more — all with a beautiful, interactive UI. Built with Next.js, React, and Sanity for seamless real-time updates and a premium user experience.

---

## Features
- Dynamic league and cup competitions
- Fixtures, results, and live match stats
- Standings and top scorers
- Slug-based, SEO-friendly URLs
- Responsive, modern UI/UX
- Admin-friendly content management with Sanity

## Tech Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend/CMS:** Sanity.io
- **Other:** Framer Motion, Lucide Icons, Tabler Icons

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- [Sanity CLI](https://www.sanity.io/docs/getting-started-with-sanity-cli) (for CMS setup)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/EliteLeague.git
cd EliteLeague
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Set up Sanity Studio
```bash
cd efootball
sanity install
sanity start
```
- Configure your Sanity project and dataset as needed.
- Add your environment variables if required (see `.env.example`).

### 4. Run the Next.js app
```bash
cd ..
npm run dev
# or
yarn dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

---

## Folder Structure
- `/app` - Next.js app directory (pages, layouts, API routes)
- `/components` - React components (UI, tables, match cards, etc.)
- `/lib` - Data fetching, utilities, and Sanity client
- `/efootball` - Sanity Studio (schemas, config)
- `/public` - Static assets

---

## Customization & Deployment
- Update your Sanity schemas in `/efootball/schemaTypes` as needed.
- Deploy the frontend with Vercel, Netlify, or your preferred host.
- Deploy Sanity Studio with [Sanity Deploy](https://www.sanity.io/docs/deployment).

---

## License
This project is licensed under the MIT License.

---

## Credits
- Built with [Next.js](https://nextjs.org/) and [Sanity.io](https://www.sanity.io/)
- UI inspired by modern sports and gaming dashboards
