# ProCleanLife

**Expo and Express prototype for a local cleaning marketplace.**

ProCleanLife explores a mobile-first marketplace where customers can post cleaning jobs, upload photos, receive offers, message providers, and track job status. The repo contains both a React Native app and an Express/Sequelize backend skeleton.

## Product Surface

| Area | Current Behavior |
| --- | --- |
| Job posting | Guided multi-step flow for address, timing, task details, photos, and review |
| Job management | Customer-facing screens for viewing posted jobs and status |
| Offers | Backend route and model structure for cleaner offers |
| Messaging | Backend message model and API route foundation |
| Users | Basic user model and route structure |
| Photos | Job photo model and image upload-oriented app flow |

## Architecture

```text
Expo mobile app
  -> Express API
    -> Sequelize models
    -> PostgreSQL database
```

## Tech Stack

### Mobile

- Expo 53
- React 19
- React Native 0.79
- Expo Router
- Expo Image Picker
- TypeScript

### Backend

- Express
- Sequelize
- PostgreSQL
- CORS
- dotenv
- nodemon

## Repository Map

```text
app/                    Expo Router screens and flows
components/             Shared mobile components
assets/                 App images and static assets
backend/
  index.js              Express server entry
  models/               Sequelize models
  routes/               Jobs, offers, messages, users
  migrations/           Database migration files
  package.json          Backend scripts and dependencies
```

## Run Locally

### Mobile App

```bash
npm install
npm run start
```

### Backend

```bash
cd backend
npm install
npm run start
```

Create a backend `.env` file with the database connection values expected by the Sequelize configuration.

## Implementation Notes

This is currently a marketplace prototype. The strongest implemented product area is the job-posting experience. The backend has the right domain shape for jobs, offers, messages, users, payments, and photos, but production marketplace requirements still need to be completed before launch.

Production gaps to address:

- Authentication and authorization.
- Payment and escrow integration.
- Real-time messaging.
- Provider onboarding and verification.
- Job lifecycle rules.
- Notifications.
- Admin and dispute workflows.

## Roadmap

- Connect the mobile job flow to the backend job API.
- Add auth and role separation for customers and cleaners.
- Add offer acceptance and job status transitions.
- Add image upload storage.
- Add payment integration only after the core marketplace state model is stable.

## Maintainer

Built by [Jawwad Ahmed](https://jawwad.xyz), focused on product prototypes, mobile workflows, and operational automation systems.
