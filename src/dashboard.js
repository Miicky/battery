function dashboardBatteries() {
  push_log([new Date(), 'dashboard']);
  var batteries = getBatteries();
  var result = defineColumn(batteries);
  var sorted = sortBatteries(result, 'state');
  var max = getMaxLength(sorted);
  var answer = [];
  for (var i=0; i<max; i++) {
    answer.push([checkOption(sorted, 'need', i), checkOption(sorted, 'charging', i),checkOption(sorted, 'ready', i), checkOption(sorted, 'absent', i)])
  }
  return answer;
}

//в батарейках зберігається остання дія (state) і дані (status)
// Якщо 

function defineColumn(batteries){
  var result = []
  for (var i in batteries){
    // if abasent - of charging - sure know where must be
    if (batteries[i].state == ABSENT || batteries[i].state == CHARGING){
      result.push({id: batteries[i].id, name: batteries[i].name, state: batteries[i].state, status:  batteries[i].status});
    }else{
      //if need or ready - check maybe new cycle needed
      var state_status = getMethod(batteries[i]);
      result.push({id: batteries[i].id, name: batteries[i].name, state: state_status.state, status: state_status.status});  
    }
  }
  return result;
}
function checkBatteryBreakIn(battery, options){
  if (getChargeCount(battery.count_cycle, battery.count_refresh) >= options.charge_count || 
      getLastCharge(battery.date_cycle, battery.date_refresh, battery.date_break) >= options.last_charge ||
      battery.status < parseFloat(battery.capasity*options.percentage_capasity/100) || 
      battery.status == BREAKIN ){
    return true
  }else{
    return false
  }
};

function testGetMethod() {
  var battery = {'current_capasity':10,
                 'name' : 'Battery6',
                 'control': 'proceed_battery',
                 'id' :6,
                 'state': CHARGING,
                 'status': 10}
  Logger.log(getMethod(battery));
}


function sortTable(batteries){
  var keys = ["need", "charging", "ready", "absent"];
  var sort_batteries = [];
  for (var i in keys){
    for (var j in batteries){
      if (batteries[j].state == keys[i]){
        sort_batteries.push(batteries[j]);
      }
    }
  }
 return sort_batteries;
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


//1. Нова батарейка - Break-in
//2. Якшо 10 раз charge - refresh
//3. Якщо 30 раз charge або\і redresh - break-in
//4. Якщо 2 тижні не заряджалась - Refresh
//5. Якщо 3 місяці - Break-in