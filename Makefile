up:
	docker compose -f $(PWD)/docker-compose.yml up -d
down:
	docker compose -f $(PWD)/docker-compose.yml down
build:
	docker compose -f $(PWD)/docker-compose.yml up --build -d
reset:
	docker system prune --all
