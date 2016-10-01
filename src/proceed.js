  //need, charging, ready, absent
                                        // state                  status
  // 25.02.2014  20140225  52  Break-in  - charging(заряджається) - метод
  // 26.02.2014  20140224  46  2563      - ready(заряджена)       - вмістимість
  // 26.02.2014  20140224  47  Віддали   - absent(віддали)        - дата
  // 01.03.2014  20140225  50  Отримали  - need(прийняли)         - метод

//Need     Імя Метод Коли
//Absent   Імя Заряд Коли
//Ready    Імя Заряд Коли
//Charging Імя Метод Коли
     
// в батарейках зберігається остання дія (state) і дані (status)
// Якщо state = absent (дату коли віддали, з яким зарядом)
//   виводимо в колонці absent
// якщо state = charging 
//   виводимо в колонці charging (яким зарядом, дату коли поставили)
// якщо state = ready, остання дата < 14 днів і останній заряд > 1500
//   виводимо в колонці ready (який заряд, коли зарядився)
// інакше
//   виводимо в колонці need, яким методом


//NEDD click (поклали на зарядку)
//бере метод який був на вюсі стейт записується (він має бути той самий), state міняється на charging
//Charching - click

function test(){
//  var battery = {name: 'b2', control: 'proceed_battery', id: 2, state: 'need', status: 'break-in'};
  var battery = {'id': 1, 'name': 1234, 'state': "charging", 'status': "breakin", 'current_capasity': 1234};
  proceedBattery(battery);
}
function getMethod(battery){
  var options = getOptions();
  var result = {};
  if (checkBatteryBreakIn(battery, options)){
    result = {state: NEED, status: BREAKIN}
  }else{
    if (checkBatteryRefresh(battery, options)){
      result = {state: NEED, status: REFRESH};
    }else{
      if (checkBatteryCycle(battery, options)){
        result = {state: NEED, status: CYCLE};
      }else{
        if (battery.current_capasity){
          result = {state: READY, status: battery.current_capasity};
        }else{
          result = {state: battery.state, status: battery.status};
        }
      }
    }
  }
  return result;
}

//Зробити щоб каунтери рахувались коли знімаєш з зарядки
//перенести ready до need (то то саме)
//використовувати battery
function proceedBattery(battery_income) {
//  {name=b2, control=proceed_battery, id=2, state=need, status=cycle} 
//  Object {id: 1, name: 1234, state: "charging", status: "breakin", current_capasity: 1234} if charging to ready
  var battery = getObjectById(battery_income.id);
  var battery_to_set = {};
  if (battery.state == NEED){
    var result = getMethod(battery);
    battery_to_set = {'id': battery.id,
                      'count_breakin': battery['count_breakin']+1,
                      'date': new Date(),
                      'date_breakin': new Date(),
                      'state': CHARGING,
                      'status': battery.status}
    if (battery.status == BREAKIN){
      battery_to_set = {'id': battery.id,
                        'count_breakin': battery['count_breakin']+1,
                        'date': new Date(),
                        'date_breakin': new Date(),
                        'state': CHARGING,
                        'status': BREAKIN}
    }else{
      if (battery.status == REFRESH){
        battery_to_set = {'id': battery.id,
                          'status': REFRESH,
                          'count_refresh': parseInt(battery['count_refresh'])+1,
                          'all_count_refresh': parseInt(battery['all_count_refresh'])+1,
                          'date_refresh': new Date()}
      }else{
        if (battery.status == CYCLE){
          battery_to_set = {'id': battery.id,
                            'status': CYCLE,
                            'state': CHARGING,
                            'count_cycle': parseInt(battery['count_cycle'])+1,
                            'all_count_refresh': parseInt(battery['all_count_cycle'])+1,
                            'date_cycle': new Date()}
        }
      }
    }
  }else{
    if (battery.state == CHARGING){
      var battery2 = battery_income;
      battery2.status = battery_income.current_capasity;
      battery2.capasity = battery.capasity;
      var result = getMethod(battery2);
      battery_to_set = {'id': battery_income.id,
                        'state': result.state,
                        'date': new Date(),
                        'status' :result.status};
    }else{
      if (battery_income.state == READY){
         battery_to_set = {'id': battery_income.id,
                           'state': ABSENT,
                           'date': new Date(),
                           'status': battery_income.status};
      }else{
        if (battery_income.state == ABSENT){
          var result = getMethod(battery_income);
          battery_to_set = {'id': battery_income.id,
                           'state': result.state,
                           'date': new Date(),
                           'status': result.status};
        }
      }
    }
  }
  setBattery(battery_to_set);
  return {'battery': battery_to_set};
  

}
//  return {'good': 'good'};
  
//  Поміняти status, count_breakin	date_breakin
  //status, all_count_refresh	count_refresh	date_refresh
  // status all_count_cycle	count_cycle	date_cycle

//count_refresh=0.0, 
//all_count_cycle=0.0, 
//all_count_break=0.0, 
//count_break=0.0, 
//capasity=2.0, 
//date_cycle=0.0, 
//date_on=Sat Oct 17 19:05:52 GMT+03:00 2015, 
//name=Перша, 
//count_cycle=0.0, 
//id=11.0, 
//date_break=0.0, 
//all_count_refresh=0.0, 
//date_off=, 
//status=new2, 
//date_refresh=0.0


//1. Нова батарейка - Break-in
//2. Якшо 10 раз charge - refresh
//3. Якщо 30 раз charge або\і redresh - break-in
//4. Якщо 2 тижні не заряджалась - Refresh
//5. Якщо 3 місяці - Break-in
//  
//коли останній брейк
//коли останній рефреш
//коли остання зарядка
//остання ємність
//
//Дні
//0 - break-in
//<14 - charge
//
//14<30 - refresh
//30 - break-in
//рази
//10 - refresh
//30 - break-in
//
//Ємність
//<1900 break-in3
//Якшо не спрацювало - refresh3+break-in (якшо покращення>10%) -break-in*3 інакше здох
//Якшо Hight - здох (або discharge+ refresh);