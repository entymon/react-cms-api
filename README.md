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
