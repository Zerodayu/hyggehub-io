# Agent Guidelines for HyggeHub Frontend

This document provides essential guidelines for AI coding agents working on the HyggeHub frontend codebase.

## Technology Stack

- **Framework**: Next.js 16.1.6 with App Router (React 19.2.4)
- **Runtime**: Bun (package manager and dev server)
- **Build Tool**: Turbopack
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4 with PostCSS
- **UI Components**: shadcn/ui (New York variant) + Radix UI primitives
- **State Management**: TanStack Query v5 (React Query) + React Hook Form
- **Authentication**: Clerk
- **Validation**: Zod v4
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Notifications**: Sonner

## Build, Lint & Test Commands

### Development
```bash
bun run dev              # Start dev server with Turbopack
```

### Production
```bash
bun run build            # Build for production
bun run start            # Start production server
```

### Linting
```bash
bun run lint             # Run ESLint
```

### Testing
**Note**: No test framework is currently configured in this project. If tests are needed, consider setting up Vitest + React Testing Library.

## Project Structure

```
/app/                    # Next.js App Router pages & layouts
/components/             # React components
  /ui/                   # Reusable UI components (shadcn/ui)
/api/                    # API client functions (api-org.ts, api-sms.ts, etc.)
/lib/                    # Utility functions and helpers
  /server/               # Server-side utilities
/hooks/                  # Custom React hooks
  /contexts/             # React context providers
/languages/              # i18n translation files (da.ts, en.ts)
/utils/                  # Additional utilities
/public/                 # Static assets
```

## Code Style Guidelines

### File Naming
- **Components**: PascalCase (e.g., `Navbar.tsx`, `QueryProvider.tsx`)
- **Utilities**: camelCase (e.g., `utils.ts`, `country-code.ts`)
- **API files**: kebab-case with `api-` prefix (e.g., `api-org.ts`, `api-sms.ts`)

### Import Order
```typescript
// 1. React and core libraries
import { useState } from "react"
import { useOrganization } from "@clerk/nextjs"

// 2. Third-party libraries
import { useMutation, useQuery } from '@tanstack/react-query'

// 3. Internal imports using @ alias (grouped logically)
import { Button } from "@/components/ui/button"
import { getOrg } from "@/api/api-org"
import { cn } from "@/lib/utils"
```

### Component Structure

**Client Components**:
```typescript
"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function MyComponent() {
  // Component logic
}
```

**Server Components** (default):
```typescript
import { getOrg } from "@/api/api-org"

export default async function MyServerComponent() {
  // Can use async/await directly
  const data = await getOrg()
  // Component logic
}
```

### TypeScript Guidelines

- **Strict mode enabled**: Always include proper types
- **Props typing**: Use inline types or interfaces
```typescript
interface MyComponentProps {
  title: string;
  count?: number;
}

export function MyComponent({ title, count = 0 }: MyComponentProps) {
  // ...
}
```
- **No `any` types**: Use proper typing or `unknown` if type is truly unknown
- **Path alias**: Use `@/*` for all internal imports (maps to project root)

### Naming Conventions

- **Components**: PascalCase (e.g., `QueryProvider`, `ShopEditSheet`)
- **Functions**: camelCase (e.g., `getOrg`, `updateOrgPhoneNo`)
- **Constants**: camelCase (e.g., `queryClient`, `activeLang`)
- **Types/Interfaces**: PascalCase with descriptive names (e.g., `UserProfile`, `ApiResponse`)

### Styling Patterns

- **Tailwind utility classes**: Primary styling method
- **Class merging**: Always use `cn()` helper from `@/lib/utils` for conditional classes
```typescript
import { cn } from "@/lib/utils"

<div className={cn("base-class", condition && "conditional-class")} />
```
- **CSS variables**: Use oklch color format in `globals.css`
- **Dark mode**: Applied via `.dark` class on `<html>` element
- **Typography**: Use `font-mono` with `font-bold` for headings/CTAs (brand standard)

### API Client Pattern

**API Layer Structure**:
- Centralized axios instance in `/lib/axios.ts`
- API functions in `/api/` directory organized by domain
- Always use the centralized `api` instance from `@/lib/axios`

**API Function Pattern**:
```typescript
import api from "@/lib/axios";

export async function getResource(clerkOrgId: string) {
  const res = await api.get('/api/resource', {
    headers: {
      'x-clerk-org-id': clerkOrgId
    }
  });
  return res.data;
}

export async function updateResource({ 
  orgId, 
  userId, 
  data 
}: { 
  orgId: string; 
  userId: string; 
  data: ResourceData;
}) {
  const res = await api.put('/api/resource',
    data,
    {
      headers: {
        'x-clerk-user-id': userId,
        'x-clerk-org-id': orgId,
      }
    }
  );
  return res.data;
}
```

**Authentication Headers**:
- `x-clerk-org-id`: Organization ID (required for most endpoints)
- `x-clerk-user-id`: User ID (required for mutations)
- `x-api-key`: Set globally in axios instance
- `x-vercel-protection-bypass`: Set globally in axios instance

### State Management

**TanStack Query (React Query)**:
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOrg, updateOrg } from '@/api/api-org'

// Query
const { data, isLoading } = useQuery({
  queryKey: ['org', orgId],
  queryFn: () => getOrg(orgId),
})

// Mutation with cache invalidation
const queryClient = useQueryClient()
const mutation = useMutation({
  mutationFn: updateOrg,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['org'] })
  },
})
```

### Form Handling

Use React Hook Form + Zod for all forms:
```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
})

const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: { name: "" },
})
```

### Internationalization (i18n)

- Language files: `/languages/da.ts`, `/languages/en.ts`
- Import active language: `import { lang } from "@/languages/lang"`
- Access translations: `lang.hero.title`, `lang.common.save`
- Always provide both English and Danish translations

## Error Handling

- Use try-catch blocks in API functions and async operations
- Display user-friendly error messages using Sonner toast
- Log errors to console for debugging
```typescript
import { toast } from "sonner"

try {
  await updateResource(data)
  toast.success("Resource updated successfully")
} catch (error) {
  console.error("Failed to update resource:", error)
  toast.error("Failed to update resource. Please try again.")
}
```

## Performance Best Practices

- Use React Server Components by default (no `"use client"` directive)
- Only add `"use client"` when using hooks, event handlers, or browser APIs
- Lazy load heavy components with `next/dynamic`
- Optimize images with `next/image` component
- Use TanStack Query for efficient data fetching and caching

## Additional Notes

- **No test infrastructure**: Tests are not currently set up. If implementing tests, configure Vitest.
- **Monospace branding**: The app uses monospace font throughout as a design choice
- **shadcn/ui components**: Located in `/components/ui/`, can be modified as needed
- **Environment variables**: Prefix public variables with `NEXT_PUBLIC_`
