const Excel = require('exceljs')

const util = require('util');

//
//  teacher_list : list of teacher as {abv, name, [opt]depart }
//  subject_list : list of subjects studied as {subject_name,  [opt] depart (acc to exam sub code), [opt] subject_code acc to exam} 
//  section_list : list of sections {program, year, part, section, [opt, future use] combined from classes list}
//  routine_list : list of routine entries grouped as a list of {program:, year: , part:, section:, classentries : array of 
//              {day:, classes : array of {teachers:. subject:, slotNo:, nperiods:, type:}}}
//

async function  write_excel(file_name, teacher_list, subject_list,section_list, routine_list){


    let excel_file = new Excel.Workbook();

    //Arrange teachers by depart info if available
    let teachers = [{depart: null, names: []}];
    for(let j = 0; j < teacher_list.length; ++j){
        let curr = teacher_list[j];
        let found = false;
        for(let i = 0; i < teachers.length; ++i){
            let trial = teachers[i];
            if(trial.depart == curr.depart){
                found = true;
                trial.names.push({abv: curr.abv, name: curr.name});
                break;
            }
        }
        if(!found){
            let temp = {
                depart: curr.depart,
                names: [
                    {
                        abv: curr.abv,
                        name: curr.name
                    }
                ]
            };
            teachers.push(temp);
        }
    }

    //Arrange subjects by depart if available
    let subjects = [{depart: null, names: []}];

    
    for(let j = 0; j < subject_list.length; ++j){
        let curr = subject_list[j];
        let found = false;
        
        for(let i = 0; i < subjects.length; ++i){
            let trial = subjects[i];
            if(trial.depart == curr.depart){
                found = true;
                trial.names.push({subject_name: curr.subject_name, subject_code: curr.subject_code});
                break;
            }
        }
        if(!found){
            let temp = {
                depart: curr.depart,
                names: [
                    {
                        subject_name: curr.subject_name,
                        subject_coe: curr.subject_code
                    }
                ]
            };
            subjects.push(temp);
        }
    }


    //Write all teachers
    for(let j = 0; j < teachers.length; ++j){
        let curr_depart_teacher = teachers[j];
        let curr_sheet = excel_file.addWorksheet('Teachers-'+curr_depart_teacher.depart);
        for(let i = 0; i < curr_depart_teacher.names.length; ++i){
            let curr_teacher = curr_depart_teacher.names[i];
            if(curr_depart_teacher.depart != null){
                curr_sheet.addRow([curr_teacher.abv,curr_teacher.name,curr_depart_teacher.depart]);
            }
            else{
                curr_sheet.addRow([curr_teacher.abv,curr_teacher.name]);
            }
            
        }

    }

    //console.log(util.inspect(subjects,true,null,true));


    //Write all subjects
    for(let j = 0; j < subjects.length; ++j){
        let curr_depart_subject = subjects[j];
        let curr_sheet = excel_file.addWorksheet('Subjects-'+curr_depart_subject.depart);
        for(let i = 0; i < curr_depart_subject.names.length; ++i){
            let curr_subject = curr_depart_subject.names[i];
            if(curr_depart_subject.depart != null){
                if(curr_subject.subject_code != null){
                    curr_sheet.addRow([curr_subject.subject_name,curr_depart_subject.depart,curr_subject.subject_code]);
                }
                else{
                    curr_sheet.addRow([curr_subject.subject_name,curr_depart_subject.depart]);
                }
            }
            else{
                curr_sheet.addRow([curr_subject.subject_name]);
            }
        }
    }

    //Write all sections/programs
    let sections_sheet = excel_file.addWorksheet('Sections');
    for(let j = 0; j < section_list.length; ++j){
        let curr_section = section_list[j];
        sections_sheet.addRow([curr_section.program, curr_section.year, curr_section.part, curr_section.section]);
    }

    //Write all classes
    for(let j = 0; j < routine_list.length; ++j){
        let curr_class_routine = routine_list[j];
        let curr_sheet = excel_file.addWorksheet(
            'Classes-'+
            curr_class_routine.program+'-'+
            curr_class_routine.section+'-'+
            curr_class_routine.year.toString()+'-'+
            curr_class_routine.part);
        
        curr_sheet.addRow([curr_class_routine.program,curr_class_routine.year, curr_class_routine.part, curr_class_routine.section]);
        
        for(let i = 0; i < curr_class_routine.classentries.length; ++i){
            let curr_day_entry = curr_class_routine.classentries[i];
            let curr_header = [null,curr_day_entry.day];
            for(let k = 0; k < curr_day_entry.classes.length; ++k){
                let curr_class_entry = curr_day_entry.classes[k];

                curr_sheet.addRow(
                    curr_header.concat([
                        curr_class_entry.subject
                ]));
                curr_header = [null, null];
                curr_sheet.addRow(curr_header.concat([curr_class_entry.type]));
                curr_sheet.addRow(curr_header.concat(curr_class_entry.teachers));
                curr_sheet.addRow(curr_header.concat([curr_class_entry.slotNo]));
                curr_sheet.addRow(curr_header.concat([curr_class_entry.nperiods]));
                

            }
        }
            
    }
    await
    excel_file.xlsx.writeFile(file_name);
    
}

