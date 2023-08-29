// import Class from "./schema/classSchema.js";
const mongoose = require('mongoose')
const Class = require ("./Schema/classSchema.js");
const Program = require ("./Schema/programSchema.js");
const Teacher = require ("./Schema/teacherSchema.js");

const {dummyteacherID, dummySubjectID} = require("./defines/defines.js")

const { subjects, courseCode } = require('./dbdata/subjects.js');
const Subject = require('./Schema/subjectSchema.js');

const dburl = process.env.MONGO_URL + "/" + process.env.MONGO_DB_NAME; 

console.log("Trying to connect to import at ",dburl)

mongoose.connect(dburl, {
     useNewUrlParser: true, useUnifiedTopology: true ,
     user: process.env.MONGO_USER,
     pass: process.env.MONGO_PASS
    })
.then(()=>{

    console.log("Dtata base commnstc");
    setData()
})
.catch((err) => console.log(err));


//import { read_excel,write_excel } from './excel_process.js';
const ExcelParse = require("./excel_process.js")


const setData = async ()=>{

    //await importDataFromExcel();
    {
        class_count =   await Class.countDocuments({});
        teacher_count = await Teacher.countDocuments({});
        program_count = await Program.countDocuments({});
        subject_count = await Subject.countDocuments({});
        console.log("Previous state of database : ")
        console.log("Class Count = " , class_count);
        console.log("Teacher Count = ", teacher_count);
        console.log("Program Count = ", program_count);
        console.log("Subject Count = ", subject_count);

        if((teacher_count > 0) && (program_count > 0) && (subject_count > 0))
        {
            console.log("Database already populated, skipping loading of defaults.");
            process.exit();
        }

        console.log("At least one collection found empty, populating database with defaults.");
    }
    //Only load data if all collections are already populated
    var excel_data = await ExcelParse.read_excel("dbdata/routine_input.xlsx");
    teacherData = excel_data.teacher_list;
    routineData = excel_data.routine_list;
    subjectData = excel_data.subject_list;
    sectionData = excel_data.section_list;



    //console.log(teacherData);
    //console.log(routineData);

    //Clear any garbage collection
    try {
        const db = mongoose.connection.db;
    
        // Get all collections
        const collections = await db.listCollections().toArray();

        
        // Create an array of collection names and drop each collection
        collections
          .map((collection) => collection.name)
          .forEach(async (collectionName) => {
            
            db.dropCollection(collectionName);
        });
    
      } catch (e) {
        console.log(e);
      }


//await mongoose.connection.dropDatabase();
    // make teacher objects and add to db
    const teacherObjs = []
    try{
        await Promise.all(teacherData.forEach(async (item)=>{
            const teach = new Teacher({
                teacherName: item.name,
                shortName: item.abv
            });
            teacherObjs.push(teach)
            // console.log(teach);
            await teach.save();
        }));
    }
    catch(err){console.log(err);}

    console.log("Added teachers")
    //console.log(subjectData);
    const subjectObjs = []
    try{
        // await Promise.all(subjects.forEach(async (item)=>{
        //     const sub = new Subject({
        //         subjectName: item.name,
        //         subjectCode: 
        //     });
        //     teacherObjs.push(teach)
        //     // console.log(teach);
        //     await teach.save();
        // }));
        for (let i = 0; i<subjectData.length; i++){
            const sub = new Subject({
                subjectName: subjectData[i].subject_name,
                subjectCode: subjectData[i].subject_code
            })
            subjectObjs.push(sub);
            await sub.save();
        }
    }
    catch(err){console.log(err);}

    console.log("Added subjects")


    // make routine 
    // const test = new Routine();
    

    for(let routine of routineData){

        let programObj = new Program({
            programName: routine.program,
            year: routine.year,
            part: routine.part,
            section: routine.section,
        })

        await programObj.save();
        // console.log(programObj);

        for (let dayAndClass of routine.classentries){
            // console.log(dayAndClass);
            for(let singleClass of dayAndClass.classes){
                // console.log(singleClass);
                for (let teacherNo in singleClass.teachers){
                    const teacherAbv = singleClass.teachers[teacherNo];
                    // console.log(singleClass.teachers[teacherNo]);
                    const foundTeacher = await teacherObjs.find(t => (teacherAbv == t.shortName));
                    singleClass.teachers[teacherNo] = foundTeacher._id.toString();
                }
                // console.log(singleClass);
                const subjectID = subjectObjs.find(s => s.subjectName == singleClass.subject);
                if (subjectID == undefined){
                    console.log("sub not found:", singleClass.subject);
                }
                // console.log(subjectID)
                let classObj = new Class({
                    routineFor: programObj._id,
                    subject: subjectID,
                    teacherName: singleClass.teachers,
                    startingPeriod: singleClass.slotNo,
                    noOfPeriod: singleClass.nperiods,
                    weekDay: dayAndClass.day,
                    classType: singleClass.type
                })
                // console.log(classObj)

                await classObj.save();

            }

        }

    }
    console.log("Added classes")


    const dummyTeacher = new Teacher({
        _id: dummyteacherID,
        teacherName: "dummy",
        shortName: "dummy",
        designation: "dummy"
    });
    await dummyTeacher.save();
    console.log("Added dummy teacher")

    const dummySubject = new Subject({
        _id: dummySubjectID,
        subjectName: "dummy subject",
        subjectCode: "BRRRRRR"
    });
    await dummySubject.save();
    console.log("Added dummy subject")

    process.exit();
}
