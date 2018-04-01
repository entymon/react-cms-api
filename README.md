## Project: cms api

## Start

- install YARN https://yarnpkg.com/lang/en/docs/install/
- in root directory type command `yarn` which installs all dependencies

## Create .env by

`cp .env.example .env`

## Download and setup Redis DB

- go to website: `https://redis.io/download` and follow instructions.
- add redis directory wherever you want create database
- go into `redis-x.y.z` directory and run command `make`. Optionally run `make test`

# Redis is almost ready to use, you just run `./src/redis-server`

## Run development

- `yarn start` - start development env
- `yarn build` - start production env and create public directory with source code.

## Add example admin user

go to redis DB directory on your computer and RUN:

- `./src/redis-cli HMSET users:uuid uuid b0e73d1b-c3c1-41bc-b08d-4ec6da9b619b`
- `./src/redis-cli HMSET users:uuid name admin`
- `./src/redis-cli HMSET users:uuid password admin`
- `./src/redis-cli SADD users users:uuid`

## Useful REDIS command

1. `./src/redis-cli SMEMBERS users` - check if `uuid` was added to users list
2. `./src/redis-cli DEL users` - remove users list
3. `./src/redis-cli HGETALL users:uuid` check if all user data were added
