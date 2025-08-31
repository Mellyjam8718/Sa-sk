#!/bin/bash

# Replace these variables with your actual domain and landing page path
DOMAIN="www.mydomain.net"
LANDING_PAGE="/landingpage"
SPECIAL_PATH="/saskteluserauthenticationshhsyf6fsdkajknk"

# Update and install nginx and certbot
echo "Updating packages and installing Nginx and Certbot..."
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

# Start and enable nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Create a basic Nginx server block for your domain
NGINX_CONF="/etc/nginx/sites-available/$DOMAIN"

echo "Creating Nginx config for $DOMAIN..."

sudo bash -c "cat > $NGINX_CONF" <<EOL
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    location = $SPECIAL_PATH {
        return 302 $LANDING_PAGE;
    }

    location / {
        # Serve your landing page or proxy_pass here
        # For example, serve static files from /var/www/html
        root /var/www/html;
        index index.html index.htm;
    }
}
EOL

# Enable the site by linking to sites-enabled
sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/

# Test nginx config and reload
sudo nginx -t && sudo systemctl reload nginx

# Obtain SSL certificate with Certbot and configure Nginx automatically
echo "Obtaining Let's Encrypt SSL certificate for $DOMAIN..."
sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m your-email@example.com --redirect

# Certbot will automatically modify your Nginx config to listen on 443 and redirect HTTP to HTTPS

echo "Setup complete!"
echo "Visit https://$DOMAIN$SPECIAL_PATH to test the redirect."