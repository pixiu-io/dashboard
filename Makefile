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
	docker build --no-cache -t ${dockerhubUser}/${releaseName}:${tag} --platform=linux -f docker/Dockerfile .

push: image
	docker push ${dockerhubUser}/${releaseName}:${tag}

image-aio:
<<<<<<< HEAD
	docker build --no-cache -t ${dockerhubUser}/pixiu-aio:${tag} --platform=linux -f docker/Dockerfile-aio .
=======
	docker build -t ${dockerhubUser}/pixiu-aio:${tag} --platform=linux -f docker/Dockerfile-aio .
>>>>>>> d303d038381cff79b5741355c4811a6a5829f830

push-aio: image-aio
	docker push ${dockerhubUser}/pixiu-aio:${tag}

clean:
	-rm -rf ./dist ./node_modules
