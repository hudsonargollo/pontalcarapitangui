#!/bin/bash

# Automated Deployment Script for Coco Loko Açaiteria
# This script handles git commit, push, build, and Cloudflare deployment

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting automated deployment...${NC}"
echo ""

# Check if there are changes to commit
if [[ -z $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  No changes to commit${NC}"
    echo "Skipping git operations..."
else
    # Get commit message from argument or use default
    COMMIT_MSG="${1:-feat: Update application}"
    
    echo -e "${YELLOW}📝 Committing changes...${NC}"
    git add -A
    git commit -m "$COMMIT_MSG"
    
    echo -e "${YELLOW}📤 Pushing to GitHub...${NC}"
    git push origin main
    
    echo -e "${GREEN}✅ Changes pushed to GitHub${NC}"
    echo ""
fi

# Build the application
echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed${NC}"
echo ""

# Deploy to Cloudflare Pages
echo -e "${YELLOW}☁️  Deploying to Cloudflare Pages...${NC}"
wrangler pages deploy dist --project-name=pontalcarapitangui --branch=main --commit-dirty=true

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo -e "  • GitHub: ${GREEN}✓${NC} Pushed to main branch"
echo -e "  • Build: ${GREEN}✓${NC} Application built"
echo -e "  • Cloudflare: ${GREEN}✓${NC} Deployed to Pages"
echo ""
echo -e "${BLUE}🌐 Your app is live at:${NC}"
echo -e "  Production: ${GREEN}https://pontalcarapitangui.pages.dev${NC}"
echo ""
echo -e "${YELLOW}💡 Tip: GitHub Actions will also deploy automatically${NC}"
echo ""
