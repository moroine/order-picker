# Order Picker

## Installation

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `v18.0.0`

- Run `npm i` to install the project dependencies

## Test your service

- Run `cp ./api/.env.template ./api/.env`
- Run `cp ./app/.env.template ./app/.env`
- Run in `/api` folder the command `npm run dev`
- Run in `/app` folder the command `npm run dev`
- Load fixture by running: `curl --location --request POST 'http://localhost:3000/fixtures/load'`
- Open the VUE url in your web browser
