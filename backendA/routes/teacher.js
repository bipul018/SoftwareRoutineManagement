var express = require("express")
var router = express.Router()

var Teacher = require("../Schema/teacherSchema.js")

router.get("/", async function (req, res) {
  try {
    const allTeacher = await Teacher.find({}).sort({ teacherName: 1 })
    return res.json({
      status: true,
      data: allTeacher,
      err: {},
      msg: "Teachers fetched successfully.",
    })
  } catch (err) {
    return res.json({
      status: false,
      data: {},
      err,
      msg: "Unable to fetch teachers.",
    })
  }
})

router.get("/name/:teacherName", async function (req, res) {
  try {
    const teacherName = req.params.teacherName;
    const teacherObj = await Teacher.findOne({teacherName: teacherName})
    const teacherID = teacherObj._id.toString();
    console.log(teacherObj);
    return res.json({
      status: true,
      data: teacherID,
      err: {},
      msg: "Teachers fetched successfully.",
    })
  } catch (err) {
    return res.json({
      status: false,
      data: {},
      err,
      msg: "Unable to fetch teachers.",
    })
  }
})

router.get("/:id", async function (req, res) {
  try {
    const id = req.params.id
    const allTeacher = await Teacher.findById({ _id: id })
    return res.json({
      status: true,
      data: allTeacher,
      err: {},
      msg: "Teachers fetched successfully.",
    })
  } catch (err) {
    return res.json({
      status: false,
      data: {},
      err,
      msg: "Unable to fetch teachers.",
    })
  }
})

router.post("/add", async function (req, res) {
  const { teacherName, shortName, designation } = req.body

  try {
    var newTeacher = new Teacher({
      teacherName: teacherName,
      shortName: shortName,
      designation: designation,
    })
    console.log(newTeacher)
    newTeacher.save()
    return res.json({
      status: true,
      data: newTeacher,
      msg: "Teacher saved successfully.",
    })
  } catch {
    return res.json({
      status: false,
      data: {},
      msg: "Unable to save Teacher.",
    })
  }
})

router.post("/edit/:id", async function (req, res) {
  Teacher.findById(req.params.id, function (err, p) {
    if (!p) {
      return res.json({
        status: false,
        data: {},
        msg: "Unable to update Teacher Data.",
      })
    } else {
      p.teacherName = req.body.teacherName
      p.shortName = req.body.shortName
      p.designation = req.body.designation
      p.save(function (err) {
        if (err) {
          return res.json({
            status: false,
            data: {},
            msg: "Unable to update Teacher Data.",
          })
        } else {
          return res.json({
            status: true,
            data: p,
            msg: "Teacher Data updated Sucessfully",
          })
        }
      })
    }
  })
})

router.post("/delete/:id", async function (req, res) {
  try {
    await Teacher.deleteOne({ _id: req.params.id })
    return res.json({
      status: true,
      // data: deletedObject,
      msg: "Teacher removed successfully.",
    })
  } catch (err) {
    console.log(err)
    return res.json({
      status: false,
      data: {},
      msg: "Unable to remove Teacher.",
    })
  }
})


router.get("/:id", async function (req, res) {
  try {
    const id = req.params.id
    const allTeacher = await Teacher.findById({ _id: id })
    return res.json({
      status: true,
      data: allTeacher,
      err: {},
      msg: "Teachers fetched successfully.",
    })
  } catch (err) {
    return res.json({
      status: false,
      data: {},
      err,
      msg: "Unable to fetch teachers.",
    })
  }
})

module.exports = router
