require('dotenv').config();
const express = require('express')
const { Sequelize, Op, DataTypes } = require('sequelize');

const model = require('./model')
const { normalizeUser, normalizeToken } = require('./normalize')

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
    const user = await User.findOne({
      include: [
        {
          model: AuthToken,
          required: true,
          where: {
            token,
            expiration: {
              [Op.gte]: new Date()
            }
          }
        }]
    })
    return user ? user.id : false
  } else return false
}

const sendInternalError = (res, e) => {
  res.sendStatus(500);
  console.error(e)
}

app.post('/auth', (req, res) => {
  const [email, pwd] = String(req.header('Authorization')).split(" ");
  if (email && pwd) {
    User.findOne({ where : { email, pwd } })
      .then((foundUser) => {
        if (foundUser) {
          AuthToken.create({ userId: foundUser.id })
          .then((token) => res.send(normalizeToken(token)))
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
              .then((users) => res.send(users.map(normalizeUser)))
              .catch((e) => sendInternalError(res, e));
        } else {
          res.sendStatus(403)
        }
    }).catch((e) => sendInternalError(res, e))
})

app.post('/user', (req, res) => {
  const { email, pwd } = req.headers
  extractAndValidateToken(req)
  .then((valid) => {
    if (valid) {
      if (email && pwd) {
        User.create({ email, pwd })
          .then((user) => res.send(normalizeUser(user)))
          .catch((e) => sendInternalError(res, e))
      } else res.sendStatus(400)
    } else  res.sendStatus(403)
  }).catch((e) => sendInternalError(res, e))
})

app.delete('/user/:id', (req, res) => {
  const { id } = req.params;
  extractAndValidateToken(req)
  .then((valid) => {
    if (id && !isNaN(id)) {
      // Makes the user able to alter only his own password if the pwd parameter is passed
      if (valid && parseInt(id) === valid) {
        User.destroy({ where: { id: parseInt(id) } })
        .then(() => res.sendStatus(200))
        .catch((e) => sendInternalError(res, e))
      } else  res.sendStatus(403)
    } else res.sendStatus(400)
  }).catch((e) => sendInternalError(res, e))
})

app.put('/user/:id', (req, res) => {
  const { id } = req.params;
  const { email, pwd } = req.headers;
  extractAndValidateToken(req)
  .then((valid) => {
    if (email && id && !isNaN(id)) {
      // Makes the user able to alter only his own password if the pwd parameter is passed
      if (valid && (pwd ? parseInt(id) === valid : true)) {
        let updatePayload = { email }
        if (pwd) {
          updatePayload = { ...updatePayload, pwd }
        }
        User.update(updatePayload, { where: { id: parseInt(id) } })
          .then(() => res.sendStatus(200))
          .catch((e) => sendInternalError(res, e))
      } else  res.sendStatus(403)
    } else res.sendStatus(400)
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
          }).then( (user) => res.send(normalizeUser(user)))
        } else res.sendStatus(403)
    }).catch(e => sendInternalError(res, e));
})

app.get('/user/:id', (req, res) => {
  const { id } = req.params
  extractAndValidateToken(req)
    .then((valid) => {
      if (valid) {
        if (id) {
          User.findOne({ where: { id }})
          .then((user) => {
            if (user) {
              res.send(normalizeUser(user))
            } else res.sendStatus(404)
          }).catch((e) => sendInternalError(res, e))
        } else res.sendStatus(400)
      } else res.sendStatus(403)
    }).catch((e) => sendInternalError(res, e))
})

app.listen(port, () => {
  Promise.all([
      sequelize.authenticate(),
      sequelize.sync()
  ]).then(() => {
    console.log(`API Server listening on ${port}`)
  }).catch(console.error)
})
