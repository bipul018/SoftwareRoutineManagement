const express = require("express")
const Class = require("../Schema/classSchema")

const router = express.Router()


const {dummyteacherID, dummySubjectID} = require('../defines/defines.js')



// all available class data in database
router.get("/", async function (req, res) {
  const populateQuery = [
    { path: "routineFor", select: ["programName", "year", "part", "section"] },
    { path: "teacherName", select: ["teacherName", "shortName"] },
    { path: "subject", select: ["subjectName", "subjectCode"]}

  ]

  try {
    const allClasses = await Class.find({}).populate(populateQuery).lean()
     console.log(allClasses);
    return res.status(200).json({
      status: true,
      data: allClasses,
      err: {},
      msg: "Classes fetched successfully.",
    })
  } catch (err) {
    console.log(err)
    return res.json({
      status: false,
      data: {},
      err,
      msg: "Unable to fetch classes.",
    })
  }
})

// dunno why this is needed
router.get("/:id", async function (req, res) {
  const populateQuery = [
    { path: "routineFor", select: ["programName", "year", "part","section"] },
    { path: "teacherName", select: ["teacherName", "shortName"] },
    { path: "subject", select: ["subjectName", "subjectCode"]}
  ]

  try {
    const id = req.params.id
    const allClasses = await Class.findById({ _id: id })
      .populate(populateQuery)
      .lean()
    
    
    return res.json({
      status: true,
      data: allClasses,
      err: {},
      msg: "Class fetched successfully.",
    })
  } catch (err) {
    return res.json({
      status: false,
      data: {},
      err,
      msg: "Unable to fetch class.",
    })
  }
})


// weekly classes for a given program
router.get("/program/:programID/weekly", async (req, res) => {
  const populateQuery = [
    { path: "routineFor", select: ["programName", "year", "part", "section"] },
    { path: "teacherName", select: ["teacherName", "shortName"] },
    { path: "subject", select: ["subjectName", "subjectCode"]}

  ]

  try {
    const routineFor = req.params.programID;
    let allClasses = await Class.find({routineFor: routineFor})
      .populate(populateQuery)
      .lean()
    // console.log(allClasses);
    if (allClasses.length == 0){
      const dummyClass = {
        routineFor: routineFor,
        subject: dummySubjectID,
        teacherName: [dummyteacherID],
        classType: "L",
        startingPeriod: 0,
        noOfPeriod: 1,
        weekDay: "Sunday",
      }
      console.log("No classes")
      const dummyClassObj = new Class(dummyClass);
      console.log(dummyClassObj)
      await dummyClassObj.save();
      dummyClassObj.populate(populateQuery)
      allClasses.push(dummyClassObj)
    }


    return res.json({
      status: true,
      data: allClasses,
      err: {},
      msg: "Classes fetched successfully.",
    })
  } catch (err) {
    console.log(err)
    return res.json({
      status: false,
      data: {},
      err,
      msg: "Unable to fetch classes.",
    })
  }
})


// daily classes for a given program
router.get("/program/:programID/daily/:day", async (req, res) => {
  const populateQuery = [
    { path: "routineFor", select: ["programName", "year", "part", "section"] },
    { path: "teacherName", select: ["teacherName", "shortName"] },
    { path: "subject", select: ["subjectName", "subjectCode"]}
  ]

  try {
    const routineFor = req.params.programID;
    const day = req.params.day;

    const allPrograms = await Class.find({routineFor: routineFor, weekDay: day})
      .populate(populateQuery)
      .lean()
    // console.log(allPrograms)
    return res.json({
      status: true,
      data: allPrograms,
      err: {},
      msg: "Classes fetched successfully.",
    })
  } catch (err) {
    return res.json({
      status: false,
      data: {},
      err,
      msg: "Unable to fetch classes.",
    })
  }
})


// classes for a given teacher
router.get("/teacher/:teacherID", async (req, res) => {
  const populateQuery = [
    { path: "routineFor", select: ["programName", "year", "part","section"] },
    { path: "teacherName", select: ["teacherName", "shortName"] },
    { path: "subject", select: ["subjectName", "subjectCode"]}
  ]

  try {
    const routineFor = req.params.teacherID;
    // console.log(routineFor)
    const allPrograms = await Class.find({teacherName: routineFor})
      .populate(populateQuery)
      .lean()
    return res.json({
      status: true,
      data: allPrograms,
      err: {},
      msg: "Classes fetched successfully.",
    })
  } catch (err) {
    return res.json({
      status: false,
      data: {},
      err,
      msg: "Unable to fetch classes.",
    })
  }
})

