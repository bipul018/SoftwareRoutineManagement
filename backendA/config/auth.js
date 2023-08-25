const bcrypt = require("bcrypt")

const SALT_ROUNDS = 10

function hash(password) {
  const salt = bcrypt.genSaltSync(SALT_ROUNDS)
  const hashed = bcrypt.hashSync(password, salt)
  return hashed
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next()
  res.status(401)
}

function isLoggedOut(req, res, next) {
  if (!req.isAuthenticated()) return next()
  res.status(404)
}

function isAdmin(req, res, next) {
  if (req.user && req.user.username === "admin") {
    return next()
  }
  res.render("error")
}

module.exports.hash = hash
module.exports.isLoggedIn = isLoggedIn
module.exports.isLoggedOut = isLoggedOut
module.exports.isAdmin = isAdmin
