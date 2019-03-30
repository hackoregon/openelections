# Open Elections Project

This is the master repo for the Open Elections project.

### Installation

#### Docker 

You'll need docker to get going. Setup docker by visiting: https://docs.docker.com/install/

### Commands

Pull all the docker images by running: 

```bash
    docker-compose pull
```
    
Start application by running:

```bash
    docker-compose up -d
```


### Testing

> Heads up: Make sure after each test you swipe the dockers or you will probably get `Error: Request failed with status code 403`.

1. In the root directory run the following. Note: `-f docker-compose-test.yml` specifies the test docker.
```bash
    docker-compose -f docker-compose-test.yml build
```

2. Then you can run the test:
```bash
    docker-compose -f docker-compose-test.yml up
```

3. Check out the logs and make sure it passes. When done you will want to kill the dockers:
```bash
    docker-compose -f docker-compose-test.yml stop
    docker-compose -f docker-compose-test.yml rm
    docker-compose -f docker-compose-test.yml down
```

Gotchas:

As a heads up. When you are testing and for some reason need to manually connect to a docker instance, make sure you understand the difference between `docker-compose run api bash` and `docker exec -it {containerIdHere} bash`. The first actually will start up a new container for the api, which means when you bash into it, you are actually not in the same docker-compose network. For more into on this difference, checkout [this stackoverflow response](https://stackoverflow.com/questions/37063822/econnrefused-nodejs-with-express-inside-docker-container). 

