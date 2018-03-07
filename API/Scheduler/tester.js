// Only for testing not for production use

const Generator = require('../Scheduler/Generator');
const Data = require('../Scheduler/Data');
json = {
  "Sections": [{
      "name": "A",
      "subjects": [{
          "subjectName": "English",
          "isLab": true,
          "periodLock": 1
        },
        {
          "subjectName": "Hindi",
          "isLab": true,
          "periodLock": 2
        },
        {
          "subjectName": "Maths",
          "isLab": false,
          "periodLock": 3
        },
        {
          "subjectName": "Physics",
          "isLab": false,
          "periodLock": 4
        },
        {
          "subjectName": "Biology",
          "isLab": true,
          "periodLock": 5
        },
        {
          "subjectName": "Chemistry",
          "isLab": true,
          "periodLock": -1
        }
      ]
    },
    {
      "name": "B",
      "subjects": [{
          "subjectName": "C language",
          "isLab": true,
          "periodLock": 1
        },
        {
          "subjectName": "CPP language",
          "isLab": true,
          "periodLock": 2
        },
        {
          "subjectName": "JAVA language",
          "isLab": true,
          "periodLock": 3
        },
        {
          "subjectName": "M1 maths",
          "isLab": false,
          "periodLock": 4
        },
        {
          "subjectName": "Data Structures",
          "isLab": true,
          "periodLock": -1
        },
        {
          "subjectName": "Operating Systems",
          "isLab": true,
          "periodLock": 6
        }
      ]
    }
  ],
  "Teachers": [{
      "name": "Teacher1",
      "subjects": [
        "Physics",
        "C language"
      ],
      "priority": 1
    },
    {
      "name": "Teacher",
      "subjects": [
        "JAVA language",
        "CPP language"
      ],
      "priority": 3
    },
    {
      "name": "Teacher3",
      "subjects": [
        "M1 maths",
        "Data Structures",
        "English"
      ],
      "priority": 5
    },
    {
      "name": "Teacher4",
      "subjects": [
        "Operating Systems",
        "Chemistry"
      ],
      "priority": 0
    },
    {
      "name": "Teacher5",
      "subjects": [
        "Biology",
        "Hindi",
        "Maths"
      ],
      "priority": 0
    },
    {
      "name": "Teacher6",
      "subjects": [
        "Operating Systems",
        "Chemistry"
      ],
      "priority": 0
    }
  ],
  "totalPeriods": 40,
  "DaysDescription": [{
      "Day": 0,
      "Period": 7
    },
    {
      "Day": 1,
      "Period": 7
    },
    {
      "Day": 2,
      "Period": 7
    },
    {
      "Day": 3,
      "Period": 7
    },
    {
      "Day": 4,
      "Period": 7
    },
    {
      "Day": 5,
      "Period": 5
    }
  ]
};
let data = new Data();
let timetable = new Generator(data.getDatafromJSON(json));
let final_table = timetable.generate();
console.log(final_table);