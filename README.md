Paso 1 crear 

nano install_qb.sh

Paso 2 Aplicar

#!/bin/bash
set -e

echo "========================================"
echo "  INSTALADOR QUINTILLISAS BOTS — v2.0"
echo "========================================"

# ===============================
# CONFIGURACIÓN
# ===============================
DOMAIN="bot.nmiku.site"
WEBROOT="/var/www/Web"
REPO_URL="https://github.com/The-DiosBot-MD/Web2"

echo "[1/15] Actualizando e instalando dependencias básicas..."
apt update -y && apt upgrade -y
apt install -y git curl nginx ufw software-properties-common

# ===============================
# INSTALAR NODE.JS + YARN + PM2
# ===============================
echo "[2/15] Instalando Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

echo "[3/15] Instalando Yarn y PM2..."
npm install -g yarn pm2

# ===============================
# CLONAR EL REPO
# ===============================
echo "[4/15] Clonando repo $REPO_URL ..."
rm -rf /tmp/web_clone
git clone $REPO_URL /tmp/web_clone

echo "[5/15] Copiando carpeta Web/"
rm -rf $WEBROOT
mkdir -p $WEBROOT
cp -r /tmp/web_clone/Web/* $WEBROOT

# ===============================
# APLICAR PERMISOS
# ===============================
echo "[6/15] Aplicando permisos a $WEBROOT..."
chown -R www-data:www-data $WEBROOT
chmod -R 777 $WEBROOT

# ===============================
# INSTALAR DEPENDENCIAS BACKEND
# ===============================
echo "[7/15] Instalando dependencias backend..."
cd $WEBROOT/server
npm install
yarn install || true  # por si no hay yarn.lock

# ===============================
# CONFIGURAR PM2
# ===============================
echo "[8/15] Iniciando backend con PM2..."
pm2 delete qb_backend || true
pm2 start src/server.js --name qb_backend
pm2 save

# ===============================
# CONFIGURAR FIREWALL (opcional)
# ===============================
ufw allow 'Nginx Full'

# ===============================
# CONFIGURAR NGINX
# ===============================
echo "[9/15] Configurando Nginx para $DOMAIN..."

NGINX_PATH="/etc/nginx/sites-available/$DOMAIN"

cat > $NGINX_PATH <<EOF
server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name $DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root $WEBROOT;
    index /views/index.html;

    client_max_body_size 1024M;

    location / {
        try_files \$uri \$uri/ /views/index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    location /ws {
        proxy_pass http://localhost:3001/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location ~ /\. {
        deny all;
    }
}
EOF

ln -sf $NGINX_PATH /etc/nginx/sites-enabled/

echo "[10/15] Probando Nginx..."
nginx -t
systemctl reload nginx

# ===============================
# SSL CERTBOT
# ===============================
echo "[11/15] Instalando Certbot..."
apt install -y certbot python3-certbot-nginx

echo "[12/15] Generando SSL automático..."
certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN

# ===============================
# LIMPIEZA FINAL
# ===============================
echo "[13/15] Limpiando archivos temporales..."
rm -rf /tmp/web_clone

# ===============================
# FIN
# ===============================
echo "========================================"
echo " INSTALACIÓN COMPLETA 🎉✨"
echo " Web lista en: https://$DOMAIN"
echo " Backend funcionando con PM2"
echo " Archivos clonados de $REPO_URL"
echo "========================================"

paso 3 Aplicar permisos

chmod +x install_qb.sh

Paso 4 Ejecutar

./install_qb.sh
