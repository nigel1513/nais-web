# NAIS Web

국가과학AI연구센터(NAIS) 홈페이지 프론트엔드.

- 설계 명세: [docs/superpowers/specs/2026-09-30-nais-homepage-design.md](docs/superpowers/specs/2026-09-30-nais-homepage-design.md)
- 스택: Next.js (static export) · TypeScript · Tailwind CSS · React Three Fiber · GSAP

## 개발

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # 단위 테스트
npm run test:e2e     # 빌드 + e2e
npm run lighthouse   # (out/을 4173에서 서빙 중일 때) 모바일 Lighthouse
```

외부 주소에서 개발 서버를 볼 때는 허용할 호스트를 환경변수로 넘긴다.

```bash
DEV_ORIGINS=<외부 IP 또는 도메인> npx next dev -H 0.0.0.0 -p <포트>
```

## 배포 (개인 서버 Nginx)

```bash
NEXT_PUBLIC_SITE_URL=https://<도메인> npm run build
rsync -av --delete out/ <user>@<server>:/var/www/nais-web/
# 서버: deploy/nginx.conf를 /etc/nginx/sites-available/에 두고 server_name 수정 후
sudo nginx -t && sudo systemctl reload nginx
```
