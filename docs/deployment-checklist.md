# 배포 체크리스트

## 🚀 배포 준비

### 1. 프로덕션 빌드
- [ ] **빌드 최적화**
  ```bash
  # 프로덕션 빌드
  npm run build
  
  # 빌드 결과 확인
  ls -la dist/
  
  # 번들 크기 분석
  npm run build:analyze
  ```

- [ ] **환경 변수 설정**
  ```bash
  # .env.production
  VITE_APP_TITLE=Oh Music Player
  VITE_API_URL=https://api.example.com
  VITE_AUDIO_BASE_URL=https://cdn.example.com/audio/
  VITE_DEBUG=false
  VITE_LOG_LEVEL=error
  ```

### 2. 정적 파일 최적화
- [ ] **이미지 최적화**
  ```bash
  # 이미지 압축
  npm install --save-dev imagemin imagemin-mozjpeg imagemin-pngquant
  
  # WebP 변환
  npm install --save-dev imagemin-webp
  ```

- [ ] **오디오 파일 최적화**
  ```bash
  # 오디오 파일 압축
  npm install --save-dev ffmpeg-static
  
  # 스크립트 예시
  #!/bin/bash
  for file in public/audio/*.mp3; do
    ffmpeg -i "$file" -c:a libmp3lame -b:a 128k "public/audio/compressed/$(basename "$file")"
  done
  ```

## 🌐 Nginx 설정

### 1. 기본 Nginx 설정
- [ ] **메인 설정 파일**
  ```nginx
  # /etc/nginx/nginx.conf
  user nginx;
  worker_processes auto;
  error_log /var/log/nginx/error.log warn;
  pid /var/run/nginx.pid;

  events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
  }

  http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # 로그 형식
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    # 성능 최적화
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip 압축
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
      text/plain
      text/css
      text/xml
      text/javascript
      application/json
      application/javascript
      application/xml+rss
      application/atom+xml
      image/svg+xml;

    # 보안 헤더
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    include /etc/nginx/conf.d/*.conf;
  }
  ```

### 2. 사이트별 설정
- [ ] **오디오 플레이어 사이트 설정**
  ```nginx
  # /etc/nginx/sites-available/oh-music-player
  server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /var/www/oh-music-player;
    index index.html;

    # 캐싱 설정
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
      expires 1y;
      add_header Cache-Control "public, immutable";
      access_log off;
    }

    # 오디오 파일 캐싱
    location ~* \.(mp3|ogg|wav|aac)$ {
      expires 1M;
      add_header Cache-Control "public";
      add_header Accept-Ranges bytes;
    }

    # API 프록시
    location /api/ {
      proxy_pass http://localhost:8000/;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_cache_bypass $http_upgrade;
    }

    # SPA 라우팅
    location / {
      try_files $uri $uri/ /index.html;
    }

    # 보안 설정
    location ~ /\. {
      deny all;
    }

    # 에러 페이지
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
  }
  ```

### 3. 성능 최적화
- [ ] **캐싱 전략**
  ```nginx
  # 브라우저 캐싱
  location ~* \.(js|css)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary Accept-Encoding;
  }

  # 이미지 캐싱
  location ~* \.(png|jpg|jpeg|gif|ico|svg|webp)$ {
    expires 1y;
    add_header Cache-Control "public";
  }

  # 폰트 캐싱
  location ~* \.(woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public";
    add_header Access-Control-Allow-Origin *;
  }
  ```

## 🔒 SSL 인증서 설정

### 1. Let's Encrypt 설정
- [ ] **Certbot 설치**
  ```bash
  # Ubuntu/Debian
  sudo apt update
  sudo apt install certbot python3-certbot-nginx

  # CentOS/RHEL
  sudo yum install certbot python3-certbot-nginx
  ```

- [ ] **SSL 인증서 발급**
  ```bash
  # 도메인 인증서 발급
  sudo certbot --nginx -d your-domain.com -d www.your-domain.com

  # 자동 갱신 설정
  sudo crontab -e
  # 다음 줄 추가:
  # 0 12 * * * /usr/bin/certbot renew --quiet
  ```

### 2. SSL 설정 최적화
- [ ] **HTTPS 강제 리다이렉트**
  ```nginx
  # HTTP를 HTTPS로 리다이렉트
  server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
  }

  server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL 설정
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL 보안 설정
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS 설정
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # 나머지 설정...
  }
  ```

## 📱 PWA 설정

### 1. Service Worker 설정
- [ ] **Service Worker 등록**
  ```typescript
  // public/sw.js
  const CACHE_NAME = 'oh-music-player-v1';
  const urlsToCache = [
    '/',
    '/static/js/bundle.js',
    '/static/css/main.css',
    '/manifest.json',
    '/audio/tracks/',
  ];

  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(urlsToCache))
    );
  });

  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request);
        })
    );
  });
  ```

- [ ] **Manifest 파일**
  ```json
  // public/manifest.json
  {
    "name": "Oh Music Player",
    "short_name": "Oh Music",
    "description": "Modern music player application",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#3b82f6",
    "icons": [
      {
        "src": "/icons/icon-192x192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/icons/icon-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ]
  }
  ```

## 🔧 배포 스크립트

