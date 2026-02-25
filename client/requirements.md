## Packages
recharts | Dashboard analytics charts and data visualization
date-fns | Human-readable date formatting
lucide-react | Standard icon set for UI elements
react-hook-form | Form state management
@hookform/resolvers | Zod validation integration for forms
clsx | Utility for constructing className strings
tailwind-merge | Utility for merging tailwind classes

## Notes
- Application uses Replit Auth. Authentication flows redirect to `/api/login` and `/api/logout`.
- User profiles must be created after initial login to assign roles (Admin, Clerk, Faculty, Student).
- Numeric fields (fees, amounts) in forms use `z.coerce.number()` to ensure correct JSON types.
- Relies on `@shared/schema` and `@shared/routes` for types and API contracts.
