docker/prod/up:
	docker compose up -d --build

docker/db/up:
	docker compose up -d postgres
	docker compose up -d flyway

docker/up: docker/down
	docker compose up -d

docker/down:
	docker compose down

podman/prod/up:
	podman compose up -d --build

podman/db/up:
	podman compose up -d postgres
	podman compose up -d flyway

podman/up: podman/down
	podman compose up -d

podman/down:
	podman compose down