function addBattery(battery){
  //creatinf
  push_log([new Date(), 'add battery', battery]);
  var new_battery = {
    id: setId(batteriesSheet),
    name: battery.name,
    capasity: battery.capasity,
    date_on: new Date(),
    date_off: '',
    state: NEED,
    date: '',
    status: BREAKIN,
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
  return new_battery;
};

function delBattery(id){
  push_log([new Date(), 'delete battery', id]);
  var last_index_row = batteriesSheet.getLastRow();
  var mas_ids = batteriesSheet.getRange(2,1,last_index_row-1,1).getValues();
  var ids = [];
  for (var i in mas_ids){
    ids.push(mas_ids[i][0]);
  }
  var index = ids.indexOf(id);
  if (index == -1){
    var answer = false;
  }else{
    batteriesSheet.deleteRow(index+2);
    var answer = true;
  }
  return answer;
}

function setId(sheet){
  var last_index_row = sheet.getLastRow();
  var last_id = sheet.getRange(last_index_row, 1).getValue();
  var id;
  if (last_id == "id"){
    id = 1;
  }else{
    id = last_id+1;
  }
  return id;
};


function getObjectById(id){
  var battery = {};
  var ids = batteriesSheet.getRange(2,1,batteriesSheet.getLastRow()-1,1).getValues();
  for (var i = 0; i<ids.length; i++){
    if (ids[i] == id){
      var data = batteriesSheet.getRange(i+2, 1 ,1, batteriesSheet.getLastColumn() ).getValues()[0];
      var column_name = batteriesSheet.getRange(1,1, 1, batteriesSheet.getLastColumn()).getValues()[0];
      battery = getObject(data, column_name);
    }else{

    };
  };
  return battery;
};

function getData(sheet){
  var lastRow = sheet.getLastRow()-1;
  var lastCol = sheet.getLastColumn();
  var result;
  if (lastRow == 0){
    result = []
  }else{
    result = sheet.getRange(2,1, lastRow, lastCol).getValues();
  }
  return result;
}

function getIds(sheet){
  return sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues();
}

function getRowById(sheet, id){
  var ids = getIds(sheet);
  var row = {'error': 'no id'};
  for (var i = 0; i<ids.length; i++){
    if (ids[i][0] == id){
      row = i+2;
    }
  }
  return row;
};

function getTitles(sheet){
  return sheet.getRange(1,1, 1, sheet.getLastColumn()).getValues()[0];
}

function setValues(sheet, battery, row){
  var names = getTitles(sheet);
  for (var i=0; i<names.length; i++){
    for (var key in battery){
      if (key == names[i] && key != 'id'){
        var b = sheet.getRange(row,i+1, 1,1).setValue(battery[key]);
      }
    }
  }
}

function setBattery(battery){
  push_log([new Date(), 'set battery', battery]);
  var row = getRowById(batteriesSheet, battery.id);
  if(row.constructor != Object){
    setValues(batteriesSheet, battery, row);
  }else{

  }
  return {'true': 'true'};
}

function getBatteries(){
  push_log([new Date(), 'get batteries']);
  var column_names = getTitles(batteriesSheet);
  var data = getData(batteriesSheet);
  var objects = [];
  for (var i in data){
    objects.push(getObject(data[i], column_names));
  };
  return objects;
};

function getObject(data, column_names){
  var object = {};
  for (var i in data){
    object[column_names[i]] = data[i];
  };
  return object;
}

function create(sheet, object){
  var column_name = sheet.getRange(1,1, 1, sheet.getLastColumn()).getValues()[0];
  var obj = [];
  for (var i in column_name){
    obj[i] = object[column_name[i]];
  };
  sheet.appendRow(obj);
}
