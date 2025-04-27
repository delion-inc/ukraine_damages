#!/bin/bash

# Параметри
domains=(ukrainedr.com)
email="one3121man@gmail.com"
staging=0 # Змініть на 1 для тестування

# Створюємо правильну структуру директорій
echo "Створення структури директорій..."
mkdir -p nginx/conf.d
mkdir -p certbot/conf
mkdir -p certbot/www

# Встановлюємо правильні права доступу
echo "Встановлення прав доступу..."
chmod -R 755 nginx
chmod -R 755 certbot

# Видаляємо попередні сертифікати
echo "Очищення попередніх сертифікатів..."
rm -rf certbot/conf/live/
rm -rf certbot/conf/archive/

# Створюємо конфігурацію nginx
echo "Створення конфігурації nginx..."
cat > nginx/conf.d/default.conf << 'EOF'
server {
    listen 80;
    server_name ukrainedr.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://frontend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://backend:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /ai {
        proxy_pass http://ai_service:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

# Зберігаємо копію конфігурації
cp nginx/conf.d/default.conf nginx/conf.d/default.conf.bak

# Перевіряємо наявність файлів
echo "Перевірка файлів..."
if [ ! -f nginx/conf.d/default.conf ]; then
    echo "Помилка: файл конфігурації nginx не створено"
    exit 1
fi

# Зупиняємо контейнери
echo "Зупинка контейнерів..."
docker compose down

# Запускаємо nginx
echo "Запуск nginx..."
docker compose up -d nginx

# Очікуємо запуску nginx
echo "Чекаємо запуску nginx..."
sleep 5

# Отримуємо сертифікат
if [ $staging != "0" ]; then
    staging_arg="--staging"
else
    staging_arg=""
fi

echo "Отримання сертифікату..."
docker compose run --rm certbot certonly \
    $staging_arg \
    --webroot -w /var/www/certbot \
    --email $email \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d ${domains[0]}

# Перевіряємо успішність отримання сертифікату
if [ $? -ne 0 ]; then
    echo "Помилка: не вдалося отримати сертифікат"
    exit 1
fi

# Відновлюємо конфігурацію з SSL
echo "Налаштування SSL..."
cat > nginx/conf.d/default.conf << 'EOF'
server {
    listen 80;
    server_name ukrainedr.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name ukrainedr.com;

    ssl_certificate /etc/letsencrypt/live/ukrainedr.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ukrainedr.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    location / {
        proxy_pass http://frontend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://backend:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /ai {
        proxy_pass http://ai_service:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

# Перезапускаємо nginx
echo "Перезапуск nginx..."
docker compose restart nginx

echo "Ініціалізація завершена!"