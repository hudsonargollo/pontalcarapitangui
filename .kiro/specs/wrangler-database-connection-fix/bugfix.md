# Bugfix Requirements Document

## Introduction

The Coco Loko Açaiteria application has database connectivity issues when deployed via Cloudflare Pages with Functions. While local development works correctly, the deployed Cloudflare Functions fail to connect to the Supabase database due to environment variable inconsistencies and potential DNS resolution problems. This affects critical functionality including order management, payment processing, and WhatsApp notifications.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN Cloudflare Functions attempt to access Supabase database THEN the system fails with DNS resolution errors for `sntxekdwdllwkszclpiq.supabase.co`

1.2 WHEN functions reference `SUPABASE_SERVICE_KEY` environment variable THEN the system cannot find the variable because it's defined as `SUPABASE_SERVICE_ROLE_KEY` in `.env`

1.3 WHEN middleware references `SUPABASE_SERVICE_ROLE_KEY` while functions expect `SUPABASE_SERVICE_KEY` THEN the system has inconsistent variable naming across the codebase

1.4 WHEN deployed functions try to connect to Supabase THEN the system likely fails database operations due to missing or incorrectly named environment variables

### Expected Behavior (Correct)

2.1 WHEN Cloudflare Functions attempt to access Supabase database THEN the system SHALL successfully resolve the Supabase URL and establish database connections

2.2 WHEN functions reference Supabase service key environment variable THEN the system SHALL consistently use the same variable name across all files

2.3 WHEN environment variables are configured in wrangler.toml THEN the system SHALL make them available to all Cloudflare Functions at runtime

2.4 WHEN deployed functions perform database operations THEN the system SHALL successfully execute queries, inserts, and updates against the Supabase database

### Unchanged Behavior (Regression Prevention)

3.1 WHEN running the application in local development mode THEN the system SHALL CONTINUE TO work correctly with existing database connections

3.2 WHEN frontend components access Supabase via client-side SDK THEN the system SHALL CONTINUE TO function normally with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`

3.3 WHEN functions perform non-database operations (like MercadoPago API calls) THEN the system SHALL CONTINUE TO work without any changes

3.4 WHEN middleware handles CORS and error logging THEN the system SHALL CONTINUE TO provide the same functionality