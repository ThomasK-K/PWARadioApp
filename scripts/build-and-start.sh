#!/bin/bash

# Build the application
echo "Building the application..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "Build failed. Please fix the errors and try again."
    exit 1
fi

echo "Build successful. Starting the application with Docker..."

# Start Docker Compose with HTTPS
docker-compose -f docker-compose-https.yml down
docker-compose -f docker-compose-https.yml up -d

echo "Die Anwendung ist gestartet und unter folgenden URLs erreichbar:"
echo "- https://localhost (443)"
echo "- https://127.0.0.1 (443)"
echo "- https://192.168.10.113 (443)"

echo "- HTTP-Port: 8080"
echo "Hinweis: Installieren Sie das Root-Zertifikat (./ssl/rootCA/rootCA.crt) in Ihrem Browser,"
echo "um Sicherheitswarnungen zu vermeiden."
echo "Um die Anwendung zu stoppen, führen Sie 'docker-compose -f docker-compose-https.yml down' aus."
