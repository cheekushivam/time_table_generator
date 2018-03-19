 module.exports = {

   crossoverRate: 0.60,
   mutationRate: 0.040,
   populationSize: 500,
   maxGeneration: 5,
   threshold: 0.72,
   offSprings: 4,
   suffler: 2,
   max_periods_per_week: 6,
   max_periods_per_day: 2,
   max_tests: 1,
   testCase: {
     "Sections": [{
         "name": "A",
         "subjects": [{
             "subjectName": "English",
             "isLab": false,
             "periodLock": -1,
             "day": 5
           },
           {
             "subjectName": "Maths",
             "isLab": false,
             "periodLock": -1,
             "day": 2
           },
           {
             "subjectName": "Physics",
             "isLab": false,
             "periodLock": -1,
             "day": 1
           },
           {
             "subjectName": "Biology",
             "isLab": false,
             "periodLock": -1,
             "day": 5
           },
           {
             "subjectName": "Chemistry",
             "isLab": false,
             "periodLock": 2,
             "day": -1
           },
           {
             "subjectName": "BiologyLAB",
             "isLab": true,
             "periodLock": -1,
             "day": -1
           },
           {
             "subjectName": "ChemistryLAB",
             "isLab": true,
             "periodLock": -1,
             "day": -1
           },
           {
             "subjectName": "EnglishLab",
             "isLab": true,
             "periodLock": -1,
             "day": -1
           },
           {
             "subjectName": "PhysicsLab",
             "isLab": true,
             "periodLock": 5,
             "day": -1
           },

           {
             "subjectName": "library",
             "isLab": false,
             "periodLock": 7,
             "day": 4
           },
           {
             "subjectName": "MondayTest",
             "isLab": false,
             "periodLock": 1,
             "day": 4
           }
         ]
       },
       {
         "name": "B",
         "subjects": [{
             "subjectName": "C language",
             "isLab": false,
             "periodLock": -1,
             "day": 4
           },
           {
             "subjectName": "JAVA language",
             "isLab": false,
             "periodLock": -1,
             "day": 2
           },
           {
             "subjectName": "Maths",
             "isLab": false,
             "periodLock": -1,
             "day": 5
           },
           {
             "subjectName": "Data Structures",
             "isLab": false,
             "periodLock": -1,
             "day": 1
           },
           {
             "subjectName": "Operating Systems",
             "isLab": false,
             "periodLock": -1,
             "day": 5
           },

           {
             "subjectName": "C Lab",
             "isLab": true,
             "periodLock": -1,
             "day": 4
           },
           {
             "subjectName": "DS Lab",
             "isLab": true,
             "periodLock": 5,
             "day": 2
           },
           {
             "subjectName": "Java Lab",
             "isLab": true,
             "periodLock": -1,
             "day": 3
           },
           {
             "subjectName": "OS Lab",
             "isLab": true,
             "periodLock": -1,
             "day": 5
           },
           {
             "subjectName": "library",
             "isLab": false,
             "periodLock": 7,
             "day": 0
           },
           {
             "subjectName": "MondayTest",
             "isLab": false,
             "periodLock": 1,
             "day": 0
           } // ,
           // {
           //   "subjectName": "Free",
           //   "isLab": false,
           //   "periodLock": -1
           // }
         ]
       }
     ],
     "Teachers": [{
         "name": "Teacher1",
         "subjects": [
           "Physics",
           "C language",
           "OS Lab"
         ],
         "priority": 1
       },
       {
         "name": "Teacher2",
         "subjects": [
           "JAVA language",
           "CPP language",
           "BiologyLAB",
           "DS Lab"
         ],
         "priority": 3
       },
       {
         "name": "Teacher3",
         "subjects": [
           "Maths",
           "Data Structures",
           "English",
           "ChemistryLAB"
         ],
         "priority": 5
       },
       {
         "name": "Teacher4",
         "subjects": [
           "Operating Systems",
           "Chemistry",
           "PhysicsLab"
         ],
         "priority": 6
       },
       {
         "name": "Teacher5",
         "subjects": [
           "Biology",
           "Hindi",
           "Maths",
           "C Lab"

         ],
         "priority": 7
       },
       {
         "name": "Teacher6",
         "subjects": [
           "Operating Systems",
           "Chemistry",
           "Java Lab"

         ],
         "priority": 0
       },
       {
         "name": "Teacher7",
         "subjects": [
           "library",
           "MondayTest",
           "EnglishLab"
         ],
         "priority": 0
       } //,
       // {
       //   "name": "TeacherFree",
       //   "subjects": ["Free"],
       //   "priority": -1
       // }
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
         "Period": 5
       },
       {
         "Day": 5,
         "Period": 7
       }
     ]
   }

 };