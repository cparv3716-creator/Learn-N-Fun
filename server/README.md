# Future Backend Layer

This folder is reserved for future backend code that can sit behind route
handlers, server actions, or separate service modules.

Suggested phase 2 structure:

- `services/` for business logic
- `repositories/` for Prisma data access
- `validators/` for input parsing and request safety
- `mappers/` for converting database records into UI-facing shapes
