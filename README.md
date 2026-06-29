# concurrent-gateway-tester

## Steps completed so far

1. Created the project workspace for `concurrent-gateway-tester`.
2. Set up the repository structure with:
   - `apps-backend/`
   - `apps-frontend/`
   - `apps-worker/`
   - `docker-compose.yml`
3. docker-compose.yml :
 This file will pull down and spin up lightweight, isolated instances of PostgreSQL (to track our test metadata, logs, and aggregated statistics) and Redis (to manage our high-speed BullMQ queues and handle real-time message pub/sub streams).
4. run docker commend :
    docker compose up -d // will create concurent-gatewaytester container with cgt_postgress and cgt_redis inside docker
5. to confirm :
    docker ps // will list the container
    