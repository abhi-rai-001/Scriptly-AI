# Security Architecture & Measures

This document outlines the security protocols, authentication mechanisms, and data protection strategies implemented in Zebvo AI.

## Current Security Measures

### 1. Authentication & Session Management
- **Supabase Auth**: Utilizing Supabase's identity provider for secure user registration and login.
- **JWT-based Sessions**: Authentication is handled via secure, HTTP-only cookies storing JWT tokens.
- **Middleware Guards**: A centralized `middleware.ts` interceptor validates sessions for all `/(dashboard)/*` and protected routes, preventing unauthorized access at the network edge.
- **Secure Redirection**: Automatic redirection to `/login` for unauthenticated users attempting to access internal features.

### 2. Authorization & Data Isolation
- **Row Level Security (RLS)**: PostgreSQL RLS policies are enforced on all critical tables (`scripts`, `projects`, `user_usage`). 
    - **Isolation**: Users can only read or write data where the `user_id` matches their authenticated UID.
    - **Integrity**: Server-side checks ensure that `user_id` is derived from the session, not the request body.
- **Server Actions**: All database mutations are performed via Next.js Server Actions, providing a secure, server-side execution environment that bypasses client-side exposure.

### 3. API & Data Protection
- **Environment Variable Security**: All sensitive API keys (Gemini, HuggingFace, Supabase Service Role) are strictly server-side and never exposed to the browser.
- **Content Security**: Remote images are strictly controlled via `next.config.ts` remote patterns, preventing arbitrary image loading and protecting against XSS/resource injection.
- **Usage Tracking**: Real-time monitoring of generation counts (`user_usage` table) to prevent system abuse and ensure fair resource distribution.

### 4. Infrastructure Security
- **SSL/TLS**: Mandatory encryption for all data in transit.
- **Database Hardening**: Using Supabase's managed Postgres instance with built-in protection against common injection attacks.

## Roadmap & Upcoming Features

### 1. OAuth & Social Authentication
We are expanding our authentication options to provide a smoother onboarding experience:
- **[UPCOMING] Sign in with Google**: Full integration for one-click account creation and login.
- **[UPCOMING] Sign in with GitHub**: Secure developer and creator-focused authentication.
- *Note: UI buttons are already available in the login/signup pages; backend provider configuration is in progress.*

### 2. Enhanced Account Security
- **Multi-Factor Authentication (MFA)**: Support for authenticator apps (TOTP) to add an extra layer of protection.
- **Session Management**: A dedicated "Active Sessions" dashboard allowing users to log out of other devices remotely.

### 3. API Resilience
- **Rate Limiting**: Implementing per-user rate limits for AI generation to ensure high availability and prevent DDoS-style abuse of AI credits.
- **Prompt Injection Protection**: Advanced filtering for user inputs to prevent malicious manipulation of the AI generation engine.

### 4. Compliance & Privacy
- **Data Portability**: Features to allow users to export their generated scripts and project data in standard formats (JSON/CSV).
- **Data Deletion**: Automated "Delete Account" functionality that ensures all user data is purged from the database and storage buckets.
