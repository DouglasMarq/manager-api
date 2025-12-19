docker/prod/up:
	docker compose up -d --build

docker/up: docker/down
	docker compose up -d

docker/down:
	docker compose down

podman/prod/up:
	podman compose up -d --build

podman/up: podman/down
	podman compose up -d

podman/down:
	podman compose down