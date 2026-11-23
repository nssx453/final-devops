# DevOps Final Project

Учебный проект: Node.js + Docker Compose + Prometheus + Grafana + GitHub Actions + Ansible.

## 1. Что установлено в проекте

- `GET /` — возвращает `DevOps Final Project`.
- `GET /health` — возвращает JSON `{"status":"ok"}`.
- `GET /metrics` — отдаёт метрики Prometheus; подключён `collectDefaultMetrics` и счётчик `http_requests_total`.
- Docker Compose запускает приложение, Prometheus и Grafana.
- GitHub Actions выполняет lint, test и публикацию образа в GHCR.
- Ansible разворачивает Compose-стек на localhost.

## 2. Локальный запуск приложения

Нужны Node.js 20+ и npm.

```bash
npm install
npm run lint
npm test
npm start
```

Проверь в браузере:
- http://localhost:3000/
- http://localhost:3000/health
- http://localhost:3000/metrics

## 3. Запуск Docker-стека

Нужен установленный Docker с плагином Docker Compose v2.

Из корневой папки проекта выполни:

```bash
docker compose up -d --build
docker compose ps
```

Проверка:
- приложение: http://localhost:3000/
- health: http://localhost:3000/health
- метрики: http://localhost:3000/metrics
- Prometheus: http://localhost:9090/targets
- Grafana: http://localhost:3001/

В Grafana начальные данные для входа: `admin` / `admin`. При первом входе Grafana может предложить сменить пароль. Источник Prometheus уже добавлен автоматически. В Explore можно выполнить запрос `http_requests_total`.

Проверить статус цели Prometheus можно также запросом `http://localhost:9090/api/v1/targets`: у цели `app` должен быть `health: "up"`.

Остановить стек:

```bash
docker compose down
```

Остановить стек и удалить сохранённые данные Prometheus/Grafana:

```bash
docker compose down -v
```

## 4. Создание GitHub-репозитория

1. На GitHub нажми **New repository**.
2. Название: `devops-final`.
3. Выбери Public или Private (если преподаватель должен открыть репозиторий, проверь, что у него есть доступ).
4. Не добавляй автоматически README, `.gitignore` или License, потому что они уже есть в этом проекте.
5. Создай репозиторий.
6. Открой терминал в корневой папке распакованного проекта и выполни команды, заменив `YOUR_USERNAME` на свой GitHub username:

```bash
git init
git add .
git commit -m "Initial DevOps final project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/devops-final.git
git push -u origin main
```

