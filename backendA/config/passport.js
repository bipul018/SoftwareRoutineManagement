const passport = require("passport")
const bcrypt = require("bcrypt")
const LocalStrategy = require("passport-local").Strategy
const User = require("../Schema/userSchema")

passport.use(
  new LocalStrategy((username, password, done) => {
    // search for user in database
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err)
      }
      console.log(username)
      // check if username exists in database
      if (!user) {
        return done(null, false, { message: "Incorrect username" })
      }

      // check whether user's password matches the one in database
      if (password == user.password){
        return done(null,user);
      }
      //bcrypt.compare(password, user.password, function (err, res) {
      //  if (err) return done(err)
      //  if (res === false)
      //    return done(null, false, { message: "Incorrect password" })
//
      //  return done(null, user)
      //})
    })
  })
)

// Grabs a user from DB and stores it in a session
passport.serializeUser((user, done) => {
  done(null, user.id)
})

// Grabs a serialized user from session
passport.deserializeUser((id, done) => {
  User.findById(id, function (err, user) {
    // const userInfo = {
    //   username: user.username,
    // }
    // done(err, userInfo)
    done(err, user)
  })
})
