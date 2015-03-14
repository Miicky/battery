var spreadSheetId = "0Arh5AkewvAnpdHF1ejNBVzJHN0tpMGdwUDZsWVdLUmc"; 

// change
var ko = 0;

var spreadSheet = SpreadsheetApp.openById(spreadSheetId);
var dataSheet = spreadSheet.getSheetByName("Дані");
var allBatteriesSheet = spreadSheet.getSheetByName("Всі");
var badBatteriesSheet = spreadSheet.getSheetByName("Списані");
 

function getHistory (year, number){
  var history = [];
  for (var j=0; j<allUsedData.length; j++){
    if (allUsedData[j][1].toString() ===  year && allUsedData[j][2].toString()  ===  number){
      history.push(allUsedData[j]);
    };
  };
  return history;
};

function gogogo() {
  "use strict";
  var allBatteries = allBatteriesSheet.getRange(2, 1, allBatteriesSheet.getLastRow() - 1, 2).getValues();

  //get only usable battery
  if (badBatteriesSheet.getLastRow() > 1) {
    var badBatteries = badBatteriesSheet.getRange(2, 1, badBatteriesSheet.getLastRow() - 1, 2).getValues();
    for (var i in allBatteries) {
      for (var j in badBatteries) {
        if (allBatteries[i].toString() === badBatteries[j].toString()){
          allBatteries.splice(i,1);
        };
      };
    };
  };
  //output - array [year, number]
           
  //get all data only used battery  
  var allData = dataSheet.getRange(2, 1, dataSheet.getLastRow(), 4).getValues(); 
  var allUsedData = [];
  for (i in allData){
    for (j in allBatteries){
      if (allData[i][1].toString() == allBatteries[j][0].toString() && allData[i][2].toString() == allBatteries[j][1].toString()){
        allUsedData.push(allData[i]);
      };
    };
  };
  //output - array [day, year, number, action]
  
  //get last action with all used batteries
  var lastActionBatteries = [];
  for (i = 0; i<allUsedData.length; i++){
    for (j = i + 1; j < allUsedData.length; j++){
      if (allUsedData[i][1].toString() == allUsedData[j][1].toString() && allUsedData[i][2].toString() == allUsedData[j][2].toString()){
        j = ++i;  // i = i+1; j=i
      };
    };
    lastActionBatteries.push(allUsedData[i]);
  };
  //output - array [day, year, number, action]

  
  //format massive with current state battery, last element is column in view
  var newActionBattery = []; 
  for (var i in lastActionBatteries){
    var action = lastActionBatteries[i][3];

    //if we haven't battery
    if (action === "Віддали"){ 
      newActionBattery.push([lastActionBatteries[i][1], lastActionBatteries[i][2], "Віддали", "Віддали"]);
    };
    // if last charge < 14 days & last charge > 1500 mah
    if ((!isNaN(parseInt(action))) &&
        (Math.round((new Date().getTime() - lastActionBatteries[i][0].getTime()) / (1000*60*60*24))<14) &&
        (action>1500)) {
          newActionBattery.push([lastActionBatteries[i][1], lastActionBatteries[i][2], action, "Готові"]);
    };
    //if battery charge now
    if (action === "Break-in" || 
        action === "Refresh" || 
        action === "Cycle") {
          newActionBattery.push([lastActionBatteries[i][1],lastActionBatteries[i][2], action,'На зарядці']);
    };
    //if we must charge battery
    if  (action === "Отримали" ||
        (!isNaN(parseInt(action)) &&
        (Math.round((new Date().getTime() - lastActionBatteries[i][0].getTime()) / (1000*60*60*24))>=14 ||
         action<1500))) {
      var year = lastActionBatteries[i][1];
      var number = lastActionBatteries[i][2];
      var history =  getHistory(year, number); //get histroyy this battery
      var lastBreakIn = -1; //0 - its first in array it can be
      var lasrRefresh = -1; //similar
      var countCharge = 0;  //
      var lastChargeDate = 0;
      var lastChargeValue = 0;
      for (var k=0; k<history.length; k++){
        var historyAction = history[k][3];
        if (historyAction.toString() == "Break-in"){
          lastBreakIn = k; //визначає коли останній раз був брейк ін
        };
        if (historyAction.toString() == "Refresh"){
          lastRefresh = k; //визначає коли останній раз був рефреш
        };
        if (historyAction.toString() == "Break-in" || historyAction.toString() == "Refresh" || historyAction.toString() == "Cycle"){
          lastChargeDate = history[k][0]; //визначає коли останній раз була зарядка
        };
        if (!isNaN(historyAction)){
          lastChargeValue = historyAction; //Визначає останню ємність якою була заряжена
        };
      };
      if (lastBreakIn == -1){ //Якщо не було брейкіну - каже треба брейін
        newActionBattery.push([year, number, "Break-in", "Потребують зарядки"]);
      }else { 
        var day_charge = Math.round((new Date().getTime() - lastChargeDate.getTime()) / (1000*60*60*24)); 
        if (day_charge >= 90){ //Якщо заряжалась останній раз 90 днів назад - Брейкін
          newActionBattery.push([year, number, "Break-in", "Потребують зарядки"]);
        }else { if (lastChargeValue<1500){ //Якщо зарядилась на менше 1500 - брейкін
            newActionBattery.push([year, number, "Break-in", "Потребують зарядки"]);
          }else{ if (day_charge>=30){//Якшо заряжалась останній раз більше 30 днів 
              newActionBattery.push([year, number, "Break-in", "Потребують зарядки"]);
            }else { if (day_charge>=10){  //Якшо заряжалась останній раз більше 14 днів - рефреш
                newActionBattery.push([year, number, "Refresh", "Потребують зарядки"]);
              }else{ if (lastRefresh == -1){
                  lastRefresh = lastBreakIn;
                };
                for (var m=lastRefresh; m<history.length; m++){
                  if (history[m][3].toString() == "Cycle"){
                    countCharge++;
                  };
                };
                if (countCharge >= 9 ){ 
                  newActionBattery.push( [year, number, "Refresh", "Потребують зарядки"]);
                }else{
                  newActionBattery.push([year, number, "Cycle", "Потребують зарядки"]);
                };
              };
            };
          };
        };  
      };
    };
  };//end cycle lastActiobBatteries
  return newActionBattery;
};

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
          dataSheet.appendRow([new Date(), on_charge[i][0], on_charge[i][1] , e.parameter['pow'+i]]);
        }
   
  }
  for (i in need_charge){
    b++;
    if (e.parameter['che2'+i] == "true"){
      massive_log.push(need_charge[i][0]+'-'+need_charge[i][1]+' поставили на зарядку');
      dataSheet.appendRow([new Date(), need_charge[i][0], need_charge[i][1] , need_charge[i][2]]);
    }
  }
  for (i in good){
    b++;
    if (e.parameter['che3'+i] == "true"){
      massive_log.push(good[i][0]+'-'+good[i][1]+' віддали');
      dataSheet.appendRow([new Date(), good[i][0], good[i][1] , "Віддали"]);
    }
  }
  for (i in give){
    b++;
    if (e.parameter['che4'+i] == "true"){
      massive_log.push(give[i][0]+'-'+give[i][1]+' Отримали');
      dataSheet.appendRow([new Date(), give[i][0], give[i][1] , "Отримали"]);
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
