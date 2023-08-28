import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Modal, Button, Tooltip} from "antd";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { AddClassPopupForm } from "../../components/AddClassForm/AddClassForm";
import { EditClassPopupForm } from "../../components/EditClass/EditClass";
import "./Profile.css";
import "../Routine/Routine.css";

import RoutineSelectionComponent from "../../components/RoutineSelectionForm/RoutineSelectionComponent";

// to generate pdf
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { apiClassUrl } from "../../utils/utils";

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});




export default function Admin() {
  const [isUpdating, setIsUpdating] = useState(false);

  return (
    <>
      <RoutineTable isUpdating={isUpdating} setIsUpdating={setIsUpdating} />
    </>
  );
}

function RoutineTable(props) {
  const classes = useStyles();

  const { isUpdating, setIsUpdating } = props;
  let [routineData, setRoutineData] = useState();
  let [selectedOptions, setSelectedOptions] = useState();
  let [res, setResponse] = useState();
  let [isTeacherMode, setIsTeacher] = useState();
  const datae = {};
  let rTable = []

  const routineSelectionComponentRef= useRef(null);

  const clickViewRoutineButton = async()  => {
    if(routineSelectionComponentRef.current){
      await routineSelectionComponentRef.current.handleButtonClick();
    }
  }


  useEffect(()=>{
    if (res && res.data) {
      res.data.map(item => {
        if (!datae[item.weekDay]) {
          datae[item.weekDay] = [];
        }
        // if (!datae[item.weekDay][item.startingPeriod]) {
        //   datae[item.weekDay][item.startingPeriod] = [];
        // }
        datae[item.weekDay].push(item);
      });
    }

    console.log("mf")
    console.log(datae)
    setRoutineData(datae); 
  }, [res])


  useEffect(() =>{
    console.log('aaa')
    console.log(routineData)
  }, [routineData])


  let routineTable = {};
  let teacherTable = {};

  const createRows = (n)=>{
    let rows = []
    for (let i =0 ; i<n; i++){
      let row = [
        {data: {}, rowSpan: 1, colSpan:1, open:true},
        {data: {}, rowSpan: 1, colSpan:1, open:true},
        {data: {}, rowSpan: 1, colSpan:1, open:true},
        {data: {}, rowSpan: 1, colSpan:1, open:true},
        {data: {}, rowSpan: 1, colSpan:1, open:true},
        {data: {}, rowSpan: 1, colSpan:1, open:true},
        {data: {}, rowSpan: 1, colSpan:1, open:true},
        {data: {}, rowSpan: 1, colSpan:1, open:true},
      ];
      rows.push(row)
    }
    return(rows)
  }

  const createIndices = (day)=>{
    let n = 1;
    if (!routineData[day])
      return createRows(1)

    const classes = routineData[day].sort((a,b) => (a.startingPeriod - b.startingPeriod));
    let rowTable = routineData[day].map(c => {return{rowNo: 0, divideIntoSubRows: false};});


    for (let c1Index in classes){
      const c1 = classes[c1Index];
      const c1End = c1.startingPeriod + c1.noOfPeriod - 1;
      
        // check with c2
        for (let c2Index in classes){
          if (c2Index <= c1Index)
            continue;
        
          // if (rowTable[c2Index].rowNo != rows)
          //   continue;

          const c2 = classes[c2Index];
          const c2End = c2.startingPeriod + c2.noOfPeriod - 1;
          
          const c2Row = rowTable[c2Index].rowNo
          const c1Row = rowTable[c1Index].rowNo
          const c2RowSpan = (rowTable[c2Index].divideIntoSubRows)?1:n;
          const c1RowSpan = (rowTable[c1Index].divideIntoSubRows)?1:n;
          // check for overlap if c1 and c2 are in same row
          if ((rowTable[c1Index].rowNo == rowTable[c2Index].rowNo)
            || (c2Row >= c1Row && c2Row < c1Row + c1RowSpan)
            || (c1Row >= c2Row && c1Row < c2Row + c2RowSpan)){
            if ((c2.startingPeriod == c1.startingPeriod)
              || (c2.startingPeriod > c1.startingPeriod && c2.startingPeriod <= c1End)
              || (c1.startingPeriod > c2.startingPeriod && c1.startingPeriod <= c2End)){
              rowTable[c1Index].divideIntoSubRows = true;
              rowTable[c2Index].divideIntoSubRows = true;
              if (c1Row == c2Row)
                rowTable[c2Index].rowNo += 1; 
                
              n = Math.max(rowTable[c2Index].rowNo+1, n);
            }
          }
        }
      
    }

    console.log("mid");
    console.log(classes);
    console.log(rowTable);
    console.log(n)
    
    let classTable = createRows(n);
    console.log(classTable);

    for (let cIndex in classes){
      const c = classes[cIndex];
      console.log(c.subject.subjectName);
      if (c.startingPeriod <= 0)
        continue;

      let rowSpan = (rowTable[cIndex].divideIntoSubRows)? 1:n;
      classTable[rowTable[cIndex].rowNo][c.startingPeriod-1] = {
        data: c, rowSpan: rowSpan, colSpan: c.noOfPeriod, open:false
      }
      console.log(classTable[rowTable[cIndex].rowNo][c.startingPeriod-1]);

      for (let j=0; j<rowSpan; j++){
        for (let i=0; i<c.noOfPeriod; i++){
          
          const columnNo = c.startingPeriod-1 + i;
          const rowNo = rowTable[cIndex].rowNo + j;
          console.log(classTable[rowNo][columnNo])
          console.log(rowNo,columnNo)
          if (i==0 && j == 0)
            continue;
          classTable[rowNo][columnNo] = {
            data: undefined, rowSpan: 1, colSpan: 1, open:false
          } 
          console.log(classTable[rowNo][columnNo])
        }
      }

    }

    console.log("table");
    console.log(classTable);

    return classTable;
  }


  if ( routineData && Object.keys(routineData).length > 0) {
    console.log("routineData")
    console.log(routineData)
    // Add additional data for routine
    // for (let program in routineData) {
      routineTable = {
        Sunday: createIndices("Sunday"),
        Monday: createIndices("Monday"),
        Tuesday: createIndices("Tuesday"),
        Wednesday: createIndices("Wednesday"),
        Thursday: createIndices("Thursday"),
        Friday: createIndices("Friday"),
      };      

      const daysColumn = []
      Object.keys(routineTable).forEach((day) => {
        daysColumn.push({data: day, rowSpan: routineTable[day].length, colSpan: 1, open:false, dayShow:true, day: day});
        for (let i=0; i< routineTable[day].length-1; i++){
          daysColumn.push({data: undefined, open: false, dayShow:false, day: day});
        }
      })

      
      const setTable = ()=>{
        const dayClassesTable = [];
        let daysColumnIndex = 0;
        Object.keys(routineTable).forEach((day) => {
          routineTable[day].forEach((dayRow) => {
            const row = [];
            row.push(daysColumn[daysColumnIndex++])
            dayRow.forEach((classs)=>{
              row.push(classs);
            })
            dayClassesTable.push(row);
          })
        })
        console.log(dayClassesTable);
        return dayClassesTable;
      }
      rTable = setTable();

  }

  // Loops through multiple teachers name &&
  // Creates a teacherTable
  function loopTeacher(teacherNames, idx, noOfPeriods) {
    let teacherArr = [];
    let name = "",
      id = "";

    for (let i = 0; i < teacherNames.length; i++) {
      name = teacherNames[i].teacherName;
      id = teacherNames[i]._id;

      // push multiple teacherNames
      i === teacherNames.length - 1
        ? teacherArr.push(<>{name}</>)
        : teacherArr.push(<>{name} + </>);
    }
    return teacherArr;
  }

  const generatePDF = () => {
    const input = document.querySelector("#admin_table_body");
  
    // Set the page size for the PDF
    const pdf = new jsPDF("p", "pt", "a3");
  
    // Function to convert the HTML element to canvas
    const canvasToImage = async () => {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL("image/png");
      return imgData;
    };
  
    // Convert the HTML to canvas and then to an image
    canvasToImage().then((imgData) => {
      // Add the image to the PDF
      pdf.addImage(imgData, "JPEG", 20, 20, 750, 400);
  
      // Save the PDF with the filename "Myroutine.pdf"
      pdf.save("Myroutine.pdf");
    });
  };
  

  function handleAddClassForm({program, year, part, section}, day, index) {
    Modal.confirm({
      content: (
        <AddClassPopupForm
          programName={program}
          year={year}
          part={part}
          section={section}
          day={day}
          index={index}
          teacherTable={teacherTable}
          reloadFunc = {clickViewRoutineButton}
        />
      ),
      cancelButtonProps: { style: { display: "none" } },
      okButtonProps: { style: { display: "none" } },
      icon: "",
      width: 720,
      
    });
  }

  function handleEditClassForm({program, year, part, section}, day, index, classObj) {
    Modal.confirm({
      content: (
        <EditClassPopupForm
        programName={program}
        year={year}
        part={part}
        section={section}
        day={day}
        index={index}
        teacherTable={teacherTable}
        classObj={ classObj}
        reloadFunc = {clickViewRoutineButton}
        />
      ),
      cancelButtonProps: { style: { display: "none" } },
      okButtonProps: { style: { display: "none" } },
      icon: "",
      width: 720,
    });
    clickViewRoutineButton();
  }


  function handleDeleteClassForm(id) {
    Modal.confirm({
      title: "Confirm deletion?",
      onOk: async () => {
        await axios.delete(apiClassUrl + `/delete/${id}`);
        clickViewRoutineButton();
      },
    });
  }

  const getEmptyCell = (index, day)=>{
    return(
      // return an empty cell
      <TableCell
        key={index}
        align="center"
        className="border"
        colSpan={1}
      >
        <Tooltip title="Add Class">
          {!isTeacherMode?
          <Button
            type="dashed"
            onClick={() =>{
                const programDetails = {
                  program: selectedOptions.program,
                  year: selectedOptions.year,
                  part: selectedOptions.part,
                  section: selectedOptions.section,
                }
                handleAddClassForm(programDetails, day, index);
              }
            }
            ghost
          >
            +
          </Button>:null}
        </Tooltip>
      </TableCell>
    );
  }

  const getCell = (classData, day, colSpan, rowSpan)=>{

    return(
    <TableCell
      key={classData.startingPeriod}
      align="center"
      className="border"
      style={{ backgroundColor: "#F0F0F0" }}
      colSpan={colSpan}
      rowSpan={rowSpan}
    >
      <b>
        {
          classData.subject.subjectName
        }
        
      </b>
      <br></br>(
      {!isTeacherMode?(<i>
        {loopTeacher(
          classData.teacherName,
          // index,
          classData.noOfPeriod
        )}
      </i>):(<i>
        Year {classData.routineFor.year} {classData.routineFor.programName} {classData.routineFor.section}
      </i>)}
      )<br></br>
      [{classData.classType}]

      <br></br>
      {!isTeacherMode?
      <Tooltip
        title="Add Class"
        placement="bottom"
      >
        <Button
          ghost
          type="dashed"
          size="small"
          onClick={() =>
            {
              const programDetails = {
                program: selectedOptions.program,
                year: selectedOptions.year,
                part: selectedOptions.part,
                section: selectedOptions.section,
              }
              handleAddClassForm(programDetails, day, classData.startingPeriod);
            }
          }
        >
          a
        </Button>
      </Tooltip>:null}
      {!isTeacherMode?
      <Tooltip
        title="Edit Class"
        placement="bottom"
      >
        <Button
          ghost
          type="dashed"
          size="small"
          onClick={() =>
            {
              const programDetails = {
                program: selectedOptions.program,
                year: selectedOptions.year,
                part: selectedOptions.part,
                section: selectedOptions.section,
              }
              handleEditClassForm(
              programDetails,
              day,
              classData.startingPeriod,
              classData
            )}
          }
        >
          e
        </Button>
      </Tooltip>:null}
      {!isTeacherMode?
      <Tooltip
        title="Delete Class"
        placement="bottom"
      >
        <Button
          ghost
          type="dashed"
          size="small"
          onClick={() =>
            handleDeleteClassForm(
              classData._id
            )
          }
        >
          d
        </Button>
      </Tooltip>:null}
    </TableCell>
    )
  }

  // NOTE: data format
  const whole = {
    Sunday: [
      // [{}{}{}{}{}]
      // [{}{}{}{}{}]
      // [{}{}{}{}{}]
      [{data: "a", rowSpan: 2, colSpan:2},{open:false},{data: "a", rowSpan: 2, colSpan: 1},{data: "a", rowSpan: 1, colSpan: 1},{data: "a", rowSpan: 1, colSpan: 1}],
      [{open:false},{open:false},{open:false},{data: "a", rowSpan: 1, colSpan: 1},{open:true}]
    ],
  } 
  

  return (
    <div>
      <RoutineSelectionComponent 
        setResponseParent= {setResponse}
        setSelectedOptionsParent={setSelectedOptions}
        setIsTeacherParent = {setIsTeacher}
        ref = {routineSelectionComponentRef}
      />
      <div id = "admin_table_body">
      
      {routineData? 
              <div>
                <h1
                  style={{
                    textAlign: "center",
                    fontSize: "55px",
                    fontWeight: 700,
                    marginTop: 30,
                  }}
                >
                {!isTeacherMode?
                  (<i>Year {selectedOptions?.year}    {selectedOptions?.program}    {selectedOptions?.section}</i>)
                  :(<i>{selectedOptions?.teacherOptions}</i>)
                }
                </h1>
                <TableContainer
                  component={Paper}
                  style={{ paddingBottom: "80px" }}
                >
                  <Table className={classes.table} aria-label="spanning table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Periods</TableCell>
                        <TableCell align="center">
                          Period 1<br></br>(10:15-11:05)
                        </TableCell>
                        <TableCell align="center">
                          Period 2<br></br>(11:05-11:55)
                        </TableCell>
                        <TableCell align="center">
                          Period 3<br></br>(11:55-12:45)
                        </TableCell>
                        <TableCell align="center">
                          Period 4<br></br>(12:45-01:35)
                        </TableCell>
                        <TableCell align="center">
                          Period 5<br></br>(01:35-02:25)
                        </TableCell>
                        <TableCell align="center">
                          Period 6<br></br>(02:25-03:15)
                        </TableCell>
                        <TableCell align="center">
                          Period 7<br></br>(03:15-04:05)
                        </TableCell>
                        <TableCell align="center">
                          Period 8<br></br>(04:05-04:55)
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        rTable.map((row) => {
                          const day = row[0].day;
                          console.log(row)
                          return(
                            <TableRow>
                              {row.map((cell, index) => {
                                if (!cell.open && cell.dayShow)
                                  return(
                                  <TableCell rowSpan={cell.rowSpan} colSpan={cell.colSpan}>
                                    {cell.data}
                                  </TableCell>)
                                
                                
                                if (!cell.open && cell.data == undefined)
                                  return
                                if (cell.open){
                                  return(
                                    getEmptyCell(index, day)
                                  )
                                }
                                return(
                                  getCell(cell.data, day, cell.colSpan, cell.rowSpan)
                                )
                              })}
                            </TableRow>
                          )
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
        : ""}
        </div>
        <div> 
          <button onClick={generatePDF} className="btn">
            Generate PDF
          </button>
        </div>
    </div>
  );
}
