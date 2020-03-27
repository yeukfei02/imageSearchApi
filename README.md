# imageSearchApi

[![Build Status](https://travis-ci.com/yeukfei02/imageSearchApi.svg?branch=master)](https://travis-ci.com/yeukfei02/imageSearchApi)
[![codecov](https://codecov.io/gh/yeukfei02/imageSearchApi/branch/master/graph/badge.svg)](https://codecov.io/gh/yeukfei02/imageSearchApi)

imageSearchApi by unsplash, pixabay

## Requirement:
 - install yarn
 - install node (v12+)
 - install mongodb

## Testing and run:
```
$ yarn

// development
$ yarn run dev

// production
$ yarn run start

// run test case
$ yarn run test

// use eslint and prettier to format code
$ yarn run lint
```

## Docker:

- Dockerfile

build images and start container
```
docker build -t <username>/image-search-api:<tag> .
docker run -p 3000:3000 -d <username>/image-search-api:<tag>
docker exec -it <containerId> /bin/bash
docker logs <containerId>
```

check images and container
```
docker images
docker ps
docker ps -a
```

open localhost:3000

- docker-compose.yml

build images and start container
```
docker-compose build
docker-compose up
```

build images and start container in one line
```
docker-compose up -d --build
```

stop container
```
docker-compose stop
```

add tag to docker images
```
$ docker tag <imageId> <dockerHubUserName>/<imageName>:<tag>
```

push docker images to docker hub
```
$ docker push <dockerHubUserName>/<imageName>:<tag>
```

open localhost:3000

## Contributing

Please refer to [CONTRIBUTING.md](https://github.com/yeukfei02/imageSearchApi/blob/master/CONTRIBUTING.md)
