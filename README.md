# Money Spy

## Database

```bash
docker run --name gsl-testing --rm -d -p 5432:5432 \
    -e POSTGRES_PASSWORD=test_password \
    -e POSTGRES_USER=test_user \
    -e POSTGRES_DB=test_database \
    postgres:14.3-alpine
```

## Environment

```bash
cp .env.example .env
```

## Run

```bash
pnpm dev
```
