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
   crossoverRate: 0.5,
   mutationRate: 0.1,
   populationSize: 1000,
   maxGeneration: 100,
   offSprings: 2,
   suffler: 2

 };