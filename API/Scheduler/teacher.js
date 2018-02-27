"use strict";
class Teacher{

    constructor(id,name,subjects,priorities){
      this.teacher_id = id;
      this.name = name;
      this.subjects=this.copy(subjects);
      this.priorities = this.copy(priorities);
    }
    getName(){
      return this.name;
    }
    getTeacher_id() {
      return this.teacher_id;
    }
    getSubjects(){
      return this.subjects;
    }
    setName(name){
      this.name = name;
    }
    setPriorities(Priorities){
      this.priorities = this.copy(Priorities);
    }
    getPriorities(name){
      return this.priorities;
    }
    setSubjects(subjects){
      this.subjects = this.copy(subjects);
    }
    copy(o){
         var output, v, key;
         output = Array.isArray(o) ? [] : {};
         for (key in o) {
             v = o[key];
             output[key] = (typeof v === "object") ? copy(v) : v;
         }
         return output;
      }
  }

  module.exports = Teacher;
