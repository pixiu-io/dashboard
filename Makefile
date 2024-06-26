.PHONY: run install build image push clean

tag = latest
releaseName = pixiu-dashboard
dockerhubUser = harbor.cloud.pixiuio.com

GOPROXY ?= https://goproxy.cn
NPM_REGISTRY ?= https://registry.npmmirror.com

ALL: run

install:
	npm install

run: install
	npm run serve

build: install
	npm run build

image:
	docker build --no-cache -t ${dockerhubUser}/pixiuio/${releaseName}:${tag} \
	--build-arg NPM_REGISTRY=${NPM_REGISTRY} \
	-f docker/Dockerfile .

image-aio:
	docker build --no-cache -t ${dockerhubUser}/pixiuio/pixiu-aio:${tag} \
	--build-arg GOPROXY=${GOPROXY} \
	--build-arg NPM_REGISTRY=${NPM_REGISTRY} \
	-f docker/Dockerfile.aio .

clean:
	-rm -rf ./dist ./node_modules
