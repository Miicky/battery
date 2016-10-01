function myFunction() {
  var aa = [
  {
    name: "Battery4",
    id: 4.0,
    state: "charging",
    status: "cycle"
  },
  {
    name: "Battery1",
    id: 1.0,
    state: "absent",
    status: "2000.0"
  },
  {
    name: "Battery2",
    id: 2.0,
    state: "need",
    status: "breakin"
  },
  {
    name: "Battery3",
    id: 3.0,
    state: "charging",
    status: "breakin"
  }
];

 var sorted = sortBatteries(aa, 'state');
 var max = getMaxLength(sorted);
 var a = [];
 for (var i=0; i<max; i++) {
   Logger.log([checkOption(sorted, 'need', i), checkOption(sorted, 'charging', i),checkOption(sorted, 'ready', i), checkOption(sorted, 'absent', i)]);
   a.push([checkOption(sorted, 'need', i), checkOption(sorted, 'charging', i),checkOption(sorted, 'ready', i), checkOption(sorted, 'absent', i)])
 }
 Logger.log(a);
}

function checkOption(array, type, i) {
  if (array && array[type] && array[type][i]) {
    return array[type][i];
  } else {
    return null;
  }
}

function getMaxLength(array) {
  var max = array[Object.keys(array)[0]].length;
  for (var i in array) {
    if (array[i].length > max) {
      max = array[i].length;
    }
  }   
  return max;
}

function sortBatteries(array, key) {
  var arr = {};
  for( var i = 0, max = array.length; i < max ; i++ ){
    if( arr[array[i][key]] == undefined ){
      arr[array[i][key]] = [];
    }
    arr[array[i][key]].push(array[i]);
  }
  return arr;
}