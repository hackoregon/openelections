# Postgresql starter guide
This is a brief guide you get up and running using Postgres in this project. Or its a place for me (@andrewbiang888) to copy and paste stuff. Choose your own adventure, you know?


## TLDR; The Commands
Here are helpful `bash` scripts to make your life easier.

```bash
# to access the postgres instance you will need to use this command:
psql -U postgres

# to connect to a specific database, use the following 
# command. You will be prompted for the password. 
# You can verify the host, port, username in the docker-compose file
# psql -h HOST -p PORT -U USERNAME  DATABASENAME
psql -h localhost -p 5432 -U postgres testdb

# want to import an .sql file into a new database?
# make sure to use the path to the .sql file
psql -h localhost -p 5432 -U postgres testdb < dump.sql

# when connected to a db you can do some queries
select * from testdb

# you can clone a db like this (when you are not connected):
pg_data testdb -f dump.sql


# to drop a db (⚠️⚠️⚠️USE WITH CAUTION⚠️⚠️⚠️)
# dropdb -h HOST -p PORT -U USERNAME  DATABASENAME
dropdb -h localhost -p 5432 -U postgres testdb
```

## About Postgres
New to Postgres? Here is a collection of information for you to reference

- [Postgres guide](http://postgresguide.com/utilities/psql.html)
- [Postgis & Docker](https://hub.docker.com/r/mdillon/postgis)
- [Postgres & docker](https://hub.docker.com/_/postgres/) (please note we are not using this docker image in this project, but [Postgis & Docker](https://hub.docker.com/r/mdillon/postgis) is based on this package, which is what we use)

## Postgres / Postgis Environment Variables
Here is a quick list of the environment variables you can use in the root docker-compose file.

```yml
# reference the indented under environment
services:
  db:
    environment: # 👇👇👇👇
      POSTGRES_PASSWORD: password
      POSTGRES_USER: postgres
      POSTGRES_DB: testdb
      # the following are not in use in the project yet 3/16/2019
      POSTGRES_INITDB_ARGS: "--data-checksums"
      POSTGRES_INITDB_WALDIR: 
      PGDATA: /var/lib/postgresql/data

```