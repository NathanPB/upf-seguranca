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

app.post('/auth', (req, res) => {
  const [email, pwd] = String(req.header('Authorization')).split(" ");
  if (email && pwd) {
    User.findOne({ where : { email, pwd } })
      .then((foundUser) => {
        if (foundUser) {
          AuthToken.create({ userId: foundUser.id })
          .then(({ token, expiration, createdAt }) => res.send({ token, expiration, createdAt }))
          .catch((e) => {
            res.send(500)
            console.error(e)
          })
        } else res.sendStatus(403)
      }).catch((e) => {
        res.send(500)
        console.error(e)
      })
  } else res.sendStatus(400)
})

app.listen(port, () => {
  Promise.all([
      sequelize.authenticate(),
      sequelize.sync()
  ]).then(() => {
    console.log(`API Server listening on ${port}`)
  }).catch(console.error)
})
