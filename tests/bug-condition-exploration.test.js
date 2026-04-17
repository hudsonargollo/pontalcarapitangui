/**
 * Bug Condition Exploration Test
 * 
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4**
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * DO NOT attempt to fix the test or the code when it fails
 * 
 * This test encodes the expected behavior - it will validate the fix when it passes after implementation
 * GOAL: Surface counterexamples that demonstrate the bug exists
 * 
 * Property 1: Bug Condition - Cloudflare Functions Database Connection Failure
 * Tests that Cloudflare Functions with inconsistent environment variables fail to connect to Supabase database
 */

import { describe, test, expect, beforeAll, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Bug Condition Exploration: Cloudflare Functions Database Connection', () => {
  let wranglerConfig;
  let testFunctionCode;
  let whatsappStatusCode;
  let middlewareCode;
  
  beforeAll(async () => {
    // Read the actual configuration and function files to analyze environment variable usage
    wranglerConfig = fs.readFileSync('wrangler.toml', 'utf8');
    testFunctionCode = fs.readFileSync('functions/api/test.js', 'utf8');
    whatsappStatusCode = fs.readFileSync('functions/api/whatsapp/status.js', 'utf8');
    middlewareCode = fs.readFileSync('functions/_middleware.js', 'utf8');
    
    console.log('Analyzing environment variable configuration...');
  });

  test('Property 1: Environment variable naming consistency analysis', async () => {
    // This test analyzes the actual configuration files to identify inconsistencies
    // It will FAIL on unfixed code due to environment variable naming mismatches
    
    console.log('Analyzing wrangler.toml configuration...');
    
    // Check what environment variables are defined in wrangler.toml
    const hasSupabaseServiceKey = wranglerConfig.includes('SUPABASE_SERVICE_KEY');
    const hasSupabaseServiceRoleKey = wranglerConfig.includes('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('wrangler.toml defines SUPABASE_SERVICE_KEY:', hasSupabaseServiceKey);
    console.log('wrangler.toml defines SUPABASE_SERVICE_ROLE_KEY:', hasSupabaseServiceRoleKey);
    
    // Check what environment variables are expected by functions
    const testFunctionExpectsServiceKey = testFunctionCode.includes('SUPABASE_SERVICE_KEY');
    const testFunctionExpectsServiceRoleKey = testFunctionCode.includes('SUPABASE_SERVICE_ROLE_KEY');
    
    const whatsappExpectsServiceKey = whatsappStatusCode.includes('SUPABASE_SERVICE_KEY');
    const whatsappExpectsServiceRoleKey = whatsappStatusCode.includes('SUPABASE_SERVICE_ROLE_KEY');
    
    const middlewareExpectsServiceKey = middlewareCode.includes('SUPABASE_SERVICE_KEY');
    const middlewareExpectsServiceRoleKey = middlewareCode.includes('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('COUNTEREXAMPLE ANALYSIS:');
    console.log('test.js expects SUPABASE_SERVICE_KEY:', testFunctionExpectsServiceKey);
    console.log('test.js expects SUPABASE_SERVICE_ROLE_KEY:', testFunctionExpectsServiceRoleKey);
    console.log('whatsapp/status.js expects SUPABASE_SERVICE_KEY:', whatsappExpectsServiceKey);
    console.log('whatsapp/status.js expects SUPABASE_SERVICE_ROLE_KEY:', whatsappExpectsServiceRoleKey);
    console.log('middleware expects SUPABASE_SERVICE_KEY:', middlewareExpectsServiceKey);
    console.log('middleware expects SUPABASE_SERVICE_ROLE_KEY:', middlewareExpectsServiceRoleKey);
    
    // Expected behavior: all functions should use the same environment variable name
    // This will FAIL on unfixed code due to inconsistent naming
    
    // Document the counterexample
    if (hasSupabaseServiceKey && !hasSupabaseServiceRoleKey) {
      if (middlewareExpectsServiceRoleKey) {
        console.log('COUNTEREXAMPLE FOUND: wrangler.toml defines SUPABASE_SERVICE_KEY but middleware expects SUPABASE_SERVICE_ROLE_KEY');
        throw new Error('Bug confirmed: Environment variable naming inconsistency between wrangler.toml and middleware');
      }
    }
    
    if (testFunctionExpectsServiceKey && whatsappExpectsServiceKey && middlewareExpectsServiceRoleKey) {
      console.log('COUNTEREXAMPLE FOUND: Functions expect different environment variable names');
      console.log('test.js and whatsapp/status.js expect SUPABASE_SERVICE_KEY');
      console.log('middleware expects SUPABASE_SERVICE_ROLE_KEY');
      throw new Error('Bug confirmed: Inconsistent environment variable naming across functions');
    }
    
    // Expected behavior: consistent naming across all files
    const allUseServiceKey = testFunctionExpectsServiceKey && whatsappExpectsServiceKey && middlewareExpectsServiceKey;
    const allUseServiceRoleKey = testFunctionExpectsServiceRoleKey && whatsappExpectsServiceRoleKey && middlewareExpectsServiceRoleKey;
    
    expect(allUseServiceKey || allUseServiceRoleKey).toBe(true);
  }, 10000);

  test('Property 1: Wrangler configuration vs function expectations', async () => {
    // Test that verifies the specific environment variable configuration mismatch
    // This will reveal the exact inconsistency between wrangler.toml and function code
    
    console.log('Analyzing specific environment variable mismatches...');
    
    // Parse wrangler.toml to extract environment variables
    const wranglerVars = {};
    const varSection = wranglerConfig.match(/\[vars\]([\s\S]*?)(?=\[|$)/);
    if (varSection) {
      const varLines = varSection[1].split('\n');
      for (const line of varLines) {
        const match = line.match(/^([A-Z_]+)\s*=/);
        if (match) {
          wranglerVars[match[1]] = true;
        }
      }
    }
    
    console.log('Environment variables defined in wrangler.toml:', Object.keys(wranglerVars));
    
    // Check what the test function expects
    const testFunctionMatch = testFunctionCode.match(/context\.env\.([A-Z_]+)/g);
    const testFunctionVars = testFunctionMatch ? testFunctionMatch.map(m => m.replace('context.env.', '')) : [];
    
    console.log('Environment variables expected by test.js:', testFunctionVars);
    
    // Check what the WhatsApp status function expects
    const whatsappMatch = whatsappStatusCode.match(/context\.env\.([A-Z_]+)/g) || whatsappStatusCode.match(/env\.([A-Z_]+)/g);
    const whatsappVars = whatsappMatch ? whatsappMatch.map(m => m.replace(/.*\./, '')) : [];
    
    console.log('Environment variables expected by whatsapp/status.js:', whatsappVars);
    
    // Expected behavior: all expected variables should be defined in wrangler.toml
    for (const varName of testFunctionVars) {
      if (!wranglerVars[varName]) {
        console.log(`COUNTEREXAMPLE FOUND: test.js expects ${varName} but it's not defined in wrangler.toml`);
        throw new Error(`Bug confirmed: ${varName} expected by test.js but not defined in wrangler.toml`);
      }
    }
    
    for (const varName of whatsappVars) {
      if (!wranglerVars[varName]) {
        console.log(`COUNTEREXAMPLE FOUND: whatsapp/status.js expects ${varName} but it's not defined in wrangler.toml`);
        throw new Error(`Bug confirmed: ${varName} expected by whatsapp/status.js but not defined in wrangler.toml`);
      }
    }
    
    // This test should pass if all expected variables are properly defined
    expect(true).toBe(true);
  }, 10000);

  test('Property 1: Session manager environment variable expectations', async () => {
    // Test that analyzes the session manager's environment variable expectations
    // This will reveal if the session manager can properly initialize with current config
    
    const sessionManagerCode = fs.readFileSync('functions/api/whatsapp/session-manager.js', 'utf8');
    
    console.log('Analyzing session manager environment variable usage...');
    
    // Check what environment variables the session manager expects
    const initSupabaseMatch = sessionManagerCode.match(/env\?\.(SUPABASE_[A-Z_]+)/g);
    const expectedVars = initSupabaseMatch ? initSupabaseMatch.map(m => m.replace('env?.', '')) : [];
    
    console.log('Environment variables expected by session manager:', expectedVars);
    
    // Parse wrangler.toml to see what's actually defined
    const wranglerVars = {};
    const varSection = wranglerConfig.match(/\[vars\]([\s\S]*?)(?=\[|$)/);
    if (varSection) {
      const varLines = varSection[1].split('\n');
      for (const line of varLines) {
        const match = line.match(/^([A-Z_]+)\s*=/);
        if (match) {
          wranglerVars[match[1]] = true;
        }
      }
    }
    
    // Check for mismatches
    for (const varName of expectedVars) {
      if (!wranglerVars[varName]) {
        console.log(`COUNTEREXAMPLE FOUND: session manager expects ${varName} but wrangler.toml defines different variable names`);
        console.log('Available in wrangler.toml:', Object.keys(wranglerVars).filter(k => k.startsWith('SUPABASE_')));
        throw new Error(`Bug confirmed: Session manager expects ${varName} but it's not available in wrangler.toml`);
      }
    }
    
    // Expected behavior: session manager should be able to find all required variables
    expect(expectedVars.length).toBeGreaterThan(0);
    expect(expectedVars.every(varName => wranglerVars[varName])).toBe(true);
  }, 10000);

  test('Property 1: Comprehensive environment variable consistency check', async () => {
    // This test performs a comprehensive analysis of environment variable usage
    // across all function files to identify the exact inconsistencies
    
    console.log('Performing comprehensive environment variable analysis...');
    
    // Read .env file to see what's defined locally
    let envFileContent = '';
    try {
      envFileContent = fs.readFileSync('.env', 'utf8');
    } catch (error) {
      console.log('No .env file found or cannot read it');
    }
    
    const envFileVars = {};
    if (envFileContent) {
      const envLines = envFileContent.split('\n');
      for (const line of envLines) {
        const match = line.match(/^([A-Z_]+)\s*=/);
        if (match) {
          envFileVars[match[1]] = true;
        }
      }
    }
    
    console.log('Environment variables in .env file:', Object.keys(envFileVars));
    
    // Parse wrangler.toml
    const wranglerVars = {};
    const varSection = wranglerConfig.match(/\[vars\]([\s\S]*?)(?=\[|$)/);
    if (varSection) {
      const varLines = varSection[1].split('\n');
      for (const line of varLines) {
        const match = line.match(/^([A-Z_]+)\s*=/);
        if (match) {
          wranglerVars[match[1]] = true;
        }
      }
    }
    
    console.log('Environment variables in wrangler.toml:', Object.keys(wranglerVars));
    
    // Analyze the specific inconsistency we expect to find
    const envHasServiceRoleKey = envFileVars['SUPABASE_SERVICE_ROLE_KEY'];
    const wranglerHasServiceKey = wranglerVars['SUPABASE_SERVICE_KEY'];
    const wranglerHasServiceRoleKey = wranglerVars['SUPABASE_SERVICE_ROLE_KEY'];
    
    console.log('.env has SUPABASE_SERVICE_ROLE_KEY:', envHasServiceRoleKey);
    console.log('wrangler.toml has SUPABASE_SERVICE_KEY:', wranglerHasServiceKey);
    console.log('wrangler.toml has SUPABASE_SERVICE_ROLE_KEY:', wranglerHasServiceRoleKey);
    
    // Expected behavior: consistent naming between .env and wrangler.toml
    // This will FAIL on unfixed code due to the naming inconsistency
    
    if (envHasServiceRoleKey && wranglerHasServiceKey && !wranglerHasServiceRoleKey) {
      console.log('COUNTEREXAMPLE FOUND: .env uses SUPABASE_SERVICE_ROLE_KEY but wrangler.toml uses SUPABASE_SERVICE_KEY');
      console.log('This inconsistency will cause functions to fail when deployed to Cloudflare');
      throw new Error('Bug confirmed: Environment variable naming inconsistency between .env and wrangler.toml');
    }
    
    // Check if functions expect the variable that's actually defined in wrangler.toml
    const middlewareExpectsRoleKey = middlewareCode.includes('SUPABASE_SERVICE_ROLE_KEY');
    if (middlewareExpectsRoleKey && wranglerHasServiceKey && !wranglerHasServiceRoleKey) {
      console.log('COUNTEREXAMPLE FOUND: Middleware expects SUPABASE_SERVICE_ROLE_KEY but wrangler.toml only defines SUPABASE_SERVICE_KEY');
      throw new Error('Bug confirmed: Middleware expects SUPABASE_SERVICE_ROLE_KEY but wrangler.toml defines SUPABASE_SERVICE_KEY');
    }
    
    // Expected behavior: all components should use consistent variable names
    expect(envHasServiceRoleKey && wranglerHasServiceRoleKey).toBe(true);
  }, 10000);
});