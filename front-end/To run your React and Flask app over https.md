To run your React and Flask app over https, you need to enable SSL on Nginx. Follow the below steps to achieve that:

1. **Get a SSL certificate for your domain name:**

   You can get a free SSL certificate from Let's Encrypt. Certbot is a free and automated way to set up SSL certificates on a server. Install Certbot and its Nginx plugin using:

   ```
   sudo dnf install certbot python3-certbot-nginx
   ```

2. **Generate the SSL certificate** 

   Run the following command to automatically get a certificate and configure Nginx:

   ```
   sudo certbot --nginx
   ```

   This command will interactively ask some questions including the domain name. After successfully obtaining the certificates, Nginx will automatically install the certificates and make necessary modifications to its configuration files. 

3. **Open and Edit Nginx’s Configuration File**

   Based on your previous configuration, add new `server` block inside the `http` block which will redirect http traffic to https (optional step based on requirement):

   ```
   server {
           listen 80;
           server_name your_domain www.your_domain;
           return 301 https://$server_name$request_uri;
   }
   ```

   Your https `server` block should look something like this:

   ```
   server {
           listen [::]:443 ssl http2;
           listen 443 ssl http2;
           server_name your_domain www.your_domain;

           ssl_certificate /etc/letsencrypt/live/your_domain/fullchain.pem;
           ssl_certificate_key /etc/letsencrypt/live/your_domain/privkey.pem;

           location / {
                   proxy_pass "http://127.0.0.1:3000/"; #React App
           }
   }

   server {
           listen [::]:443 ssl http2;
           listen 443 ssl http2;
           server_name api.your_domain www.api.your_domain;

           ssl_certificate /etc/letsencrypt/live/your_domain/fullchain.pem;
           ssl_certificate_key /etc/letsencrypt/live/your_domain/privkey.pem;

           location / {
                   proxy_pass "http://127.0.0.1:5000/"; #Flask App
           }
   }
   ```

4. **Confirm and Reload Your Nginx Configuration**

   With the new `server` block in place, you can test to make sure your configuration file has correct syntax:

   ```
   sudo nginx -t
   ```

   If there are no error messages, it means the configuration file syntax is correct, and you can reload your Nginx to implement the change:

   ```
   sudo systemctl reload nginx
   ```

That's it. You should now be able to access your React and Flask apps over https. Keep in mind that you'll need to renew the SSL certificates every 90 days, but Certbot can do this automatically. Check out this guide on how to setup auto-renew for the SSL certificates.