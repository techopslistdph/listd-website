# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Setup**: `npm run setup` (installs dependencies with legacy peer deps flag)
- **Development**: `npm run dev` (starts Next.js dev server with Turbopack)
- **Build**: `npm run build` (builds for production)
- **Lint**: `npm run lint` (runs Next.js ESLint)
- **Format**: `npm run format` (formats code with Prettier)
- **Format Check**: `npm run format:check` (checks formatting without modifying)

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Authentication**: Clerk
- **State Management**: 
  - TanStack Query (React Query) for server state
  - MobX State Tree for client state (property search/filtering)
- **UI Components**: Radix UI with custom shadcn/ui components
- **Maps**: Google Maps API (@react-google-maps/api)

### Project Structure

**Core Application**
- `src/app/(pages)/`: Main application pages with shared layout
- `src/app/api/`: API routes (proxies to backend)
- `src/middleware.ts`: Clerk authentication middleware

**Components Architecture**
- `src/components/ui/`: Reusable UI components (shadcn/ui based)
- `src/components/common/`: Shared application components
- `src/components/[feature]/`: Feature-specific components grouped by domain
  - `auth/`: Authentication layouts
  - `home/`: Landing page components
  - `listing/`: Property listing and creation forms
  - `profile/`: User profile and account management
  - `property/`: Property display and filtering
  - `message/`: Messaging system
  - `valuation/`: Property valuation features

**Data Layer**
- `src/lib/queries/`: TanStack Query setup and API hooks
  - `hooks/`: Custom query hooks organized by feature
  - `server/`: API endpoint definitions and server functions
- `src/models/RootStore.ts`: MobX State Tree store for property search state
- `src/hooks/`: Custom React hooks

### Key Features

**Property Management**
- Multi-step property listing form with validation
- Property search with map integration and polygon drawing
- Property filtering with various criteria (price, location, features)
- Property valuation using AI integration

**User System**
- Clerk-based authentication with protected routes
- User profiles with listing management
- Property favorites system

**Messaging System**
- Real-time-like messaging (polling every 10s)
- Draft conversation support
- Property-specific conversations
- Optimistic UI updates

**Geographic Features**
- Google Maps integration with marker clustering
- Polygon-based property search
- Location autocomplete for Philippine addresses
- Coordinate-based filtering

### State Management Patterns

**Server State (TanStack Query)**
- API calls are abstracted into custom hooks in `src/lib/queries/hooks/`
- Query keys are centralized in `query-keys.ts`
- API endpoints are defined in `server/api-endpoints.ts`

**Client State (MobX State Tree)**
- Property search/filter state managed in `RootStore`
- Includes map coordinates, search bounds, and polygon data
- Accessed via `useStore()` hook

### Environment Variables
- `BACKEND_API_HOST`: Backend API base URL
- Clerk environment variables for authentication

### File Organization Conventions
- Components are organized by feature domain
- Each major feature has its own directory under `components/`
- Forms use react-hook-form with Zod validation
- UI components follow shadcn/ui patterns with Tailwind CSS

### Backend Integration
- Frontend acts as a client to a separate backend API
- API routes in `src/app/api/` typically proxy to backend
- Uses fetch wrapper with error handling in `src/lib/fetch-wrapper.ts`