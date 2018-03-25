 module.exports = {

   crossoverRate: 0.7,
   mutationRate: 0.04,
   populationSize: 400,
   maxGeneration: 10,
   threshold: 0.99,
   offSprings: 4,
   shuffler: 2,
   max_periods_per_week: 8,
   max_periods_per_day: 2,
   max_tests: 1,
   testCase: {
     "Sections": [{
         "name": "CSE-8th",
         "subjects": [{
             "subjectName": "IMT",
             "isLab": false,
             "periodLock": -1,
             "day": -1
           },
           {
             "subjectName": "IWT",
             "isLab": false,
             "periodLock": 1,
             "day": -1
           },
           {
             "subjectName": "Data Mining and Warehousing",
             "isLab": false,
             "periodLock": -1,
             "day": -1
           },
           {
             "subjectName": "Artificial Intelligence",
             "isLab": false,
             "periodLock": -1,
             "day": -1
           },
           {
             "subjectName": "Cyber Security",
             "isLab": false,
             "periodLock": -1,
             "day": -1
           },
           {
             "subjectName": "AI Lab",
             "isLab": true,
             "periodLock": -1,
             "day": -1
           },
           {
             "subjectName": "Network Security Lab",
             "isLab": true,
             "periodLock": -1,
             "day": -1
           },
           {
             "subjectName": "Software Technology Lab",
             "isLab": true,
             "periodLock": -1,
             "day": -1
           },

           {
             "subjectName": "library",
             "isLab": false,
             "periodLock": 7,
             "day": 1
           },
           {
             "subjectName": "MondayTest",
             "isLab": false,
             "periodLock": 1,
             "day": 1
           }
         ]
       },
       {
         "name": "CSE-6th",
         "subjects": [{
             "subjectName": "Computer Networks",
             "isLab": false,
             "periodLock": -1,
             "day": -1
           },
           {
             "subjectName": "Compiler Design",
             "isLab": false,
             "periodLock": -1,
             "day": -1
           },
           {
             "subjectName": "TCP",
             "isLab": false,
             "periodLock": -1,
             "day": -1
           },
           {
             "subjectName": "SEPM",
             "isLab": false,
             "periodLock": -1,
             "day": -1
           },
           {
             "subjectName": "Computer Graphics",
             "isLab": false,
             "periodLock": -1,
             "day": -1
           }, {
             "subjectName": "ERP",
             "isLab": false,
             "periodLock": -1,
             "day": -1
           },

           {
             "subjectName": "SEPM Lab",
             "isLab": true,
             "periodLock": -1,
             "day": 5
           },
           {
             "subjectName": "CG Lab",
             "isLab": true,
             "periodLock": 5,
             "day": 2
           },
           {
             "subjectName": "AJP Lab",
             "isLab": true,
             "periodLock": -1,
             "day": 3
           },
           {
             "subjectName": "CN Lab",
             "isLab": true,
             "periodLock": -1,
             "day": 5
           },
           {
             "subjectName": "library",
             "isLab": false,
             "periodLock": 7,
             "day": 3
           },
           {
             "subjectName": "MondayTest",
             "isLab": false,
             "periodLock": 1,
             "day": 1
           }
         ]
       },
       {
         "name": "CSE-4th",
         "subjects": [{
             "subjectName": "Data Structures",
             "isLab": false,
             "periodLock": -1,
             "day": -1
           },
           {
             "subjectName": "Computional Mathematics",
             "isLab": false,
             "periodLock": -1,
             "day": -1
           },
           {
             "subjectName": "CSA",
             "isLab": false,
             "periodLock": -1,
             "day": 5
           },
           {
             "subjectName": "Discrete Mathematics",
             "isLab": false,
             "periodLock": -1,
             "day": 1
           },
           {
             "subjectName": "OOP",
             "isLab": false,
             "periodLock": -1,
             "day": -1
           },
           {
             "subjectName": "Operating Systems",
             "isLab": false,
             "periodLock": -1,
             "day": -1
           },

           {
             "subjectName": "OOP Lab",
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
             "subjectName": "CHM Lab",
             "isLab": true,
             "periodLock": -1,
             "day": -1
           },
           {
             "subjectName": "GUI Lab",
             "isLab": true,
             "periodLock": -1,
             "day": -1
           },
           {
             "subjectName": "library",
             "isLab": false,
             "periodLock": 7,
             "day": 2
           },
           {
             "subjectName": "MondayTest",
             "isLab": false,
             "periodLock": 1,
             "day": 1
           }
         ]
       }
     ],
     "Teachers": [{
         "name": "KKP",
         "subjects": [
           "Computional Mathematics",
           "Discrete Mathematics"
         ],
         "priority": 0
       },
       {
         "name": "RK",
         "subjects": [
           "Cyber Security",
           "Data Structures",
           "OS Lab",
           "DS Lab"
         ],
         "priority": 6
       },
       {
         "name": "Neha Taori",
         "subjects": [
           "TCP",
           "IWT",
           "Software Technology Lab",
           "GUI Lab"
         ],
         "priority": 0
       },
       {
         "name": "Vijaya Chaturdevi",
         "subjects": [
           "SEPM",
           "SEPM Lab"
         ],
         "priority": 0
       },

       {
         "name": "Anupama Sharma",
         "subjects": [
           "Artificial Intelligence",
           "Computer Graphics",
           "CG Lab",
           "AI Lab"
         ],
         "priority": 0
       },
       {
         "name": "Vibha Pandey",
         "subjects": [
           "Operating Systems",
           "IMT",
           "AJP Lab",
           "Network Security Lab"
         ],
         "priority": 0
       },
       {
         "name": "Govind Singh",
         "subjects": [
           "Computer Networks",
           "OOP",
           "OOP Lab",
           "CN Lab"
         ],
         "priority": 0
       },
       {
         "name": "Vikas Singh",
         "subjects": [
           "CSA",
           "ERP",
           "CHM Lab"
         ],
         "priority": 2
       },

       {
         "name": "Anamika Jain",
         "subjects": [
           "Compiler Design",
           "Data Mining and Warehousing"
         ],
         "priority": 1
       },
       {
         "name": "Free Teacher",
         "subjects": [
           "library",
           "MondayTest"
         ],
         "priority": -1
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
     ],
     "lab_periods_after": 4
   }

 };