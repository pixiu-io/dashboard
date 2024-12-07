.PHONY: run install build image push clean

tag = latest
releaseName = pixiu-dashboard
dockerhubUser = harbor.cloud.pixiuio.com

ALL: run

install:
	npm install

run: install
	npm run serve

build: install
	npm run build

image:
	docker build --no-cache -t ${dockerhubUser}/pixiuio/${releaseName}:${tag} --platform=linux -f docker/Dockerfile .

push: image
	docker push ${dockerhubUser}/pixiuio/${releaseName}:${tag}

image-aio:
	docker build --no-cache -t ${dockerhubUser}/pixiuio/pixiu-aio:${tag} --platform=linux -f docker/Dockerfile-aio .

push-aio: image-aio
	docker push ${dockerhubUser}/pixiuio/pixiu-aio:${tag}

image-aio-v1:
	docker build --no-cache -t ${dockerhubUser}/pixiuio/pixiu-aio:v1.0.0 --platform=linux -f docker/Dockerfile-aio-v1 .

push-aio-v1: image-aio-v1
	docker push ${dockerhubUser}/pixiuio/pixiu-aio:v1.0.0

clean:
	-rm -rf ./dist ./node_modules
