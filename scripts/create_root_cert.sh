#!/bin/bash

# Colors for output
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Creating Root Certificate Authority and Server Certificates${NC}"

# Create directories for certificates
mkdir -p ./ssl/rootCA

# Check if certificates exist, otherwise generate them
if [ ! -f "./ssl/rootCA/rootCA.key" ] || [ ! -f "./ssl/rootCA/rootCA.crt" ]; then
    echo "SSL-Zertifikate nicht gefunden. Generiere Root CA und Server-Zertifikate..."

    # Generate Root CA private key
    echo -e "${YELLOW}Generating Root CA private key...${NC}"
    openssl genrsa -out ./ssl/rootCA/rootCA.key 4096

    # Generate Root CA certificate
    echo -e "${YELLOW}Generating Root CA certificate...${NC}"
    openssl req -x509 -new -nodes -key ./ssl/rootCA/rootCA.key -sha256 -days 1024 -out ./ssl/rootCA/rootCA.crt \
        -subj "/C=DE/ST=State/L=City/O=RadiopApp/CN=RadioApp Root CA" \
        -addext "basicConstraints=critical,CA:TRUE"

    # Create configuration for server certificate
    cat >./ssl/server.conf <<EOF
            [req]
            default_bits = 2048
            prompt = no
            default_md = sha256
            distinguished_name = dn
            req_extensions = req_ext

            [dn]
            C=DE
            ST=State
            L=City
            O=RadioApp
            CN=localhost

            [req_ext]
            subjectAltName = @alt_names

            [alt_names]
            DNS.1 = localhost
            IP.1 = 127.0.0.1
            IP.2 = 192.168.10.113
            IP.3 = 192.168.10.152
            IP.4 = 192.168.10.161
            IP.5 = 192.168.10.162
EOF

else
    echo -e "${GREEN}Bestehendes ROOT-Zertifikate gefunden.${NC}"
fi

# Generate server private key
echo -e "${YELLOW}Generating server private key...${NC}"
openssl genrsa -out ./ssl/radioapp.key 2048

# Generate server CSR (Certificate Signing Request)
echo -e "${YELLOW}Generating server CSR...${NC}"
openssl req -new -key ./ssl/radioapp.key -out ./ssl/radioapp.csr -config ./ssl/server.conf

# Create extension config file for the server certificate
cat >./ssl/v3.ext <<EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
IP.1 = 127.0.0.1
IP.2 = 192.168.10.113
IP.3 = 192.168.10.152
IP.4 = 192.168.10.161
IP.5 = 192.168.10.162
EOF

# Sign the server certificate with our Root CA
echo -e "${YELLOW}Signing server certificate with Root CA...${NC}"
openssl x509 -req -in ./ssl/radioapp.csr -CA ./ssl/rootCA/rootCA.crt -CAkey ./ssl/rootCA/rootCA.key \
    -CAcreateserial -out ./ssl/radioapp.crt -days 365 -sha256 \
    -extfile ./ssl/v3.ext

# Verify the certificate
echo -e "${YELLOW}Verifying certificate...${NC}"
openssl x509 -in ./ssl/radioapp.crt -text -noout

# Create a combined PEM file for services that need cert and key in one file
echo -e "${YELLOW}Creating combined PEM file...${NC}"
cat ./ssl/radioapp.crt ./ssl/radioapp.key >./ssl/radioapp.pem

# Copy certificates to the certs directory for development use
echo -e "${YELLOW}Copying certificates to certs directory...${NC}"
cp ./ssl/radioapp.crt ./certs/
cp ./ssl/radioapp.key ./certs/
cp ./ssl/radioapp.pem ./certs/

# Set proper permissions
chmod 400 ./ssl/radioapp.key ./certs/radioapp.key
chmod 444 ./ssl/radioapp.crt ./certs/radioapp.crt ./ssl/radioapp.pem ./certs/radioapp.pem

echo -e "${GREEN}Certificate generation complete!${NC}"
echo -e "${GREEN}Root CA: ./ssl/rootCA/rootCA.crt${NC}"
echo -e "${GREEN}Server Certificate: ./ssl/radioapp.crt${NC}"
echo -e "${GREEN}Server Key: ./ssl/radioapp.key${NC}"
echo -e "${GREEN}Combined PEM: ./ssl/radioapp.pem${NC}"
echo ""
echo -e "${YELLOW}Important: Install the Root CA (./ssl/rootCA/rootCA.crt) in your browser to trust the server certificates.${NC}"
