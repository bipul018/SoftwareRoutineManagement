import moment from "moment";

const weekdays = [
	"Select the Day of Week",
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

function getToday() {
	const dt = new Date();
	return dt.getDay() + 1;
}

function comp(a, b) {
	if (
		Date.parse(moment(`${a.DAY} ${a.START_TIME}`, "dddd h:mm a")) >
		Date.parse(moment(`${b.DAY} ${b.START_TIME}`, "dddd h:mm a"))
	)
		return 1;
	else return -1;
}

const ListEdit = {
	addLecture: async function (
		uuid,
		subjectName,
		teacherName,
		classCode,
		classGroup,
		noOfPeriod,
		courseCode,
		link1,
		startTime,
		endTime,
		day,
		type
	) {
		var list = await localStorage.getItem("class");
		if (list === null) {
			list = {};
			await localStorage.setItem("class", JSON.stringify(list));
		} else {
			list = JSON.parse(list);
		}

		var newId;
		if (uuid === "") {
			const date = new Date();
			newId = date.valueOf();
		} else {
			newId = uuid;
		}

		list.aaaa = {
			a: "a",
			b: "b",
			c: "c",
		};

		const object = {
			SUBJECT_NAME: subjectName,
			TEACHER_NAME: teacherName,
			CLASS_CODE: classCode,
			CLASS_GROUP: classGroup,
			NO_OF_PERIOD: noOfPeriod,
			COURSE_CODE: courseCode,
			LINK1: link1,
			START_TIME: startTime,
			END_TIME: endTime,
			DAY: day,
		};

		list[newId] = object;
		await localStorage.setItem("class", JSON.stringify(list));
	},

	getLectures: async function (type, filter) {
		const today = weekdays[getToday()];
		var list = await localStorage.getItem("class");
		if (list === null) {
			list = {};
			await localStorage.setItem("class", JSON.stringify(list));
		} else {
			list = JSON.parse(list);
		}
		var datalist = [];
		var editedItem;
		Object.entries(list).forEach((item) => {
			if (item[0] !== "aaaa") {
				if (filter === true) {
					if (item[1].DAY === today) {
						editedItem = item[1];
						editedItem["UUID"] = item[0];
						datalist.push(editedItem);
					}
				} else {
					editedItem = item[1];
					editedItem["UUID"] = item[0];
					datalist.push(editedItem);
				}
			}
		});

		datalist.sort(comp);
		return datalist;
	},

	clearTemp: function () {
		localStorage.setItem("temp", "");
	},

	deleteEntry: async function (type, uuid) {
		var list = await JSON.parse(await localStorage.getItem(type));

		delete list[uuid];

		localStorage.setItem(type, JSON.stringify(list));
	},
};

export default ListEdit;
