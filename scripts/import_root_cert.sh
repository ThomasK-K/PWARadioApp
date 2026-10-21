#!/bin/bash

# Farben für die Ausgabe
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Prüfen, ob das Root-CA-Zertifikat existiert
if [ ! -f "./ssl/rootCA/rootCA.crt" ]; then
    echo -e "${RED}Root CA Zertifikat nicht gefunden. Bitte zuerst 'create_root_cert.sh' ausführen.${NC}"
    exit 1
fi

# Detect the desktop environment and browser
if command -v firefox &> /dev/null; then
    BROWSER="firefox"
    echo -e "${YELLOW}Firefox erkannt${NC}"
elif command -v google-chrome &> /dev/null; then
    BROWSER="google-chrome"
    echo -e "${YELLOW}Google Chrome erkannt${NC}"
elif command -v chromium-browser &> /dev/null; then
    BROWSER="chromium-browser"
    echo -e "${YELLOW}Chromium erkannt${NC}"
else
    echo -e "${RED}Weder Firefox noch Chrome/Chromium wurde gefunden.${NC}"
    BROWSER="none"
fi

# Erklärung, wie man das Zertifikat importiert
echo -e "${GREEN}=====================================================${NC}"
echo -e "${GREEN}ROOT-ZERTIFIKAT IMPORT ANLEITUNG${NC}"
echo -e "${GREEN}=====================================================${NC}"
echo -e "Das Root-Zertifikat muss in Ihrem Browser installiert werden, damit HTTPS für"
echo -e "Ihre Entwicklungsumgebung ohne Warnungen funktioniert."
echo -e ""

if [ "$BROWSER" = "firefox" ]; then
    echo -e "${YELLOW}Firefox-Anleitung:${NC}"
    echo -e "1. Öffnen Sie Firefox"
    echo -e "2. Gehen Sie zu 'Einstellungen'"
    echo -e "3. Scrollen Sie nach unten zu 'Datenschutz & Sicherheit'"
    echo -e "4. Klicken Sie auf 'Zertifikate anzeigen'"
    echo -e "5. Wählen Sie den Tab 'Zertifizierungsstellen'"
    echo -e "6. Klicken Sie auf 'Importieren...'"
    echo -e "7. Wählen Sie die Datei: ${GREEN}$(realpath ./ssl/rootCA/rootCA.crt)${NC}"
    echo -e "8. Vertrauen Sie der CA zum Identifizieren von Websites"
    echo -e ""
    
    # Fragen, ob Firefox geöffnet werden soll
    read -p "Möchten Sie Firefox jetzt öffnen, um das Zertifikat zu importieren? (j/n) " choice
    case "$choice" in 
        j|J ) firefox "about:preferences#privacy" &;;
        * ) echo "Firefox wird nicht geöffnet.";;
    esac
    
elif [ "$BROWSER" = "google-chrome" ] || [ "$BROWSER" = "chromium-browser" ]; then
    echo -e "${YELLOW}Chrome/Chromium-Anleitung:${NC}"
    echo -e "1. Öffnen Sie Chrome/Chromium"
    echo -e "2. Gehen Sie zu 'Einstellungen'"
    echo -e "3. Suchen Sie nach 'Zertifikate'"
    echo -e "4. Klicken Sie auf 'Sicherheit > Zertifikate verwalten'"
    echo -e "5. Wählen Sie den Tab 'Authorities'"
    echo -e "6. Klicken Sie auf 'Importieren...'"
    echo -e "7. Wählen Sie die Datei: ${GREEN}$(realpath ./ssl/rootCA/rootCA.crt)${NC}"
    echo -e "8. Aktivieren Sie die Option 'Trust this certificate for identifying websites'"
    echo -e ""
    
    # Fragen, ob Chrome/Chromium geöffnet werden soll
    read -p "Möchten Sie Chrome/Chromium jetzt öffnen, um das Zertifikat zu importieren? (j/n) " choice
    case "$choice" in 
        j|J ) $BROWSER "chrome://settings/certificates" &;;
        * ) echo "Chrome/Chromium wird nicht geöffnet.";;
    esac
    
else
    echo -e "${YELLOW}Allgemeine Anleitung:${NC}"
    echo -e "1. Öffnen Sie Ihren Browser"
    echo -e "2. Navigieren Sie zu den Sicherheitseinstellungen"
    echo -e "3. Suchen Sie die Option zum Importieren von Zertifikaten"
    echo -e "4. Importieren Sie das Zertifikat aus: ${GREEN}$(realpath ./ssl/rootCA/rootCA.crt)${NC}"
    echo -e "5. Markieren Sie das Zertifikat als vertrauenswürdig für Websites"
fi

echo -e "${GREEN}=====================================================${NC}"
echo -e "Nach dem Import müssen Sie möglicherweise Ihren Browser neu starten."
echo -e "Anschließend sollte Ihre HTTPS-Entwicklungsumgebung ohne Warnungen funktionieren."
echo -e "${GREEN}=====================================================${NC}"

# Zeige Details des Root-Zertifikats an
echo -e "\n${YELLOW}Details des Root-Zertifikats:${NC}"
if command -v openssl &> /dev/null; then
    echo -e "\n${GREEN}Zertifikats-Informationen:${NC}"
    openssl x509 -in ./ssl/rootCA/rootCA.crt -text -noout | grep -E "Issuer:|Subject:|Not Before:|Not After :|Subject Alternative Name:"
    
    echo -e "\n${GREEN}Fingerprint (SHA-256):${NC}"
    openssl x509 -in ./ssl/rootCA/rootCA.crt -fingerprint -sha256 -noout
    
    echo -e "\n${GREEN}Vollständige Zertifikatskette überprüfen:${NC}"
    echo -e "Das Root-CA-Zertifikat ist selbstsigniert, daher ist es der Anfang der Kette.\n"
else
    echo -e "${RED}OpenSSL ist nicht installiert. Zertifikatsdetails können nicht angezeigt werden.${NC}"
fi

# Option zum Anzeigen des vollständigen Zertifikats
read -p "Möchten Sie das vollständige Zertifikat anzeigen? (j/n) " show_full
if [[ "$show_full" =~ ^[jJ]$ ]]; then
    if command -v openssl &> /dev/null; then
        echo -e "\n${GREEN}Vollständiges Zertifikat:${NC}"
        openssl x509 -in ./ssl/rootCA/rootCA.crt -text -noout
    else
        echo -e "${RED}OpenSSL ist nicht installiert. Das vollständige Zertifikat kann nicht angezeigt werden.${NC}"
    fi
fi
