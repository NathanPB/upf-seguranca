const normalizeToken = ({ token, expiration, createdAt }) => ({ token, expiration, createdAt })

const normalizeUser = ({ id, email, createdAt, tokens }) => ({
  id, email, createdAt,
  tokens: tokens ? tokens.map(normalizeToken) : undefined
})

module.exports = {
  normalizeToken,
  normalizeUser
}
