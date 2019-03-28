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

Gotchas:
As a heads up. When you are testing make sure you understand the difference between `docker-compose run api bash` and `docker exec -it {containerIdHere} bash`. The first actually will start up a new container for the api, which means when you bash into it, you are actually not in the same docker-compose network. For more into on this difference, checkout [this stackoverflow response](https://stackoverflow.com/questions/37063822/econnrefused-nodejs-with-express-inside-docker-container). 

