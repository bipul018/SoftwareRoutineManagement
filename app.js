const createError = require("http-errors")
const express = require("express")
const cors = require("cors")
const path = require("path")
const cookieParser = require("cookie-parser")
const logger = require("morgan")
const mongoose = require("mongoose")
const session = require("express-session")
const passport = require("passport")


const indexRouter = require("./routes/index")
const userRouter = require("./routes/user")
const classRouter = require("./routes/class")
const adminRouter = require("./routes/admin")
const programRouter = require("./routes/program")

const app = express()

app.use(express.static(path.join(__dirname, 'build')));

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "jade")

app.use(cookieParser("process.env.SESSION_SECRET"))
app.use(
  cors({
    origin: "http://localhost",
    credentials: true,
  })
)
// // Send the React app's HTML file for all other routes
// app.get('/user', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });



mongoose.connect(
  //"mongodb+srv://santos7117:7117santos@routine.tnsnq.mongodb.net/Routine?retryWrites=true&w=majority",
  process.env.MONGO_URL+"/"+process.env.MONGO_DB_NAME,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
    pass: process.env.MONGO_PASS,
    user: process.env.MONGO_USER
  }
)

// mongoose.connect('mongodb+srv://@routine.tnsnq.mongodb.net/Routine?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
//   useFindAndModify: false,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
// })

const db = mongoose.connection

db.on("error", console.error.bind(console, "XXX DB CONNECTION FAILED XXX"))
db.once("open", function () {
  console.log("[DB CONNECTED]")
})

app.use(logger("dev"))
app.use(express.json())
//app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({ extended: false }))

app.use(
  session({
    key: "userId",
    secret: "process.env.SESSION_SECRET",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
)
app.use(passport.initialize())
app.use(passport.session())
require("./config/passport")

app.use("/", indexRouter)
//app.use("/user", userRouter)
app.use("/api/user/admin", adminRouter)
app.use("/api/class", classRouter)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// app.use("/api/program", programRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

module.exports = app
// let frontend = process.env.FRONTEND_URL;
// console.log({frontend})
// const MongoClient = require('mongodb').MongoClient
// const assert = require('assert')

// client.connect(function (err) {
//   assert.equal(null, err)
//   console.log("Connected successfully to server")

//   const db = client.db(dbName)

//   client.close()
// })

// app.engine('hbs', hbs({ defaultLayout: 'main', extname: '.hbs' }))
// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'hbs')

// mongoose.connect('mongodb://localhost:27017/routine', { useNewUrlParser: true })
