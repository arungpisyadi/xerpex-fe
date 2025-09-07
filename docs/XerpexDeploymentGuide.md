# Xerpex Frontend Deployment Guide
## Deploying to Nginx on Ubuntu 22.04

### Table of Contents
- [Xerpex Frontend Deployment Guide](#xerpex-frontend-deployment-guide)
  - [Deploying to Nginx on Ubuntu 22.04](#deploying-to-nginx-on-ubuntu-2204)
    - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Prerequisites](#prerequisites)
  - [Installing Node.js and npm with NVM](#installing-nodejs-and-npm-with-nvm)
  - [Building the Application](#building-the-application)
  - [Server Setup](#server-setup)
    - [Update the System](#update-the-system)
    - [Install Nginx](#install-nginx)
    - [Configure Firewall (if enabled)](#configure-firewall-if-enabled)
  - [Nginx Configuration](#nginx-configuration)
    - [Create a New Server Block](#create-a-new-server-block)
    - [Enable the Server Block](#enable-the-server-block)
    - [Test Nginx Configuration](#test-nginx-configuration)
    - [Create the Web Directory](#create-the-web-directory)
  - [Deploying the Application](#deploying-the-application)
    - [Transfer Files to the Server](#transfer-files-to-the-server)
    - [Set Proper Permissions](#set-proper-permissions)
    - [Restart Nginx](#restart-nginx)
  - [SSL Configuration](#ssl-configuration)
  - [Continuous Deployment](#continuous-deployment)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues and Solutions](#common-issues-and-solutions)

---

## Introduction

This document provides step-by-step instructions for deploying the Xerpex frontend application to an Nginx web server running on Ubuntu 22.04. The guide covers the entire process from building the application to configuring Nginx and setting up SSL.

## Prerequisites

- Ubuntu 22.04 server with root or sudo access
- Domain name (optional, but recommended for production)
- Basic knowledge of Linux commands and Nginx

## Installing Node.js and npm with NVM

Node Version Manager (NVM) is recommended for installing and managing Node.js versions. Follow these steps to install NVM, Node.js, and npm on your Ubuntu 22.04 server:

```bash
# Install dependencies
sudo apt update
sudo apt install -y curl build-essential

# Download and install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Load NVM in the current session
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Verify NVM installation
nvm --version

# Install the latest LTS version of Node.js
nvm install --lts

# Verify Node.js and npm installation
node --version
npm --version

# Set the installed version as default
nvm alias default lts/*
```

You can also install a specific version of Node.js if your project requires it:

```bash
# Install a specific version
nvm install 16.20.0

# Use a specific version
nvm use 16.20.0
```

## Building the Application

Before deploying, you need to build the application for production:

```bash
# Navigate to your project directory
cd /path/to/xerpex-fe

# Install dependencies (if not already done)
npm install

# Build the application for production
npm run build
```

This will create a `dist` directory containing the compiled and optimized version of your application.

## Server Setup

### Update the System

```bash
sudo apt update
sudo apt upgrade -y
```

### Install Nginx

```bash
sudo apt install nginx -y
```

### Configure Firewall (if enabled)

```bash
sudo ufw allow 'Nginx HTTP'
sudo ufw allow 'Nginx HTTPS'
sudo ufw status
```

## Nginx Configuration

### Create a New Server Block

```bash
sudo nano /etc/nginx/sites-available/xerpex
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Replace with your domain or server IP

    root /var/www/xerpex;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;  # Important for SPA routing
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Disable caching for index.html
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        expires 0;
    }

    # Error pages
    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

### Enable the Server Block

```bash
sudo ln -s /etc/nginx/sites-available/xerpex /etc/nginx/sites-enabled/
```

### Test Nginx Configuration

```bash
sudo nginx -t
```

### Create the Web Directory

```bash
sudo mkdir -p /var/www/xerpex-staging
```

## Deploying the Application

### Transfer Files to the Server

You can use SCP, SFTP, or rsync to transfer the files from your local machine to the server:

```bash
# Using rsync (from your local machine)
rsync -avz --delete /path/to/xerpex-fe-staging/dist/ username@server-ip:/var/www/xerpex-staging/
```

Or if you're building directly on the server:

```bash
# Copy the dist directory to the web root
sudo cp -r /home/xerpex/xerpex-fe-staging/dist/* /var/www/xerpex-staging/
```

### Set Proper Permissions

```bash
sudo chown -R www-data:www-data /var/www/xerpex-staging
sudo chmod -R 755 /var/www/xerpex-staging
```

### Restart Nginx

```bash
sudo systemctl restart nginx
```

## SSL Configuration

For a secure HTTPS connection (recommended for production):

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain and install SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

## Continuous Deployment

For automated deployments, you could set up a simple deployment script:

```bash
#!/bin/bash
# deploy.sh

# Pull latest changes
cd xerpex-fe-staging
git pull origin kebunsu-project

# Install dependencies
npm install

# Build the application
npm run build

# Deploy to Nginx
sudo cp -r /home/xerpex/xerpex-fe-staging/dist/* /var/www/xerpex-staging/

# Set proper permissions
sudo chown -R www-data:www-data /var/www/xerpex-staging
```

Make the script executable:

```bash
chmod +x deploy.sh
```

## Troubleshooting

### Common Issues and Solutions

1. **404 Errors**: 
   - Make sure the `try_files $uri $uri/ /index.html;` directive is in your Nginx configuration to handle SPA routing.
   - Check that all files were properly copied to the web root.

2. **Permission Issues**: 
   - Check file permissions with `ls -la /var/www/xerpex/`.
   - Ensure Nginx has read access to all files.

3. **Nginx Logs**: 
   - Check error logs with `sudo tail -f /var/log/nginx/error.log`.
   - Check access logs with `sudo tail -f /var/log/nginx/access.log`.

4. **API Connection Issues**: 
   - If your frontend connects to a backend API, ensure CORS is properly configured.
   - Check that API endpoints are correctly set in your production build.

5. **Environment Variables**: 
   - If your app uses environment variables, make sure they're properly set in your production build.
   - Consider using a `.env.production` file for production-specific variables.

---

*This deployment guide was created for the Xerpex frontend application. For additional support or questions, please contact the development team.*