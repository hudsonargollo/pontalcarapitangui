#!/bin/bash

# Deployment Status Check Script
# Verifies all prerequisites and configurations for Cloudflare Pages deployment

set -e

echo "🔍 Checking Deployment Status..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Counters
PASSED=0
FAILED=0

# Function to check status
check_status() {
    local name=$1
    local command=$2
    
    if eval "$command" &> /dev/null; then
        echo -e "${GREEN}✅${NC} $name"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} $name"
        ((FAILED++))
    fi
}

# Function to check version
check_version() {
    local name=$1
    local command=$2
    
    if command -v $command &> /dev/null; then
        local version=$($command --version 2>&1 | head -1)
        echo -e "${GREEN}✅${NC} $name: $version"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} $name: Not installed"
        ((FAILED++))
    fi
}

echo -e "${BLUE}📋 Prerequisites${NC}"
check_version "Node.js" "node"
check_version "npm" "npm"
check_version "Git" "git"
echo ""

echo -e "${BLUE}🔧 CLI Tools${NC}"
check_version "Supabase CLI" "supabase"
check_version "Wrangler CLI" "wrangler"
echo ""

echo -e "${BLUE}📁 Project Files${NC}"
check_status "package.json exists" "test -f package.json"
check_status "wrangler.toml exists" "test -f wrangler.toml"
check_status "vite.config.ts exists" "test -f vite.config.ts"
check_status "supabase/config.toml exists" "test -f supabase/config.toml"
check_status "scripts/deploy-cloudflare.sh exists" "test -f scripts/deploy-cloudflare.sh"
echo ""

echo -e "${BLUE}🗄️  Supabase Configuration${NC}"
check_status "Supabase project linked" "npx supabase projects list | grep -q pontalcarapitangui"
check_status "Migrations directory exists" "test -d supabase/migrations"
check_status "Migrations present" "test $(ls supabase/migrations/*.sql 2>/dev/null | wc -l) -gt 0"
echo ""

echo -e "${BLUE}🏗️  Build Status${NC}"
check_status "dist directory exists" "test -d dist"
check_status "Build artifacts present" "test $(ls dist/*.html 2>/dev/null | wc -l) -gt 0"
echo ""

echo -e "${BLUE}⚙️  Environment Configuration${NC}"
check_status "VITE_SUPABASE_URL in wrangler.toml" "grep -q 'VITE_SUPABASE_URL' wrangler.toml"
check_status "VITE_SUPABASE_PUBLISHABLE_KEY in wrangler.toml" "grep -q 'VITE_SUPABASE_PUBLISHABLE_KEY' wrangler.toml"
check_status "SUPABASE_SERVICE_ROLE_KEY in wrangler.toml" "grep -q 'SUPABASE_SERVICE_ROLE_KEY' wrangler.toml"
check_status "VITE_MERCADOPAGO_PUBLIC_KEY in wrangler.toml" "grep -q 'VITE_MERCADOPAGO_PUBLIC_KEY' wrangler.toml"
echo ""

echo -e "${BLUE}📊 Project Information${NC}"
MIGRATION_COUNT=$(ls supabase/migrations/*.sql 2>/dev/null | wc -l)
echo -e "${GREEN}✅${NC} Migrations ready: $MIGRATION_COUNT"

SUPABASE_PROJECT=$(npx supabase projects list --output json 2>/dev/null | jq -r '.[0].name' 2>/dev/null || echo "unknown")
echo -e "${GREEN}✅${NC} Supabase project: $SUPABASE_PROJECT"

SUPABASE_STATUS=$(npx supabase projects list --output json 2>/dev/null | jq -r '.[0].status' 2>/dev/null || echo "unknown")
echo -e "${GREEN}✅${NC} Project status: $SUPABASE_STATUS"

echo ""
echo -e "${BLUE}📈 Summary${NC}"
echo -e "Checks passed: ${GREEN}$PASSED${NC}"
echo -e "Checks failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ All checks passed! Ready to deploy.${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${BLUE}Deploy with:${NC}"
    echo "  bash scripts/deploy-cloudflare.sh"
    echo ""
    exit 0
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ Some checks failed. Please fix issues above.${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    exit 1
fi
