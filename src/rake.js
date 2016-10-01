function rakeCreateBattery(){
  var state =  [NEED,    NEED,    NEED,  ABSENT, CHARGING, CHARGING, CHARGING, READY, READY];
  var status = [BREAKIN, REFRESH, CYCLE, 1234,   BREAKIN,  REFRESH,  CYCLE,    1999,  1000];
  var new_battery = {};
  for (var i=0; i<state.length; i++){
    var id = setId(batteriesSheet);  
    new_battery = {
      id: id,
      name: "Battery"+id,
      capasity: 2000,
      date_on: new Date(),
      date_off: '',
      state: state[i],
      date: '',
      status: status[i],
      all_count_cycle: 0,
      count_cycle: 0,
      date_cycle: '',
      all_count_refresh: 0,
      count_refresh: 0,
      date_refresh: '',
      count_breakin: 0,
      date_breakin: ''
    }
    create(batteriesSheet, new_battery);
  }
  
  
  
}