// check if a given class overlaps with other classes in the same routine
router.get("/valid/:programID/day/:day/period/:periodNo/nperiods/:nperiods", async (req, res) => {
  const populateQuery = [
    { path: "routineFor", select: ["programName", "year", "part","section"] },
    { path: "teacherName", select: ["teacherName", "shortName"] },
    { path: "subject", select: ["subjectName", "subjectCode"]}
  ]
  try {
    const routineFor = req.params.programID;
    const nperiods = parseInt(req.params.nperiods);
    const periodNo = parseInt(req.params.periodNo);
    const day = req.params.day;
    const allClasses = await Class.find({routineFor: routineFor, weekDay:day})
    .populate(populateQuery)
    .lean()

    let valid = {
      valid: true,
      overlap: {}
    };

    if (periodNo + nperiods - 1 > 8){
      valid = {valid: false, overlap: {}}
    }
    // console.log(allClasses)
    for (let c of allClasses){
      const classStart = c.startingPeriod;

      if(classStart > periodNo && classStart <= (periodNo + nperiods - 1)){
        valid = {valid: false, overlap: c}
        console.log(c)
        break;
      }
    }

    return res.json({
      status: true,
      data: valid,
      err: {},
      msg: "Classes fetched successfully.",
    })
  } catch (err) {
    console.log(err)
    return res.json({
      status: false,
      data: {},
      err,
      msg: "Unable to fetch classes.",
    })
  }
})

// check if a given teacher is available for a given period
router.get("/available/teacher/:teacherID/day/:day/period/:periodNo/nperiods/:nperiods", async (req, res) => {
  const populateQuery = [
    { path: "routineFor", select: ["programName", "year", "part","section"] },
    { path: "teacherName", select: ["teacherName", "shortName"] },
    { path: "subject", select: ["subjectName", "subjectCode"]}
  ]

  try {
    const routineFor = req.params.teacherID;
    const day = req.params.day;
    const periodNo = parseInt(req.params.periodNo);
    const nperiods = parseInt(req.params.nperiods);
    
    const allClasses = await Class.find({teacherName: routineFor, weekDay: day})
    .populate(populateQuery)
    .lean()
    let availability = {available: true, overlapClass :{}}


    const newPeriodEnd = periodNo + nperiods;
    const newPeriodStart = periodNo;
    for (let c of  allClasses){
      if (c.startingPeriod == newPeriodStart)
        continue;
      const classEnd = c.startingPeriod + c.noOfPeriod;
      const classStart = c.startingPeriod;
      if (classStart <=  periodNo && classEnd > periodNo){
        availability = {
          available: false,
          overlapClass: c,
          overlapAt: periodNo
        };
        break;
      }
      if (newPeriodStart < classStart && newPeriodEnd > classStart){
        availability = {
          available: false,
          overlapClass: c,
          overlapAt: classStart
        };
        break;
      }

    }

    console.log(availability)
    return res.json({
      status: true,
      data: availability,
      err: {},
      msg: "Classes fetched successfully.",
    })
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
      data: {},
      err: err,
      msg: "Unable to fetch classes.",
    })
  }
})


// add class to db
router.post("/", async function (req, res) {
  console.log(req.body);
  const {
    routineFor,
    subjectID,
    teacherName,
    classType,
    classGroup,
    startingPeriod,
    noOfPeriod,
    weekDay,
  } = req.body

  try {
    const newClass = new Class({
      routineFor: routineFor,
      subject: subjectID,
      teacherName: teacherName,
      classType: classType,
      classGroup: classGroup,
      startingPeriod: startingPeriod,
      noOfPeriod: noOfPeriod,
      weekDay: weekDay,
    })
    console.log(newClass)
    await newClass.save()
    return res.json({
      status: true,
      data: newClass,
      err: {},
      msg: "Class added successfully.",
    })
  } catch (err){
    console.log(err)
    return res.json({
      status: false,
      data: {},
      err: err,
      msg: "Unable to add class.",
    })
  }
})

// edit class with id
router.post("/edit/:classID", async function (req, res) {
  const {
    routineFor,
    subjectID,
    teacherName,
    classType,
    classGroup,
    startingPeriod,
    noOfPeriod,
    weekDay,
  } = req.body
  console.log(req.body);

  try {
    const selectedClass = await Class.findById(req.params.classID);
    selectedClass.routineFor = routineFor;
    selectedClass.subject = subjectID;
    selectedClass.teacherName = teacherName;
    selectedClass.classType = classType;
    selectedClass.classGroup = classGroup;
    selectedClass.startingPeriod = startingPeriod;
    selectedClass.noOfPeriod = noOfPeriod;
    selectedClass.weekDay = weekDay;

    console.log(selectedClass);
    await selectedClass.save();
    return res.json({
      status: true,
      data: selectedClass,
      err: {},
      msg: "Class updated successfully.",
    })
  } catch (error) {
    console.log(err)
    return res.json({
      status: false,
      data: {},
      err: err,
      msg: "Unable to update class.",
    })
  }
})

// delete class with given id
router.delete("/delete/:id", async function (req, res) {
  try {
    await Class.deleteOne({ _id: req.params.id })
    return res.json({
      status: true,
      // data: deletedObject,
      msg: "Class deleted successfully.",
    })
  } catch (err) {
    return res.json({
      status: false,
      data: {},
      msg: "Unable to delete class.",
    })
  }
})

module.exports = router
