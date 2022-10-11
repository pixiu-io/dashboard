.PHONY: run install build image push clean

tag = latest
releaseName = pixiu-dashboard
dockerhubUser = jacky06

ALL: run

install:
	npm install

run: install
	npm run serve

build: install
	npm run build

image:
	docker build -t ${dockerhubUser}/${releaseName}:${tag} --platform=linux -f docker/Dockerfile .

push: image
	docker push ${dockerhubUser}/${releaseName}:${tag}

clean:
	-rm -rf ./dist ./node_modules
