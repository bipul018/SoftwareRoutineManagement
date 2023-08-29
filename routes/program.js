var express = require('express')
var router = express.Router()

var Program = require('../Schema/programSchema')



router.get('/', async function (req, res) {
    try {
        const allPrograms = await Program.find({})
        return res.json({
            status: true,
            data: allPrograms,
            err: {},
            msg: "Programmes fetched successfully.",
        })
    } catch (err) {
        return res.json({
            status: false,
            data: {},
            err,
            msg: "Unable to fetch programmes.",
        })
    }
})

router.get('/:id', async function (req, res) {
    try {
        const id = req.params.id
        const allPrograms = await Program.findById({ _id: id })
        return res.json({
            status: true,
            data: allPrograms,
            err: {},
            msg: "Programmes fetched successfully.",
        })
    } catch (err) {
        return res.json({
            status: false,
            data: {},
            err,
            msg: "Unable to fetch programmes.",
        })
    }
})

// find program and return id
router.get('/programName/:programName/year/:year/part/:part/section/:section', async function (req, res) {
    try {
        let programDetails = req.params
        let detailsObj = {
            programName: programDetails.programName,
            year: parseInt(programDetails.year),
            part: programDetails.part,
            section: programDetails.section  
        };
        let foundProgramObj = await Program.findOne(detailsObj)

        if (foundProgramObj == undefined){
            const newProgramObj = new Program(detailsObj);
            await newProgramObj.save();
            foundProgramObj = newProgramObj;
            console.log("Added new program")
        }


        const id = foundProgramObj._id;
        return res.json({
            status: true,
            data: id,
            err: {},
            msg: "Program found successfully.",
        })
    } catch (err) {
        

        return res.json({
            status: false,
            data: {},
            err,
            msg: "Unable to find program.",
        })
    }
})

router.post('/add', async function (req, res) {
    const {
        programName,
        year,
        part
    } = req.body

    try {
        var newProgram = new Program({
            programName: programName,
            year: year,
            part: part
        })
        console.log(newProgram)
        newProgram.save()
        return res.json({
            status: true,
            data: newProgram,
            msg: "Programme saved successfully.",
        })
    } catch {
        return res.json({
            status: false,
            data: {},
            msg: "Unable to save programme.",
        })
    }
})

router.post('/edit/:id', async function (req, res) {
    Program.findById(req.params.id, function (err, p) {
        if (!p) {
            return res.json({
                status: false,
                data: {},
                msg: "Unable to update Programmme.",
            })
        } else {
            p.programName = req.body.programName
            p.year = req.body.year
            p.part = req.body.part
            p.save(function (err) {
                if (err) {
                    return res.json({
                        status: false,
                        data: {},
                        msg: "Unable to update programmes.",
                    })
                } else {
                    return res.json({
                        status: true,
                        data: p,
                        msg: "Programme updated Sucessfully",
                    })
                }
            })
        }
    })
})

router.delete('/delete/:id', async function (req, res) {
    try {
        await Program.deleteOne({ _id: req.params.id })
        return res.json({
            status: true,
            // data: deletedObject,
            msg: "Programmes deleted successfully.",
        })
    } catch (err) {
        return res.json({
            status: false,
            data: {},
            msg: "Unable to delete programmes.",
        })
    }
})



module.exports = router