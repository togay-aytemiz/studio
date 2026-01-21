#!/bin/bash

# Configuration
API_BASE_URL="https://tryon-api-production-657d.up.railway.app"
API_KEY="${TRYON_API_KEY}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "🔍 Try-On API Debug Tool"
echo "========================"

if [ -z "$API_KEY" ]; then
    echo -e "${RED}Error: TRYON_API_KEY environment variable is not set.${NC}"
    echo "Please export it or paste it below:"
    read -r API_KEY
    if [ -z "$API_KEY" ]; then
        echo "API Key is required."
        exit 1
    fi
fi

echo "Found API Key."

# Ask for image paths
echo "Please provide paths to the images (absolute or relative):"
read -p "Garment Image Path: " GARMENT_PATH
read -p "Body Image Path: " BODY_PATH

if [ ! -f "$GARMENT_PATH" ]; then
    echo -e "${RED}Error: Garment file not found at $GARMENT_PATH${NC}"
    exit 1
fi

if [ ! -f "$BODY_PATH" ]; then
    echo -e "${RED}Error: Body file not found at $BODY_PATH${NC}"
    exit 1
fi

echo "🚀 Sending request to $API_BASE_URL/api/v1/try-on..."

# Use curl to send the request
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_BASE_URL/api/v1/try-on" \
  -H "x-api-key: $API_KEY" \
  -F "garment=@$GARMENT_PATH" \
  -F "body=@$BODY_PATH")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "------------------------"
echo "Status Code: $HTTP_CODE"
echo "Response Body:"
echo "$BODY"
echo "------------------------"

if [ "$HTTP_CODE" -eq 202 ]; then
    echo -e "${GREEN}✅ Success! Upstream API is working correctly.${NC}"
    echo "The issue is likely in the Netlify Proxy."
else
    echo -e "${RED}❌ Failed! Upstream API returned an error.${NC}"
    echo "The issue is likely with the Upstream API or the API Key/Images."
fi
