var doc = "0Arh5AkewvAnpdHF1ejNBVzJHN0tpMGdwUDZsWVdLUmc";
var ko = 0;
var mydoc = SpreadsheetApp.getActiveSpreadsheet (); //бере активну таблицю
var ss = SpreadsheetApp.openById(doc); //бере таблицю списку працівників
var sheet = ss.getSheetByName("Дані");
var sheet2 = ss.getSheetByName("Всі");
var sheet3 = ss.getSheetByName("Списані");


function gogogo(){
// формує масив Всі мінус списані
  var used_battery = sheet2.getRange(2, 1, sheet2.getLastRow()-1, 2).getValues();
  var mas = [];
  if (sheet3.getLastRow() > 1){
    var del_battery = sheet3.getRange(2, 1, sheet3.getLastRow()-1, 2).getValues();
    for (var i in used_battery)
      for (var j in del_battery)
        if (used_battery[i].toString() == del_battery[j].toString())
        mas.push(i);
  }
  //used_battery.splice(i, 1);
  //used_battery - всі крім списаних
  var mmm = 0;
  for (var i in mas){
    used_battery.splice(mas[i]-mmm,1);
    mmm++;
  }
        
  //Зчитує всю історію крім тих шо списані
  var last_row_sheet = sheet.getLastRow();
  var all_battery = sheet.getRange(2,1,last_row_sheet,4).getValues(); 
  var clear_history = [];
  for (var i in all_battery)
    for (var j in used_battery)
      if (all_battery[i][1].toString() == used_battery[j][0].toString() && all_battery[i][2].toString() == used_battery[j][1].toString())
      clear_history.push(all_battery[i]);
  //clear_history - вся історія крім списаних
  
  var last_active_battery = [];
  for (var i=0; i<clear_history.length; i++){
    for (var j=i+1; j<clear_history.length; j++)
      if (clear_history[i][1].toString() == clear_history[j][1].toString() && clear_history[i][2].toString() == clear_history[j][2].toString())
      j = ++i;  // i = i+1; j=i
    last_active_battery.push(clear_history[i]);
  }
  //last_active_battery - всі батарейки крім списаних - остання дія з ними
  
  var battery_given = [];
  var charget_battery = [];
  var battery_in_charge = [];
  var down_battery = [];
  var doing_battery = [];
  
  
  for (var i in last_active_battery){
    if (last_active_battery[i][3] == "Віддали")
      doing_battery.push([last_active_battery[i][1], last_active_battery[i][2], "Віддали", "Віддали"]);
    if ((!isNaN(parseInt(last_active_battery[i][3]))) && (Math.round((new Date().getTime() - last_active_battery[i][0].getTime()) / (1000*60*60*24))<14) && (last_active_battery[i][3]>1500))
      doing_battery.push([last_active_battery[i][1], last_active_battery[i][2], last_active_battery[i][3], "Готові"]);
      if (last_active_battery[i][3] == "Break-in" || last_active_battery[i][3] == "Refresh" || last_active_battery[i][3] == "Cycle")
      doing_battery.push([last_active_battery[i][1],last_active_battery[i][2], last_active_battery[i][3],'На зарядці']);
    if  (last_active_battery[i][3] == "Отримали" || (!isNaN(parseInt(last_active_battery[i][3])) && (Math.round((new Date().getTime() - last_active_battery[i][0].getTime()) / (1000*60*60*24))>=14 || last_active_battery[i][3]<1500))) {
      var history = [];
      var year = last_active_battery[i][1];
      var date = last_active_battery[i][2];
      for (var j=0; j<clear_history.length; j++){
        if (clear_history[j][1].toString() ==  year && clear_history[j][2].toString()  ==  date){
          history.push(clear_history[j]);
        }
      }
      var temp_break = -1;
      var temp_refresh = -1;
      var temp_refresh2 = 0;
      var temp_charge = 0;
      var temp_charge_date = 0;
      var temp_charge_value = 0;
      for (var k=0; k<history.length; k++){
        if (history[k][3].toString() == "Break-in")
          temp_break = i; //визначає коли останній раз був брейк ін
        if (history[k][3].toString() == "Refresh")
          temp_refresh = i; //визначає коли останній раз був рефреш
        if (history[k][3].toString() == "Break-in" || history[k][3].toString() == "Refresh" || history[k][3].toString() == "Cycle"){
          temp_charge_date = history[k][0]; //визначає коли останній раз була зарядка
        }
        if (!isNaN(history[k][3]))
          temp_charge_value = history[k][3]; //Визначає останню ємність якою була заряжена
      }
      Logger.log(temp_break);
      Logger.log(temp_refresh);
      Logger.log(temp_charge_date);
      Logger.log(temp_charge_value);
        if (temp_break == -1){ //Якщо не було брейкіну - каже треба брейін
          doing_battery.push([year, date, "Break-in", "Потребують зарядки"]);
        }
        else { 
          var day_charge = Math.round((new Date().getTime() - temp_charge_date.getTime()) / (1000*60*60*24)); 
          if (day_charge >= 90) //Якщо заряжалась останній раз 90 днів назад - Брейкін
            doing_battery.push([year, date, "Break-in", "Потребують зарядки"]);
          else {
            if (temp_charge_value<1500)  //Якщо зарядилась на менше 1500 - брейкін
              doing_battery.push([year, date, "Break-in", "Потребують зарядки"]);
            else{
              if (day_charge>=10 && day_charge <30)  //Якшо заряжалась останній раз більше 14 днів - рефреш
                doing_battery.push([year, date, "Refresh", "Потребують зарядки"]);
              else {
                if (day_charge>=30)
                  doing_battery.push([year, date, "Break-in", "Потребують зарядки"]);
                else{
                  for (var n=temp_break; n<history.length; n++)
                    if (history[n][3].toString() == "Refresh")
                      temp_refresh2++;
                  if (temp_refresh == -1)
                    temp_refresh = temp_break;
                  for (var m=temp_refresh; m<history.length; m++)
                    if (history[m][3].toString() == "Cycle")
                      temp_charge++;
                  if (temp_charge >= 9 ) 
                    doing_battery.push( [year, date, "Refresh", "Потребують зарядки"]);
                  else 
                    doing_battery.push([year, date, "Cycle", "Потребують зарядки"]);
                }
              }
            }
          }  
        }
      
      
      
    }
  }
 return doing_battery;
}
  
  // (стара функція) (стара змінна)  (нова змінна)        (пояснення)
  // (given)           (battery_given)   battery_given      -  батарейки що віддали комусь
  // (charget_on)      (max_battery)     charget_battery    -  батарейки готові до використання
  // (on_charge)       (on_chargest)     battery_in_charge  -  батарейки на зарядці
  // (need_charge)     (down_battery)    down_battery.push  -  батарейки на зарядку