Если Git сообщает, что `origin` уже существует, используй:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/devops-final.git
```

## 5. Ветка develop и Pull Request

```bash
git checkout -b develop
git push -u origin develop
```

Для дальнейших изменений работай в `develop`, затем:

```bash
git add .
git commit -m "Describe your changes"
git push
```

На GitHub:
1. Открой вкладку **Pull requests**.
2. Нажми **New pull request**.
3. Base — `main`, compare — `develop`.
4. Создай Pull Request.
5. Во вкладке **Checks** дождись завершения `Lint` и `Test`.
6. Если проверки прошли, нажми **Merge pull request**.

`Build and push image` запускается только после push непосредственно в `main`, а не на Pull Request. После слияния PR проверь вкладку **Actions**.

## 6. Branch protection для main

В настройках репозитория открой **Settings → Rules → Rulesets** (или **Branches → Add branch protection rule**, если доступен старый интерфейс).

Создай правило для `main`:
- Require a pull request before merging.
- Require status checks to pass before merging.
- Выбери проверку `Lint` и `Test` (они могут появиться в списке после первого запуска workflow).
- Сохрани правило.

Для учебного задания не включай обязательное одобрение, если работаешь один и преподаватель не требует этого отдельно.

## 7. GitHub Container Registry (GHCR)

Workflow автоматически собирает и публикует два тега:
- `ghcr.io/ВАШ_GITHUB_USERNAME/devops-final:latest`
- `ghcr.io/ВАШ_GITHUB_USERNAME/devops-final:ХЭШ_КОММИТА`

Публикация выполняется только при push в `main` после успешных lint и test. Workflow использует встроенный `GITHUB_TOKEN`; отдельный токен обычно не требуется. Проверь **Settings → Actions → General → Workflow permissions**: должно быть разрешено чтение и запись (Read and write permissions), если организация не переопределяет эти права.

После успешного workflow образ можно найти в профиле GitHub в разделе **Packages**. Если пакет приватный, для просмотра и скачивания может потребоваться авторизация.

## 8. Ansible

Плейбук рассчитан на Debian/Ubuntu и запускается с правами sudo. Нужны Ansible и доступ к пакетному менеджеру.

Из корня проекта:

```bash
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml --ask-become-pass
```

Если у пользователя настроен sudo без пароля, можно убрать `--ask-become-pass`.

Плейбук:
1. Устанавливает Docker и Compose plugin, если пакет отсутствует.
2. Запускает Docker.
3. Создаёт `/opt/devops-final`.
4. Копирует `docker-compose.yml` и `prometheus.yml`.
5. Запускает `docker compose up -d`.

Плейбук копирует в `/opt/devops-final` также `Dockerfile`, `package.json` и каталог `src`, поэтому у Docker Compose есть полный контекст для сборки приложения.

Для повторного запуска используй ту же команду. `file` и `copy` работают идемпотентно. Команда Compose может сообщать `ok` или `changed` в зависимости от состояния контейнеров; проверь повторный запуск и отсутствие ненужного пересоздания.

## 9. Скриншоты для защиты

Сделай собственные скриншоты после запуска у себя:
1. Три маршрута приложения (браузер или curl).
2. `docker compose ps` — все три контейнера работают.
3. Prometheus `/targets` — `app` со статусом `UP`.
4. Grafana — главная страница и источник Prometheus; по возможности график `http_requests_total`.
5. GitHub Actions — успешные `Lint`, `Test`, `Build and push image`.
6. GitHub Packages — опубликованные теги `latest` и SHA.
7. Pull Request в `main` с пройденными проверками.
8. Два запуска Ansible playbook, показывающие повторное выполнение.

Скриншоты нельзя достоверно подготовить заранее: они должны показывать результат реального запуска на твоём компьютере и в твоём GitHub.

## 10. Частые проблемы

- Порт занят: измени левую часть проброса портов в `docker-compose.yml`.
- Prometheus показывает DOWN: проверь `docker compose logs app prometheus`; внутри Docker Compose адрес приложения — `app:3000`, а не `localhost:3000`.
- Grafana не открывается: проверь `docker compose ps` и `docker compose logs grafana`.
- `npm install` не работает: проверь, что `package-lock.json` создан командой `npm install` и закоммичен. После первого `npm install` обязательно добавь `package-lock.json` в Git.
- GitHub не публикует образ: проверь права `GITHUB_TOKEN` и успешное завершение предыдущих jobs.
- Ansible на другой ОС: данный пример установки Docker ориентирован на Debian/Ubuntu; для Fedora, CentOS или macOS установка пакетов будет другой.

## 11. Перед сдачей

- [ ] Репозиторий `devops-final` создан и доступен преподавателю.
- [ ] В `main` есть полный исходный код.
- [ ] Ветки `main` и `develop` созданы.
- [ ] PR из `develop` в `main` прошёл проверки и смержен.
- [ ] Docker Compose поднимает app, Prometheus и Grafana.
- [ ] Prometheus показывает `app` как `UP`.
- [ ] Grafana подключена к Prometheus.
- [ ] GHCR содержит `latest` и SHA-тег.
- [ ] Ansible playbook выполнен, повторный запуск проверен.
- [ ] Скриншоты сделаны самостоятельно.
