const express = require("express")
const programRouter = require("./program")
const teacherRouter = require("./teacher")
const subjectRouter = require("./subject")

const User = require("../Schema/userSchema")
const { hash, isAdmin, isLoggedIn } = require("../config/auth")

const router = express.Router()

// setup admin user
router.get("/", async (req, res) => {
  const response = {
    status: true,
    data: {},
    err: {},
    msg: "",
  }

  try {
    const adminSchema = {
      username: "admin",
      password: hash("admin"),
    }

    // check if admin already exists
    let admin = await User.findOne({ username: "admin" })
    if (admin) {
      response.msg = "Admin user found."
      return res.json(response)
    }

    admin = new User(adminSchema)

    if (admin.save()) {
      response.msg = "New Admin user created."
    }

    return res.json(response)
  } catch (err) {
    return res.json({
      status: false,
      err,
      msg: "!!! Admin user not found",
    })
  }
})

router.use("/api/teacher", teacherRouter)
router.use("/api/program", programRouter)
router.use("/api/subject", subjectRouter)
// router.use("/api/class", auth.isLoggedIn, auth.isAdmin, classRouter);

module.exports = router