//Returns {
//  teacher_list :, subject_list:, section_list:, routine_list:,
//
//          }
async function read_excel(file_name){

    const excel_file = new Excel.Workbook();
    await 
    excel_file.xlsx.readFile(file_name);
    
    let teachers = []
    
    for(let j = 0; j < excel_file.worksheets.length; j++){
        
        if(excel_file.worksheets[j].name.indexOf('Teachers')!=-1){
            let teachers_sheet = excel_file.worksheets[j];
            console.log('Now reading worksheet : ',teachers_sheet.name);

            teachers_sheet.eachRow(function(row, row_num){
                teachers.push({
                    abv: row.getCell(1).value,
                    name: row.getCell(2).value,
                    depart: row.getCell(3).value,
                });
                //console.log(teachers[teachers.length-1]);
            });
        }
    }
    //console.log("Now the teachers array");
    //console.log(teachers);

    let subjects = [];

    for(let j = 0; j < excel_file.worksheets.length; j++){
        
        if(excel_file.worksheets[j].name.indexOf('Subjects')!=-1){
            let subjects_sheet = excel_file.worksheets[j];
            console.log('Now reading worksheet : ',subjects_sheet.name);

            subjects_sheet.eachRow(function(row, row_num){
                subjects.push({
                    subject_name: row.getCell(1).value,
                    depart: row.getCell(2).value,
                    subject_code: row.getCell(3).value,
                });
                //console.log(teachers[teachers.length-1]);
            });
        }
    }

    let sections = [];
    
    for(let j = 0; j < excel_file.worksheets.length; j++){
        
        if(excel_file.worksheets[j].name.indexOf('Sections')!=-1){
            let sections_sheet = excel_file.worksheets[j];
            console.log('Now reading worksheet : ',sections_sheet.name);

            sections_sheet.eachRow(function(row, row_num){
                sections.push({
                    program: row.getCell(1).value,
                    year: parseInt(row.getCell(2).value),
                    part: row.getCell(3).value,
                    section: row.getCell(4).value
                });
            });
        }
    }



    let routines_data = [];

    let curr_program = "";
    let curr_year = 0;
    let curr_part = "";
    let curr_section = "";
    let curr_classentries = [];
    let curr_day = "Sunday";
    let curr_classes= [];
    
    for(let j = 0; j < excel_file.worksheets.length; j++){
        
        if(excel_file.worksheets[j].name.indexOf('Classes')!=-1){
            
            let classes_sheet = excel_file.worksheets[j];
            console.log('Now reading worksheet : ',classes_sheet.name);
            for(let i = 1; i <= classes_sheet.rowCount; i++){

                let row = classes_sheet.getRow(i);
                //Case for new class section
                if(row.getCell(1).value != null){
                    if(curr_classes.length > 0){
                        curr_classentries.push(
                            {
                                day: curr_day,
                                classes: curr_classes
                            }
                        );
                    }
                    curr_day = row.getCell(2).value;
                    curr_classes = [];
                    //console.log(curr_classentries);

                    if(curr_classentries.length > 0){
                        routines_data.push(
                            {
                                program: curr_program,
                                year: curr_year,
                                part: curr_part,
                                section: curr_section,
                                classentries: curr_classentries
                            }
                        );
                    }
                    curr_program = row.getCell(1).value;
                    curr_year = parseInt( row.getCell(2).value);
                    curr_part = row.getCell(3).value;
                    curr_section = row.getCell(4).value;
                    curr_classentries = [];
                }
                else{

                    //Case for new day
                    if(row.getCell(2).value != null){
                        if(curr_classes.length > 0){
                            curr_classentries.push(
                                {
                                    day: curr_day,
                                    classes: curr_classes
                                }
                            );
                        }
                        curr_day = row.getCell(2).value;
                        curr_classes = [];
                        //console.log(curr_classentries);
                    }
                    let sub = row.getCell(3).value;
                    i++;
                    row = classes_sheet.getRow(i);
                    let lec_type = row.getCell(3).value;
                    i++;
                    row = classes_sheet.getRow(i);
                    let teachers_names = row.values.slice(3,row.cellCount+1);
                    i++;
                    row = classes_sheet.getRow(i);
                    let slt_no = parseInt( row.getCell(3).value);
                    i++;
                    row = classes_sheet.getRow(i);
                    let prd_count = parseInt(row.getCell(3).value);
                    curr_classes.push({
                        teachers: teachers_names,
                        subject: sub,
                        slotNo: slt_no,
                        nperiods: prd_count,
                        type: lec_type
                    });
                    //console.log(curr_classes[curr_classes.length-1])

                }

            }

            //For last case
            if(curr_classes.length > 0){
                curr_classentries.push(
                    {
                        day: curr_day,
                        classes: curr_classes
                    }
                );
            }
            if(curr_classentries.length > 0){
                routines_data.push(
                    {
                        program: curr_program,
                        year: curr_year,
                        part: curr_part,
                        section: curr_section,
                        classentries: curr_classentries
                    }
                );
                //console.log(curr_classentries);

            }
            curr_classes = [];
            curr_classentries = [];
        }
    }   


    return {
        teacher_list: teachers,
        routine_list: routines_data,
        subject_list: subjects,
        section_list: sections
    };

}


