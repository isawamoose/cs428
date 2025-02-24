# Puppr

## Backend

The backend is written in TypeScript. The server uses the Express library, and the database uses MySQL.

The general flow from request to database is as follows:

- `index.ts` contains a server that receives incoming requests. It calls functions on:
- `<someservice>Service.ts` which contains a service class that handles business logic. It calls functions on:
- `Database.ts` which contains a database access class for a MySQL database.

Backend structure:
```
Backend
├── database
│   ├── Database.ts
│   └── dbModel.ts
├── service
│   └── userService.ts
├── shared
│   └── Profile.ts
├── config.ts
├── index.ts
```
