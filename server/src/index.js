require('dotenv').config();
const express = require('express')
const { Sequelize, Op } = require('sequelize');

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

const extractAndValidateToken = async (req) => validateToken(extractToken(req))

const extractToken = (req) => req.header('Authorization')

const validateToken = async (token) => {
  if (token) {
    return !!AuthToken.count({
      where: {
        token,
        expiration: {
          [Op.lte]: new Date()
        }
      }
    })
  } else return false
}

const sendInternalError = (res, e) => {
  req.sendStatus(500);
  console.error(e)
}

app.post('/auth', (req, res) => {
  const [email, pwd] = String(req.header('Authorization')).split(" ");
  if (email && pwd) {
    User.findOne({ where : { email, pwd } })
      .then((foundUser) => {
        if (foundUser) {
          AuthToken.create({ userId: foundUser.id })
          .then(({ token, expiration, createdAt }) => res.send({ token, expiration, createdAt }))
          .catch((e) => sendInternalError(res, e))
        } else res.sendStatus(403)
      }).catch((e) => sendInternalError(res, e))
  } else res.sendStatus(400)
})

app.get('/user', (req, res) => {
  extractAndValidateToken(req)
    .then((valid) => {
        if (valid) {
          User.findAll()
              .then((users) => res.send(users))
              .catch((e) => sendInternalError(res, e));
        } else {
          res.sendStatus(403)
        }
    }).catch((e) => sendInternalError(res, e))
})

app.get('/user/me', (req, res) => {
  extractAndValidateToken(req)
    .then((valid) => {
        if (valid) {
          User.findOne({
            include: [{
              model: AuthToken,
              required: true,
              where: { 'token': extractToken(req) }
            }]
          }).then(
              ({ email, createdAt, tokens }) => res.send({
                email,
                createdAt,
                tokens: tokens.map(({token, expiration, createdAt }) => ({ token, expiration, createdAt }))
              })
          )
        } else res.sendStatus(403)
    }).catch(e => sendInternalError(res, e));
})

app.listen(port, () => {
  Promise.all([
      sequelize.authenticate(),
      sequelize.sync()
  ]).then(() => {
    console.log(`API Server listening on ${port}`)
  }).catch(console.error)
})
