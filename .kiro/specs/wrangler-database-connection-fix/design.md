# Wrangler Database Connection Fix Design

## Overview

The Coco Loko Açaiteria application experiences database connectivity failures when deployed via Cloudflare Pages with Functions. The root cause is environment variable inconsistencies where some functions expect `SUPABASE_SERVICE_KEY` while others use `SUPABASE_SERVICE_ROLE_KEY`, combined with potential DNS resolution issues. This design outlines a systematic approach to standardize environment variable naming, ensure proper Cloudflare Functions configuration, and validate database connectivity across all deployment contexts.

## Glossary

- **Bug_Condition (C)**: The condition that triggers database connection failures - when Cloudflare Functions attempt to access Supabase with inconsistent or missing environment variables
- **Property (P)**: The desired behavior when functions access the database - successful connection establishment and query execution
- **Preservation**: Existing local development functionality and frontend client-side database access that must remain unchanged
- **wrangler.toml**: Cloudflare Pages configuration file that defines environment variables for Functions runtime
- **SUPABASE_SERVICE_KEY**: Environment variable name used by some functions (inconsistent naming)
- **SUPABASE_SERVICE_ROLE_KEY**: Environment variable name used by middleware and .env file (inconsistent naming)
- **Cloudflare Functions**: Server-side functions that run on Cloudflare's edge network for API endpoints

## Bug Details

### Bug Condition

The bug manifests when Cloudflare Functions attempt to connect to the Supabase database using environment variables. The system fails due to inconsistent variable naming where some functions expect `SUPABASE_SERVICE_KEY` while the configuration provides `SUPABASE_SERVICE_ROLE_KEY`, or when DNS resolution fails for the Supabase URL.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type CloudflareFunctionContext
  OUTPUT: boolean
  
  RETURN input.isCloudflareFunction = true
         AND (input.env.SUPABASE_SERVICE_KEY != input.env.SUPABASE_SERVICE_ROLE_KEY
              OR input.env.SUPABASE_SERVICE_KEY is undefined
              OR input.env.SUPABASE_SERVICE_ROLE_KEY is undefined
              OR DNS_RESOLUTION_FAILS(input.env.SUPABASE_URL))
         AND database_operation_attempted = true
