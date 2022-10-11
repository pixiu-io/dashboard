.PHONY: run install build image push clean

tag = latest
releaseName = pixiu-dashboard
dockerhubUser = cqiang1993

ALL: run

install:
	npm install

run: install
	npm run serve

build: install
	npm run build

image:
	docker build -t ${dockerhubUser}/${releaseName}:${tag} --platform=linux/amd64,linux/arm64 -f docker/Dockerfile .

push: image
	docker push ${dockerhubUser}/${releaseName}:${tag}

clean:
	-rm -rf ./dist ./node_modules