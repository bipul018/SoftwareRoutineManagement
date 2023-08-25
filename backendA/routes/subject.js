const express = require("express")
const router = express.Router()

const Subject = require("../Schema/subjectSchema.js");
const { dummySubjectID } = require("../defines/defines.js");


router.get('/all/', async (req, res) => {
    try {
        let subjectObjs = await Subject.find();
        subjectObjs = subjectObjs.filter(s => s._id != dummySubjectID);
        return res.json({
            status: true,
            data: subjectObjs,
            err: {},
            msg: "Subjects fetched successfully.",
        })
    } catch (error) {
        console.log(error);
        return res.json({
            status: false,
            data: {},
            err: error,
            msg: "Couldn't fetch subjects.",
        })
    }
})


router.get('/subjectName/:subjectName', async (req, res) => {
    const {subjectName} = req.params;
    console.log(subjectName)
    try {
        const subjectObj = await Subject.findOne({subjectName: subjectName});
        const subID = subjectObj._id.toString();

        return res.json({
            status: true,
            data: subID,
            err: {},
            msg: "Subject found successfully.",
        })
    } catch (error) {
        console.log(error);
        return res.json({
            status: false,
            data: {},
            err: error,
            msg: "Couldn't find subject.",
        })
    }
})

router.post('/add/', async (req, res) => {
    const {subjectName, subjectCode} = req.body;
    const subjectDetails = {
        subjectName: subjectName,
        subjectCode: subjectCode
    };
    try {
        const subjectObj = new Subject(subjectDetails);
        await subjectObj.save();

        return res.json({
            status: true,
            data: subjectObj,
            err: {},
            msg: "Subject added successfully.",
        })
    } catch (error) {
        console.log(error);
        return res.json({
            status: false,
            data: {},
            err: error,
            msg: "Couldn't add subject.",
        })
    }
})

module.exports = router;