### 1. 자동화 배포
- [ ] **배포 스크립트**
  ```bash
  #!/bin/bash
  # deploy.sh

  set -e

  echo "🚀 배포 시작..."

  # 빌드
  echo "📦 프로덕션 빌드 중..."
  npm run build

  # 빌드 결과 확인
  if [ ! -d "dist" ]; then
    echo "❌ 빌드 실패"
    exit 1
  fi

  # 서버에 배포
  echo "🌐 서버에 배포 중..."
  rsync -avz --delete dist/ user@your-server:/var/www/oh-music-player/

  # Nginx 설정 리로드
  echo "🔄 Nginx 설정 리로드 중..."
  ssh user@your-server "sudo nginx -t && sudo systemctl reload nginx"

  echo "✅ 배포 완료!"
  ```

### 2. CI/CD 파이프라인
- [ ] **GitHub Actions 워크플로우**
  ```yaml
  # .github/workflows/deploy.yml
  name: Deploy

  on:
    push:
      branches: [ main ]

  jobs:
    deploy:
      runs-on: ubuntu-latest

      steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:coverage

      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}

      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/oh-music-player
            git pull origin main
            npm ci
            npm run build
            sudo nginx -t && sudo systemctl reload nginx
  ```

## 📊 모니터링

### 1. 로그 모니터링
- [ ] **Nginx 로그 설정**
  ```nginx
  # 로그 형식 정의
  log_format detailed '$remote_addr - $remote_user [$time_local] '
                     '"$request" $status $body_bytes_sent '
                     '"$http_referer" "$http_user_agent" '
                     '$request_time $upstream_response_time';

  # 액세스 로그
  access_log /var/log/nginx/access.log detailed;
  error_log /var/log/nginx/error.log warn;
  ```

- [ ] **로그 로테이션**
  ```bash
  # /etc/logrotate.d/nginx
  /var/log/nginx/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 nginx nginx
    postrotate
      if [ -f /var/run/nginx.pid ]; then
        kill -USR1 `cat /var/run/nginx.pid`
      fi
    endscript
  }
  ```

### 2. 성능 모니터링
- [ ] **성능 메트릭 수집**
  ```bash
  # Nginx 상태 모니터링
  location /nginx_status {
    stub_status on;
    access_log off;
    allow 127.0.0.1;
    deny all;
  }
  ```

- [ ] **헬스 체크**
  ```bash
  #!/bin/bash
  # health-check.sh

  # 웹사이트 가용성 확인
  if curl -f http://localhost/ > /dev/null 2>&1; then
    echo "✅ 웹사이트 정상"
  else
    echo "❌ 웹사이트 오류"
    exit 1
  fi

  # SSL 인증서 만료일 확인
  expiry=$(echo | openssl s_client -servername your-domain.com -connect your-domain.com:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
  echo "SSL 인증서 만료일: $expiry"
  ```

## 🔒 보안 설정

### 1. 방화벽 설정
- [ ] **UFW 설정**
  ```bash
  # 방화벽 활성화
  sudo ufw enable

  # 기본 정책 설정
  sudo ufw default deny incoming
  sudo ufw default allow outgoing

  # SSH 허용
  sudo ufw allow ssh

  # HTTP/HTTPS 허용
  sudo ufw allow 80
  sudo ufw allow 443

  # 방화벽 상태 확인
  sudo ufw status
  ```

### 2. 보안 헤더
- [ ] **보안 헤더 설정**
  ```nginx
  # 보안 헤더 추가
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "no-referrer-when-downgrade" always;
  add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; media-src 'self' blob:;" always;
  add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
  ```

## 🔄 백업 및 복구

### 1. 자동 백업
- [ ] **백업 스크립트**
  ```bash
  #!/bin/bash
  # backup.sh

  BACKUP_DIR="/backup/oh-music-player"
  DATE=$(date +%Y%m%d_%H%M%S)

  # 백업 디렉토리 생성
  mkdir -p $BACKUP_DIR

  # 웹 파일 백업
  tar -czf $BACKUP_DIR/web_$DATE.tar.gz /var/www/oh-music-player

  # Nginx 설정 백업
  tar -czf $BACKUP_DIR/nginx_$DATE.tar.gz /etc/nginx

  # SSL 인증서 백업
  tar -czf $BACKUP_DIR/ssl_$DATE.tar.gz /etc/letsencrypt

  # 30일 이상 된 백업 삭제
  find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

  echo "백업 완료: $DATE"
  ```

### 2. 복구 절차
- [ ] **복구 스크립트**
  ```bash
  #!/bin/bash
  # restore.sh

  if [ -z "$1" ]; then
    echo "사용법: $0 <백업_날짜>"
    exit 1
  fi

  BACKUP_DATE=$1
  BACKUP_DIR="/backup/oh-music-player"

  echo "복구 시작: $BACKUP_DATE"

  # 웹 파일 복구
  tar -xzf $BACKUP_DIR/web_$BACKUP_DATE.tar.gz -C /

  # Nginx 설정 복구
  tar -xzf $BACKUP_DIR/nginx_$BACKUP_DATE.tar.gz -C /

  # SSL 인증서 복구
  tar -xzf $BACKUP_DIR/ssl_$BACKUP_DATE.tar.gz -C /

  # Nginx 재시작
  sudo nginx -t && sudo systemctl reload nginx

  echo "복구 완료"
  ```

---

*이 체크리스트는 Nginx와 SSL을 활용하여 안전하고 성능 좋은 오디오 플레이어 애플리케이션을 배포하기 위한 가이드입니다.* 