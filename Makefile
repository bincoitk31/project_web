services:
	docker-compose up -d
app:
	docker-compose -f docker-compose.yml down; docker-compose -f docker-compose.yml run --name project-web --service-ports project-web
deploy:
	ansible-playbook -i ansible/hosts ansible/deploy.yml && make deploy-alert
bash:
	docker-compose run project-web sh