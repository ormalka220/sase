# Supabase Migration (Prisma + Render)

This backend is now configured for PostgreSQL (Supabase).

## 1) Set environment variables

In `backend/.env` (local) and in Render (backend service):

- `DATABASE_URL` = Supabase pooled connection string (`:6543`, `pgbouncer=true`)
- `DIRECT_URL` = Supabase direct connection string (`:5432`)
- `JWT_SECRET` = strong secret for production
- existing PP variables as needed

Example:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
```

## 2) Apply schema on Supabase

From `backend/`:

```bash
npm ci
npx prisma generate
npm run prisma:migrate:deploy
```

## 3) Seed initial data (optional)

```bash
npm run seed
```

## 4) Run service

```bash
npm start
```

## 5) Move existing local SQLite data

If you need to preserve current local data (`dev2.db`), migrate data table-by-table
to Supabase (script/ETL). The quick path is:

1. apply schema to Supabase (`prisma:migrate:deploy`)
2. run `npm run seed` for baseline data
3. manually re-import only required production records

