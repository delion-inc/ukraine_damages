#!/bin/bash

# Створіть цей файл як init-letsencrypt.sh і зробіть його виконуваним:
# chmod +x init-letsencrypt.sh

# Параметри
domains=(ukrainedr.com)
email="one3121man@gmail.com"
staging=0 # Змініть на 1 для тестування

# Створюємо необхідні директорії
mkdir -p certbot/conf
mkdir -p certbot/www

# Видаляємо попередні сертифікати
rm -rf certbot/conf/live/
rm -rf certbot/conf/archive/

# Створюємо тимчасову конфігурацію nginx
cat > nginx/conf.d/app.conf.template << 'EOF'
server {
    listen 80;
    server_name ukrainedr.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

# Копіюємо повну конфігурацію
cp nginx/conf.d/app.conf nginx/conf.d/app.conf.full
cp nginx/conf.d/app.conf.template nginx/conf.d/app.conf

# Запускаємо nginx
docker-compose up --force-recreate -d nginx

# Очікуємо запуску nginx
echo "Чекаємо запуску nginx..."
sleep 5

# Отримуємо сертифікат
if [ $staging != "0" ]; then
    staging_arg="--staging"
else
    staging_arg=""
fi

docker-compose run --rm certbot certonly \
    $staging_arg \
    --webroot -w /var/www/certbot \
    --email $email \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d ${domains[0]}

# Відновлюємо повну конфігурацію
mv nginx/conf.d/app.conf.full nginx/conf.d/app.conf

# Перезапускаємо nginx
docker-compose restart nginx

echo "Ініціалізація завершена!"