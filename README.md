# weather_real_app 3

## Deploy

From the project directory:

```bash
cd /Users/mac/Downloads/Harold-workstation/weather_real_app
docker compose up -d --build
```

Verify the stack:

```bash
docker compose ps
docker compose logs --tail=100
```

Open the app at [http://localhost:3000](http://localhost:3000).

If you update `.env`, restart with a rebuild:

```bash
docker compose down
docker compose up -d --build
```

## Stop The App

Stop and remove this app's containers and network:

```bash
cd /Users/mac/Downloads/Harold-workstation/weather_real_app
docker compose down
```

Stop and also remove this app's named volumes (`db-data`, `redis-data`), which deletes persisted data:

```bash
docker compose down -v
```

## Remove App Images And Containers

Remove this app's containers, network, local build image, and anonymous volumes:

```bash
docker compose down --rmi local -v
```

Remove all images used by this app, including pulled images referenced in the compose file:

```bash
docker compose down --rmi all -v
```

If you want to remove resources explicitly by name after shutdown:

```bash
docker rm -f weatherapp-ui weatherapp-auth weatherapp-weather weatherapp-db weatherapp-redis
docker volume rm weather_real_app_db-data weather_real_app_redis-data
docker image rm weather_real_app-weather bulawesley/ui:v1 bulawesley/auth:v1 bulawesley/db:v1 bulawesley/redis:v1
docker network rm weather_real_app_weatherapp
```

Some explicit remove commands may report that a resource does not exist if Docker Compose already removed it.

## Clean Re-Deploy

For a full reset and fresh redeploy:

```bash
cd /Users/mac/Downloads/Harold-workstation/weather_real_app
docker compose down --rmi all -v
docker compose up -d --build
```
