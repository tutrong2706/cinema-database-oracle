# Cinema Database Project Instructions

## Architecture & Database Strategy (SQL-First)
- **Monorepo**: `app/Backend` (Express/Prisma), `app/Frontend` (React/Vite), `sql/` (MySQL scripts).
- **Logic Location**: Business logic (pricing, validation) often resides in SQL Triggers/SPs (e.g., `08_triggers_tongtien.sql`). Check `sql/` before writing JS logic.
- **Schema Workflow**: 
  1. Edit `sql/*.sql` files.
  2. Run SQL in MySQL (or `source sql/run_all.sql`).
  3. `cd app/Backend` -> `npm run db:pull` -> `npm run db:generate`.
  4. **NEVER** edit `schema.prisma` manually.

## Backend Development (Node.js/Express)
- **Response Standard**: MUST use `src/helpers/handleResponse.js`.
  - Success: `return res.status(code).json(handleSuccessResponse(code, msg, data))`
  - Error: `return res.status(code).json(handleErrorResponse(code, msg))`
- **Routing**: Register new routes in `src/routers/root.router.js`.
- **Swagger**: Update `src/common/swagger/swagger.config.js` for API docs.
- **Port Config**: Frontend expects Backend at port **3069** (see `axiosClient.js`). Set `PORT=3069` in `.env` or update client.

## Frontend Development (React/Vite)
- **API Calls**: Use `src/api/axiosClient.js` (auto-injects `Authorization: Bearer token`).
- **Styling**: Tailwind CSS.

## Conventions
- **Naming**: `snake_case` for DB columns/tables (e.g., `ve_xem_phim`), `camelCase` for JS variables.
- **Auth**: JWT stored in `localStorage` key `'token'`.