function doGet(){
  
  var massive = gogogo();
  var on_charge = [];
  var need_charge = [];
  var good = [];
  var give = [];
  for (var i in massive){
    if (massive[i][3] == "На зарядці")
      on_charge.push(massive[i]);
    if (massive[i][3] == "Потребують зарядки")
      need_charge.push(massive[i]);
    if (massive[i][3] == "Готові")
      good.push(massive[i]);
    if (massive[i][3] == "Віддали")
      give.push(massive[i]);
  }
  var max_mas = on_charge.length;
  if (max_mas < need_charge.length)
    max_mas = need_charge.length;
  if (max_mas < good.length)
    max_mas = good.length;
  if (max_mas < give.length)
    max_mas = give.length;
  var app2 = UiApp.getActiveApplication();
  if (ko != 0){
    var app = UiApp.getActiveApplication();
    var v1 = app.getElementById('v1');
    v1.clear();
  }
  else{
    var app = UiApp.createApplication().setHeight(800).setWidth(1500).setTitle('Програма контролю заряду акумуляторів');
    var v1 = app.createVerticalPanel().setId('v1');
    var v2 = app.createVerticalPanel().setId('v2');
  }
  var spinner = app.createImage('http://www.banifacyj.narod.ru/Gif_Animations/Kat/cat_walking.gif').setVisible(false).setId('spinner');
  var loadSpinner = app.createClientHandler().forTargets(spinner).setVisible(true);
  var table_logo = app.createGrid(1,2).setBorderWidth(0).setWidget(0, 0, app.createImage('http://www.medcenter.lviv.ua/im/images/logo.jpg'));
  table_logo.setWidget(0, 1, spinner);
  v1.add(table_logo);
  var all_table = app.createGrid(max_mas+1, 4) .setBorderWidth(3).setCellPadding(5).setCellSpacing(10).setStyleAttributes({borderCollapse: "collapse", border: "5px solid #D1E2FF", borderBottom: "5px solid #D1E2FF", borderTop: "5px solid #D1E2FF", borderLeft: "5px solid #fff", borderRight: "5px solid #fff"});

  var handler = app.createServerClickHandler('tellStatus');
  all_table.setWidget(0, 0, app.createLabel('Потребують зарядки')).setStyleAttributes({fontFamily: "Verdana, sans-serif", fontWeight: "bold"});
  if (need_charge.length == 0)
    all_table.setWidget(1,0, app.createLabel(" Немає таких")).setStyleAttributes({fontFamily: "Verdana, sans-serif", fontWeight: "bold"});
  else
    for (i= 0; i<need_charge.length; i++){
      var doub = "";
      var numbb = parseInt(need_charge[i][1]);
      if (numbb>=76 && need_charge[i][1] != "Break-in"){
        if (numbb % 2 == 0)
           doub = "200, 100"
          else  doub ="200, 100";
      }
      var temp_che =app.createCheckBox(i+1+'. '+need_charge[i][0]+'-'+need_charge[i][1]+' '+need_charge[i][2]+' '+doub).setName('che2'+i);
      // номер пп, рік батарейки, номер батарейки, брейк-ін
        handler.addCallbackElement(temp_che);
        all_table.setWidget(i+1, 0, temp_che).setStyleAttributes({fontFamily: "Verdana, sans-serif", fontWeight: "bold"});
      }
  all_table.setWidget(0,1, app.createLabel('На зарядці')).setStyleAttributes({fontFamily: "Verdana, sans-serif", fontWeight: "bold", border: "5px solid #A60400"});
  if (on_charge.length == 0)
    all_table.setWidget(1,1, app.createLabel(" Немає таких")).setStyleAttributes({fontFamily: "Verdana, sans-serif", fontWeight: "bold", color: "#384C80"})
    else
      for (var i=0; i < on_charge.length; i++){
        var mygrid = app.createGrid(1, 2);
        var dLabel = app.createCheckBox(i+1+'. '+on_charge[i][0]+'-'+on_charge[i][1]+' = '+on_charge[i][2]).setName('che1'+i);
        handler.addCallbackElement(dLabel);
        var dLabel2 = app.createTextBox().setName('pow'+i);
        handler.addCallbackElement(dLabel2);
        mygrid.setWidget(0, 0, dLabel).setStyleAttributes({fontFamily: "Verdana, sans-serif", fontWeight: "bold", color: "#384C80"});
        mygrid.setWidget(0, 1, dLabel2).setStyleAttributes({fontFamily: "Verdana, sans-serif", fontWeight: "bold", color: "#384C80"});
        all_table.setWidget(i+1, 1, mygrid).setStyleAttributes({fontFamily: "Verdana, sans-serif", fontWeight: "bold", color: "#384C80"});
      }
  all_table.setWidget(0, 2, app.createLabel('На видачу')).setStyleAttributes({fontFamily: "Verdana, sans-serif", fontWeight: "bold", color: "#384C80"});
  if (good.length == 0) 
    all_table.setWidget(1, 2, app.createLabel(" Немає таких")).setStyleAttributes({fontFamily: "Verdana, sans-serif", fontWeight: "bold", color: "#384C80"})
    else 
      for (var i=0; i<good.length; i++){
        var temp_che2 = app.createCheckBox(i+1+'. '+good[i][0]+'-'+good[i][1]+' = '+good[i][2]).setName('che3'+i);
        handler.addCallbackElement(temp_che2);
        all_table.setWidget(i+1, 2, temp_che2).setStyleAttributes({fontFamily: "Verdana, sans-serif", fontWeight: "bold", color: "#384C80"});
      }
  all_table.setWidget(0,3, app.createLabel('Віддали')).setStyleAttributes({fontFamily: "Verdana, sans-serif", fontWeight: "bold", color: "#384C80"});
  if (give.length == 0)
    all_table.setWidget(1,3,app.createLabel(' Немає таких')).setStyleAttributes({fontFamily: "Verdana, sans-serif", fontWeight: "bold", color: "#384C80"})
    else 
      for (var i=0; i<give.length; i++){
        var temp_che3 = app.createCheckBox(i+1+'. '+give[i][0]+'-'+give[i][1]).setName('che4'+i);
        handler.addCallbackElement(temp_che3);
        all_table.setWidget(i+1, 3, temp_che3).setStyleAttributes({fontFamily: "Verdana, sans-serif", fontWeight: "bold", color: "#384C80"});
      }
  var submitButton = app.createButton("Записати").setWidth(850); 
  submitButton.addClickHandler(loadSpinner);
  submitButton.addClickHandler(handler); 
  v1.add(all_table);
  v1.add(submitButton);
  app.add(v1);
  if (ko == 0){
    var v2 = app.getElementById('v2');
    v2.add(app.createLabel('Лог подій'));
    app.add(v2);
    ko = 1;
    return app;
  }
  else
    return app;
}

