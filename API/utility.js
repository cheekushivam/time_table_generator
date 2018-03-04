 module.exports = {
   copy: (o) => {
     if (o == null) {
       return null;
     }
     var output, v, key;
     output = Array.isArray(o) ? [] : {};
     for (key in o) {
       v = o[key];
       output[key] = (typeof v === "object") ? copy(v) : v;
     }
     return output;
   },
   crossoverRate: 1.0,
   mutationRate: 0.1,
   populationSize: 1000,
   maxGeneration: 100

 };