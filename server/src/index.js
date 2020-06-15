require('dotenv').config();
const express = require('express')
const { Sequelize } = require('sequelize');

const model = require('./model')

const { DB_HOST, DB_USERNAME, DB_PWD, DB_NAME } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PWD, {
  host: DB_HOST.toString().split(":")[0],
  port: DB_HOST.toString().split(":")[1],
  dialect: 'postgres'
})

const { User, AuthToken } = model(sequelize)

const app = express();
const port = process.env.PORT ?? 8080


app.listen(port, () => {
  Promise.all([
      sequelize.authenticate(),
      sequelize.sync()
  ]).then(() => {
    console.log(`API Server listening on ${port}`)
  }).catch(console.error)
})