function tellStatus(e){
  var ss = SpreadsheetApp.openById(doc); //бере таблицю списку працівників
  var app = UiApp.getActiveApplication(); 
  var v1 = app.getElementById('v1');
  var v2 = app.getElementById('v2');
  app.getElementById('spinner').setVisible(true);
  var massive = gogogo();
  var on_charge = [];
  var need_charge = [];
  var good = [];
  var give = [];
  for (var i in massive){
    if (massive[i][3] == "На зарядці")
      on_charge.push(massive[i]);
    if (massive[i][3] == "Потребують зарядки")
      need_charge.push(massive[i]);
      if (massive[i][3] == "Готові")
      good.push(massive[i]);
    if (massive[i][3] == "Віддали")
      give.push(massive[i]);
  }
  var massive_log = [];
  var b = 0;
  for (i in on_charge){
    b++;
    if (e.parameter['che1'+i] == "true")
      if (e.parameter['pow'+i] == ""){
        massive_log.push(on_charge[i][0]+'-'+on_charge[i][1]+' Ви не вказали ємність. Дію не виконано');
        }
        else{
          massive_log.push(on_charge[i][0]+'-'+on_charge[i][1]+' зняли з зарядки. Ємність: '+e.parameter['pow'+i]);
          sheet.appendRow([new Date(), on_charge[i][0], on_charge[i][1] , e.parameter['pow'+i]]);
        }
   
  }
  for (i in need_charge){
    b++;
    if (e.parameter['che2'+i] == "true"){
      massive_log.push(need_charge[i][0]+'-'+need_charge[i][1]+' поставили на зарядку');
      sheet.appendRow([new Date(), need_charge[i][0], need_charge[i][1] , need_charge[i][2]]);
    }
  }
  for (i in good){
    b++;
    if (e.parameter['che3'+i] == "true"){
      massive_log.push(good[i][0]+'-'+good[i][1]+' віддали');
      sheet.appendRow([new Date(), good[i][0], good[i][1] , "Віддали"]);
    }
  }
  for (i in give){
    b++;
    if (e.parameter['che4'+i] == "true"){
      massive_log.push(give[i][0]+'-'+give[i][1]+' Отримали');
      sheet.appendRow([new Date(), give[i][0], give[i][1] , "Отримали"]);
    }
  }
  ko = 1;
  doGet();
  for (var i in massive_log)
    v2.add(app.createLabel(massive_log[i]));
  app.add(v2);
  app.getElementById('spinner').setVisible(false);
  return app;
}
