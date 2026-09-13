# SEO deployment checklist

The website now includes homepage metadata, a canonical URL, Open Graph and
Twitter sharing tags, Dentist/Person/WebSite/FAQ structured data, `robots.txt`,
`sitemap.xml`, and a web app manifest.

## After deploying to production

1. Open `https://www.familydentalsiwan.in/` and confirm the updated homepage.
2. Open `https://www.familydentalsiwan.in/robots.txt`.
3. Open `https://www.familydentalsiwan.in/sitemap.xml`.
4. In Google Search Console, add or select the `familydentalsiwan.in` property.
5. Submit `https://www.familydentalsiwan.in/sitemap.xml` in **Sitemaps**.
6. Use **URL inspection** for `https://www.familydentalsiwan.in/` and request
   indexing after the deployed page is live.

The `/admin` page and `/api/` routes are intentionally excluded from crawling,
and the admin page retains its own `noindex` directive.
