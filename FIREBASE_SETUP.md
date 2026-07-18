# Firebase appointment setup

The website appointment form is already connected through the Firestore REST API. No Firebase npm package is required.

## 1. Create or open the Firebase project

Use the same Firebase project that ClinicOS Dental will use.

## 2. Enable Cloud Firestore

Create the database in production mode and select a nearby region.

## 3. Publish the included rules

Copy the contents of `firestore.rules` into Firebase Console → Firestore Database → Rules, then publish.

These starter rules allow the public website to create appointment requests only. Public reading, editing, and deleting are blocked.

## 4. Add local environment variables

Copy `.env.example` to `.env.local` and replace the placeholder values:

```env
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_API_KEY=your-web-api-key
```

The web API key is available in Firebase Console → Project settings → General → Your apps → Web app.

## 5. Add the same variables in Vercel

Open the Vercel project → Settings → Environment Variables and add:

- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_API_KEY`

Add them for Production, Preview, and Development, then redeploy.

## Appointment collection

New website requests are stored in:

```text
appointments/{deterministicAppointmentId}
```

Each record contains patient details, clinic, requested date/time, `source: website`, `status: pending`, and `createdAt`.

The deterministic document ID prevents the same patient from submitting the exact same clinic/date/time request twice.
