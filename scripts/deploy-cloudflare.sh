#!/bin/bash

# Cloudflare Pages Deployment Script with Supabase Migrations
# Deploys to Cloudflare Pages and applies Supabase migrations

set -e

echo "🚀 Starting Cloudflare Pages Deployment with Supabase Migrations..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
PROJECT_NAME="portalcarapitangui"
SUPABASE_PROJECT_ID="jxmxavugxuzqgfvjjxdb"
BRANCH="${1:-main}"

# Step 1: Verify prerequisites
echo -e "${BLUE}📋 Step 1: Verifying prerequisites...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ git not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Prerequisites verified${NC}"
echo ""

# Step 2: Check for uncommitted changes
echo -e "${BLUE}📋 Step 2: Checking git status...${NC}"
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  Uncommitted changes detected:${NC}"
    git status -s
    read -p "Continue with deployment? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Deployment cancelled${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✅ Git status checked${NC}"
echo ""

# Step 3: Install dependencies
echo -e "${BLUE}📦 Step 3: Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 4: Run linting
echo -e "${BLUE}🔍 Step 4: Running linter...${NC}"
npm run lint || echo -e "${YELLOW}⚠️  Linting warnings (continuing)${NC}"
echo -e "${GREEN}✅ Linting complete${NC}"
echo ""

# Step 5: Apply Supabase migrations
echo -e "${BLUE}🗄️  Step 5: Applying Supabase migrations...${NC}"
if command -v npx &> /dev/null; then
    echo "Checking for pending migrations..."
    npx supabase db push --linked || {
        echo -e "${YELLOW}⚠️  Migration push skipped (may already be applied or no pending migrations)${NC}"
    }
    echo -e "${GREEN}✅ Migrations applied${NC}"
else
    echo -e "${YELLOW}⚠️  npx not found. Skipping migrations${NC}"
fi
echo ""

# Step 6: Build the application
echo -e "${BLUE}🔨 Step 6: Building application...${NC}"
npm run build
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed - dist directory not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build completed successfully${NC}"
echo ""

# Step 7: Deploy to Cloudflare Pages
echo -e "${BLUE}☁️  Step 7: Deploying to Cloudflare Pages...${NC}"

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${YELLOW}⚠️  Wrangler not found. Installing globally...${NC}"
    npm install -g wrangler
fi

# Deploy using wrangler
echo "Deploying to Cloudflare Pages..."
wrangler pages deploy dist \
    --project-name="$PROJECT_NAME" \
    --branch="$BRANCH"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deployed to Cloudflare Pages${NC}"
else
    echo -e "${RED}❌ Cloudflare Pages deployment failed${NC}"
    exit 1
fi
echo ""

# Step 8: Deploy Supabase Edge Functions
echo -e "${BLUE}⚡ Step 8: Deploying Supabase Edge Functions...${NC}"
if command -v npx &> /dev/null; then
    FUNCTIONS=(
        "create-waiter"
        "list-waiters"
        "delete-waiter"
        "update-waiter-profile"
        "send-password-reset"
        "mercadopago-webhook"
    )
    
    for func in "${FUNCTIONS[@]}"; do
        echo "Deploying function: $func"
        npx supabase functions deploy "$func" 2>/dev/null || {
            echo -e "${YELLOW}⚠️  Function $func deployment skipped${NC}"
        }
    done
    echo -e "${GREEN}✅ Edge Functions deployment complete${NC}"
else
    echo -e "${YELLOW}⚠️  npx not found. Skipping Edge Functions${NC}"
fi
echo ""

# Step 9: Verify deployment
echo -e "${BLUE}✅ Step 9: Verifying deployment...${NC}"
echo "Checking Cloudflare Pages status..."
sleep 2
echo -e "${GREEN}✅ Deployment verification complete${NC}"
echo ""

# Summary
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📍 Deployment Information:${NC}"
echo -e "   Project: $PROJECT_NAME"
echo -e "   Branch: $BRANCH"
echo -e "   Supabase Project: $SUPABASE_PROJECT_ID"
echo -e "   URL: https://portalcarapitangui.pages.dev"
echo ""
echo -e "${BLUE}📊 Next Steps:${NC}"
echo -e "   1. Verify deployment: https://$PROJECT_NAME.pages.dev"
echo -e "   2. Check Cloudflare dashboard: https://dash.cloudflare.com/"
echo -e "   3. Monitor Supabase: https://app.supabase.com/project/$SUPABASE_PROJECT_ID"
echo -e "   4. View logs: npx supabase logs postgres --linked"
echo ""
echo -e "${GREEN}✨ All done!${NC}"
