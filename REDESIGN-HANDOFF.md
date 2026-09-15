# Family Dental Clinic website redesign

## What changed

- Wider 1480px responsive page canvas with improved use of large screens.
- Simplified homepage with duplicated and lower-priority blocks removed.
- Full-width, admin-driven announcement ribbon.
- Compact trust strip below the hero.
- Three clinic locations shown prominently.
- New **From the Doctors** area for articles, YouTube videos, and photographs.
- Curated Google-review area with links to the genuine Google Business Profile.
- Existing appointment, Firebase, Cloudinary, clinical cases, SEO, and YouTube integrations retained.

## Publish the website

Copy this project over the existing Git-connected website folder, preserving its `.git` folder and private `.env.local` file. Then run:

```powershell
npm install
npm run build
git add .
git commit -m "Redesign wide homepage and add doctor content hub"
git push origin main
```

## Deploy the included Firestore rules

The updated `firestore.rules` adds public-read/admin-write access for:

- `website_articles`
- `website_gallery`
- `website_ribbon`
- `website_settings`

It also preserves the existing B. K. Prasad collections and their separate administrator. Deploy from the Firebase project folder with:

```powershell
firebase use family-dental-clinic-ff549
firebase deploy --only firestore:rules
```

No rule in this file deletes or migrates any document. The website only reads published website content and creates pending website appointment requests.

## Admin content fields

- `website_ribbon`: `text`, `active`
- `website_articles`: `title`, `summary` (or `excerpt`), `content`, `doctor` (or `author`), `imageUrl`, `published`, `createdAt`
- `website_gallery`: `title`, `caption`, `imageUrl`, `published`, `createdAt`
- `website_settings/google_reviews`: `items` array containing `name`, `text`, and `rating`

Until admin content is published, the ribbon and articles show professional fallback content and the photo area links to the clinic's Google profile.