END FUNCTION
```

### Examples

- **WhatsApp Status Function**: Expects `SUPABASE_SERVICE_KEY` but wrangler.toml provides `SUPABASE_SERVICE_KEY` while middleware expects `SUPABASE_SERVICE_ROLE_KEY`
- **Error Logging Middleware**: Uses `SUPABASE_SERVICE_ROLE_KEY` but some functions may not have this variable available
- **Health Check Function**: Checks for `SUPABASE_SERVICE_ROLE_KEY` but test function checks for `SUPABASE_SERVICE_KEY`
- **DNS Resolution**: Functions may fail to resolve `sntxekdwdllwkszclpiq.supabase.co` in Cloudflare's network environment

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Local development environment must continue to work with existing `.env` configuration
- Frontend React components must continue to access Supabase via client-side SDK with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- Non-database operations in functions (MercadoPago API calls, CORS handling) must remain unaffected

**Scope:**
All functionality that does NOT involve server-side database operations from Cloudflare Functions should be completely unaffected by this fix. This includes:
- Frontend client-side Supabase operations
- Local development database connections
- MercadoPago payment processing API calls
- CORS middleware functionality

## Hypothesized Root Cause

Based on the bug analysis and code examination, the most likely issues are:

1. **Environment Variable Naming Inconsistency**: The codebase uses both `SUPABASE_SERVICE_KEY` and `SUPABASE_SERVICE_ROLE_KEY` inconsistently
   - Functions in `/api/whatsapp/status.js` and `/api/test.js` expect `SUPABASE_SERVICE_KEY`
   - Middleware in `_middleware.js` and health check expect `SUPABASE_SERVICE_ROLE_KEY`
   - The `.env` file defines `SUPABASE_SERVICE_ROLE_KEY` but wrangler.toml defines `SUPABASE_SERVICE_KEY`

2. **Wrangler Configuration Issues**: The `wrangler.toml` may not be properly exposing environment variables to Functions runtime

3. **DNS Resolution Problems**: Cloudflare's network may have issues resolving the Supabase URL `sntxekdwdllwkszclpiq.supabase.co`

4. **Supabase Client Initialization**: Functions may be failing to properly initialize the Supabase client with the correct credentials

## Correctness Properties

Property 1: Bug Condition - Database Connection Success

_For any_ Cloudflare Function that attempts to access the Supabase database with properly configured environment variables, the fixed system SHALL successfully establish database connections, execute queries, and return expected results without DNS resolution or authentication errors.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

Property 2: Preservation - Non-Database Functionality

_For any_ operation that does NOT involve server-side database access from Cloudflare Functions (frontend client operations, local development, non-database API calls), the fixed system SHALL produce exactly the same behavior as the original system, preserving all existing functionality.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `wrangler.toml`

**Function**: Environment variable configuration

**Specific Changes**:
1. **Standardize Variable Naming**: Change `SUPABASE_SERVICE_KEY` to `SUPABASE_SERVICE_ROLE_KEY` to match the standard Supabase naming convention
   - Update the `[vars]` section to use consistent naming
   - Ensure the service role key value is correctly set

2. **Verify DNS Configuration**: Ensure the Supabase URL is correctly formatted and accessible from Cloudflare's network

**File**: `functions/api/test.js`

**Function**: `onRequest`

**Specific Changes**:
3. **Update Environment Variable Reference**: Change `SUPABASE_SERVICE_KEY` to `SUPABASE_SERVICE_ROLE_KEY`
   - Update the `envCheck` object to use the standardized variable name

**File**: `functions/api/whatsapp/status.js`

**Function**: `onRequest`

**Specific Changes**:
4. **Update Environment Variable Reference**: Change `SUPABASE_SERVICE_KEY` to `SUPABASE_SERVICE_ROLE_KEY`
   - Update destructuring assignment and all references to use the standardized variable name

**File**: `functions/api/whatsapp/session-manager.js`

**Function**: `initSupabase`

**Specific Changes**:
5. **Update Environment Variable Reference**: Change `SUPABASE_SERVICE_KEY` to `SUPABASE_SERVICE_ROLE_KEY`
   - Update the function parameter and variable references to use the standardized variable name

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Deploy the current unfixed code to Cloudflare Pages and test database operations from Functions. Monitor logs for DNS resolution errors and environment variable issues.

**Test Cases**:
1. **WhatsApp Status Test**: Call `/api/whatsapp/status` endpoint on deployed version (will fail on unfixed code)
2. **Health Check Test**: Call `/api/health` endpoint and verify database connectivity check (will fail on unfixed code)
3. **Environment Variable Test**: Call `/api/test` endpoint to verify environment variable availability (will fail on unfixed code)
4. **Middleware Logging Test**: Trigger an error to test Supabase logging in middleware (may fail on unfixed code)

**Expected Counterexamples**:
- Functions fail with "Supabase configuration missing" errors
- Possible causes: undefined environment variables, DNS resolution failures, incorrect variable naming

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := cloudflareFunction_fixed(input)
  ASSERT expectedBehavior(result)
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT cloudflareFunction_original(input) = cloudflareFunction_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for frontend operations and local development, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Frontend Database Operations**: Verify React components can still access Supabase client-side after fix
2. **Local Development Preservation**: Verify local development continues to work with existing `.env` configuration
3. **Non-Database API Preservation**: Verify MercadoPago and other non-database APIs continue working
4. **CORS and Middleware Preservation**: Verify middleware functionality remains unchanged

### Unit Tests

- Test environment variable availability in each function context
- Test Supabase client initialization with correct credentials
- Test database query execution from Functions
- Test error handling for missing environment variables

### Property-Based Tests

- Generate random function contexts and verify database operations succeed with proper configuration
- Generate random API requests and verify non-database operations continue working
- Test that all frontend operations continue to work across many scenarios

### Integration Tests

- Test full deployment pipeline with database operations
- Test switching between local development and deployed environments
- Test that all API endpoints work correctly after environment variable standardization