//test data
var test_teachers = [
    {abv: 'A', name: 'Aram Haram', depart: 'BCT'},
    {abv : 'B', name: 'Balaram Salaram'},
    {abv : 'C', name: 'Chaluram Thakur'},
    {abv: 'D', name: 'Dhalkumar Simral', depart: 'BCT'},
    {abv: 'E', name: 'Eklo kto', depart: 'ASG'}
];

var test_subjects = [
    {subject_name: 'Computer Architecture'},
    {subject_name: 'Software Engineering', depart: 'BCT'},
    {subject_name: 'JUPT', depart: 'BCT', subject_code: 'u3s'},
    {subject_name: 'aggagw', subject_code: 'gag'}
];

var test_sections = [
    {program: 'BCT', year: 3, part: 'I', section: 'AB'},
    {program: 'BCT', year: 2, part: 'II', section: 'C'}
];

var test_routines = [{
    program: "BCT",
    year: '3',
    part: "I",
    section: "AB",
    classentries: [
        {
        day: "Sunday",
        classes: [
            {
                teachers: ["LNR",'NMR'],
                subject: "Computer Graphics",
                slotNo: 4,
                nperiods: 2,
                type: "L"
            },
            {
                teachers: ["BA"],
                subject: "Computer Organization and Architecture",
                slotNo: 6,
                nperiods: 3,
                type: "P"
            },
            {
                teachers: ["AKS"],
                subject: "Instrumenation II",
                slotNo: 6,
                nperiods: 3,
                type: "P"
            },
        ]
        },
        {
        day: "Monday",
        classes: [
            {
                teachers: ["Prof. Dr. SS"],
                subject: "Computer Organization and Architecture",
                slotNo: 1,
                nperiods: 2,
                type: "L"
            },
            {
                teachers: ["Dr. NBA"],
                subject: "Data Communication",
                slotNo: 3,
                nperiods: 2,
                type: "L"
            },
            {
                teachers: ["Dr. NBA"],
                subject: "Data Communication",
                slotNo: 6,
                nperiods: 3,
                type: "P"
            },
            {
                teachers: ["Dr. AS"],
                subject: "Software Engineering",
                slotNo: 6,
                nperiods: 3,
                type: "P"
            },
        ]
        },
        {
        day: "Tuesday",
        classes: [
            {
                teachers: ["SJ"],
                subject: "Communication English",
                slotNo: 1,
                nperiods: 1,
                type: "L"
            },
            {
                teachers: ["Dr. NBA"],
                subject: "Data Communication",
                slotNo: 2,
                nperiods: 1,
                type: "L"
            },
            {
                teachers: ["KB"],
                subject: "Probability and Statistics",
                slotNo: 3,
                nperiods: 2,
                type: "L"
            },
            {
                teachers: ["LNR", "BA"],
                subject: "Computer Graphics",
                slotNo: 6,
                nperiods: 3,
                type: "P"
            },
            {
                teachers: ["VKY", "SJ"],
                subject: "Communication English",
                slotNo: 6,
                nperiods: 3,
                type: "P"
            },
        ]
        },
        {
        day: "Wednesday",
        classes: [
            {
                teachers: ["SS"],
                subject: "Probability and Statistics",
                slotNo: 1,
                nperiods: 2,
                type: "L"
            },
            {
                teachers: ["MD"],
                subject: "Communication English",
                slotNo: 3,
                nperiods: 1,
                type: "L"
            },
            {
                teachers: ["Dr. NBA"],
                subject: "Data Communication",
                slotNo: 4,
                nperiods: 1,
                type: "L"
            },
            {
                teachers: ["Dr. AS"],
                subject: "Software Engineering",
                slotNo: 6,
                nperiods: 2,
                type: "L"
            },
        ]
        },
        {
        day: "Thursday",
        classes: [
            {
                teachers: ["LNR"],
                subject: "Computer Graphics",
                slotNo: 1,
                nperiods: 2,
                type: "L"
            },
            {
                teachers: ["AKS"],
                subject: "Instrumentation II",
                slotNo: 3,
                nperiods: 2,
                type: "L"
            },
            {
                teachers: ["LNR", "BA"],
                subject: "Computer Graphics",
                slotNo: 6,
                nperiods: 3,
                type: "P"
            },
            {
                teachers: ["VKY", "SJ"],
                subject: "Communication English",
                slotNo: 6,
                nperiods: 3,
                type: "P"
            },
        ]
        },
        {
        day: "Friday",
        classes: [
            {
                teachers: ["Prof. Dr. SS"],
                subject: "Computer Organization and Architecture",
                slotNo: 1,
                nperiods: 2,
                type: "L"
            },
            {
                teachers: ["AKS"],
                subject: "Instrumentation II",
                slotNo: 4,
                nperiods: 2,
                type: "L"
            },
            {
                teachers: ["Dr. AS"],
                subject: "Software Engineering",
                slotNo: 6,
                nperiods: 2,
                type: "L"
            },
            {
                teachers: ["VKY"],
                subject: "Communication English",
                slotNo: 8,
                nperiods: 1,
                type: "L"
            },
        ]
        },
    ]
},{
    program: "BCT",
    year: '2',
    part: "II",
    section: "TB",
    classentries: [
        {
        day: "Sunday",
        classes: [
            {
                teachers: ["LNGR",'NWMR'],
                subject: "Computerga Graphics",
                slotNo: 4,
                nperiods: 2,
                type: "L"
            },
            {
                teachers: ["BA"],
                subject: "Computer Organizagwation and Architecture",
                slotNo: 6,
                nperiods: 3,
                type: "P"
            },
            {
                teachers: ["AKS"],
                subject: "Instrumenation II",
                slotNo: 6,
                nperiods: 3,
                type: "P"
            },
        ]
        },
        {
        day: "Monday",
        classes: [
            {
                teachers: ["Prof. Dr. SS"],
                subject: "Computer Organization and Architecture",
                slotNo: 1,
                nperiods: 2,
                type: "L"
            },
            {
                teachers: ["Dr. NBA"],
                subject: "Data Communication",
                slotNo: 3,
                nperiods: 2,
                type: "L"
            },
            {
                teachers: ["Dr. NBA"],
                subject: "Data Commungaweication",
                slotNo: 6,
                nperiods: 3,
                type: "P"
            },
            {
                teachers: ["Dr. AS"],
                subject: "Software Engineering",
                slotNo: 6,
                nperiods: 3,
                type: "P"
            },
        ]
        },
        {
        day: "Tuesday",
        classes: [
            {
                teachers: ["SJ"],
                subject: "Communication English",
                slotNo: 1,
                nperiods: 1,
                type: "L"
            },
            {
                teachers: ["Dr. NBA"],
                subject: "Data Communication",
                slotNo: 2,
                nperiods: 1,
                type: "L"
            },
            {
                teachers: ["KB"],
                subject: "Probability and Statistics",
                slotNo: 3,
                nperiods: 2,
                type: "L"
            },
            {
                teachers: ["LNR", "BA"],
                subject: "Computer Graphics",
                slotNo: 6,
                nperiods: 3,
                type: "P"
            },
            {
                teachers: ["VKY", "SJ"],
                subject: "Communication English",
                slotNo: 6,
                nperiods: 3,
                type: "P"
            },
        ]
        },
        {
        day: "Wednesday",
        classes: [
            {
                teachers: ["SS"],
                subject: "Probability and Statistics",
                slotNo: 1,
                nperiods: 2,
                type: "L"
            },
            {
                teachers: ["MD"],
                subject: "Communication English",
                slotNo: 3,
                nperiods: 1,
                type: "L"
            },
            {
                teachers: ["Dr. NBA"],
                subject: "Data Communication",
                slotNo: 4,
                nperiods: 1,
                type: "L"
            },
            {
                teachers: ["Dr. AS"],
                subject: "Software Engineering",
                slotNo: 6,
                nperiods: 2,
                type: "L"
            },
        ]
        },
        {
        day: "Thursday",
        classes: [
            {
                teachers: ["LNR"],
                subject: "Computer Graphics",
                slotNo: 1,
                nperiods: 2,
                type: "L"
            },
            {
                teachers: ["AKS"],
                subject: "Instrumentation II",
                slotNo: 3,
                nperiods: 2,
                type: "L"
            },
            {
                teachers: ["LNR", "BA"],
                subject: "Computer Graphics",
                slotNo: 6,
                nperiods: 3,
                type: "P"
            },
            {
                teachers: ["VKY", "SJ"],
                subject: "Communication English",
                slotNo: 6,
                nperiods: 3,
                type: "P"
            },
        ]
        },
        {
        day: "Friday",
        classes: [
            {
                teachers: ["Prof. Dr. SS"],
                subject: "Computer Organization and Architecture",
                slotNo: 1,
                nperiods: 2,
                type: "L"
            },
            {
                teachers: ["AKS"],
                subject: "Instrumentation II",
                slotNo: 4,
                nperiods: 2,
                type: "L"
            },
            {
                teachers: ["Dr. AS"],
                subject: "Software Engineering",
                slotNo: 6,
                nperiods: 2,
                type: "L"
            },
            {
                teachers: ["VKY"],
                subject: "Communication English",
                slotNo: 8,
                nperiods: 1,
                type: "L"
            },
        ]
        },
    ]
}];

module.exports = {read_excel,write_excel}

async function test_stuff(){

await write_excel('test_excel_file.xlsx',test_teachers,test_subjects,test_sections,test_routines);

var excel_data = await read_excel('test_excel_file.xlsx');
console.log(util.inspect(excel_data,true,null,true));
}

//test_stuff();