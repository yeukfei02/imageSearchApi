# imageSearchApi

[![Build Status](https://travis-ci.com/yeukfei02/imageSearchApi.svg?branch=master)](https://travis-ci.com/yeukfei02/imageSearchApi)
[![codecov](https://codecov.io/gh/yeukfei02/imageSearchApi/branch/master/graph/badge.svg)](https://codecov.io/gh/yeukfei02/imageSearchApi)

imageSearchApi by unsplash, pixabay, storyblocks

documentation: https://documenter.getpostman.com/view/3827865/SzezdXuZ?version=latest

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

```
// build images and start container in one line
docker-compose up -d --build

// go inside container
docker exec -it <containerId> /bin/bash

// check container logs
docker logs <containerId>

// remove and stop container
docker-compose down
```

open localhost:3000

## Contributing

Please refer to [CONTRIBUTING.md](https://github.com/yeukfei02/imageSearchApi/blob/master/CONTRIBUTING.md)
