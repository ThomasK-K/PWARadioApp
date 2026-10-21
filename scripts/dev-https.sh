#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if certificates exist
if [ ! -f "./ssl/radioapp.crt" ] || [ ! -f "./ssl/radioapp.key" ]; then
    echo -e "${YELLOW}SSL certificates not found. Generating them...${NC}"
    ./create_root_cert.sh
else
    echo -e "${GREEN}SSL certificates found.${NC}"
fi

# Create a .env file for Vite to use HTTPS
#cat > .env << EOF
#HTTPS=true
#VITE_USE_SSL=true
#SSL_CRT_FILE=./ssl/radioapp.crt
#SSL_KEY_FILE=./ssl/radioapp.key
#EOF

echo -e "${GREEN}Starting development server with HTTPS support...${NC}"
echo -e "The application will be available at:"
echo -e "- http://localhost:3001"

# Start Docker Compose with development environment
docker-compose -f docker-compose-https.yml down
docker-compose -f docker-compose-https.yml up app-dev

echo -e "${YELLOW}Development server stopped.${NC}"


