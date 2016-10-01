
function checkBatteryRefresh(battery, options){
  if (getChargeCount(battery.count_cycle, battery.count_refresh) >= 10 || 
      getLastCharge(battery.date_cycle, battery.date_refresh, battery.date_break) >= 14){
    return true;
  }else{
    return false;
  }
};

function checkBatteryCycle(battery, options){
  if (battery.state == NEED || battery.state == ABSENT ){
    return true;
  }else{
    return false;
  }
};

function getOptions(){
  var data = optionsSheet.getDataRange().getValues();
  var options = {};
  for (var i = 0; i<data.length; i++){
    options[data[i][0]] = data[i][1];
  }
  return options;
}
function getDiffDays(start_date, end_date){
  var oneDay = 24*60*60*1000;
  return Math.round(Math.abs((new Date(start_date).getTime() - end_date)/(oneDay)));
};

function getLastCharge(){
  var days = [];
  var today = new Date().getTime();
  for (var i in arguments){
    days.push(getDiffDays(arguments[i], today));
  }
  return Math.min.apply(Math, days);
};

function getChargeCount(cycle, refresh){
  return parseInt(cycle) + parseInt(refresh) ;
};



