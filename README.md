# DevOps Final Project

Node.js + Docker Compose + Prometheus + Grafana + GitHub Actions + Ansible.

## Что есть
- `GET /` → `DevOps Final Project`
- `GET /health` → `{"status":"ok"}`
- `GET /metrics` → метрики Prometheus (`collectDefaultMetrics` + `http_requests_total`)
- Docker Compose: app, Prometheus, Grafana
- GitHub Actions: lint, test, публикация образа в GHCR
- Ansible: разворачивает стек на localhost

## 1. Локально
```bash
npm install
npm run lint
npm test
npm start
Открой:

http://localhost:3000/

http://localhost:3000/health

http://localhost:3000/metrics

После npm install закоммить package-lock.json.

2. Docker-стек
bash
docker compose up -d --build
docker compose ps
Открой:

app: http://localhost:3000/

Prometheus: http://localhost:9090/targets (цель app = UP)

Grafana: http://localhost:3001/ (admin / admin, datasource уже добавлен)

Остановить:

bash
docker compose down      
docker compose down -v    
3. Ansible
bash
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml --ask-become-pass
Плейбук: ставит Docker, создаёт /opt/devops-final, копирует файлы, запускает docker compose up -d.
мяу
