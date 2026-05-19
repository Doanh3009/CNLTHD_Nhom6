# KDKTechShop Microservices

KDKTechShop is an ecommerce website built with an independent microservices architecture.

## Architecture

- `techshop-frontend`: React/Vite customer and admin UI.
- `api-gateway`: Spring Cloud Gateway entry point, CORS and JWT resource server.
- `auth-service`: user registration, customer login, admin login, user management.
- `product-service`: products and categories backed by MongoDB.
- `order-service`: checkout, order management and order status.
- `inventory-service`: stock, import receipts and inventory movement reports.
- `notification-service`: Kafka consumer for order notifications.
- `chatbot-service`: AI product assistant and catalog recommendations.
- `discovery-server`: Eureka service discovery.

Supporting infrastructure includes PostgreSQL, MongoDB, Kafka, Zipkin, Prometheus, Grafana, Docker Compose and Kubernetes manifests.

## Run Locally

```bash
docker compose up -d --build
```

Main URLs:

- Frontend: `http://localhost:5173`
- API gateway: `http://localhost:8181`
- Eureka: `http://localhost:8761`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3000`

## Test And Build

Backend:

```bash
mvn test
mvn -DskipTests package
```

Frontend:

```bash
cd techshop-frontend
npm ci
npm test
npm run lint
npm run build
```

`product-service` includes a Testcontainers MongoDB integration test. It is skipped automatically when Docker is not available locally, while still running in CI environments with Docker enabled.

## CI/CD

GitHub Actions runs:

- backend unit/integration tests and Maven package
- frontend unit tests, lint and production build
- Docker image build for frontend, gateway, auth, product, order, inventory, notification, chatbot and discovery services
- optional Docker Hub push when `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets are configured
- optional Kubernetes deployment when `KUBE_CONFIG` secret is configured
