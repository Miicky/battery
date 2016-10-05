function doPost(e) {
  var data = JSON.parse(e.parameter.data);
  Logger.log('a');
  push_log([new Date(), 'income parse params', data]);
  var response = getRoute(data.battery);
  return  ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}

function getRoute (battery) {
  var routes = {
    'add_battery': function () {
      return addBattery(battery);
    },
    'get_batteries': function () {
      return getBatteries();
    },
    'del_battery': function () {
      return delBattery(battery.id);
    },
    'edit_battery': function () {
      return setBattery(battery);
    },
    'dashboardBatteries': function () {
      return dashboardBatteries();
    },
    'proceed_battery': function () {
      return proceedBattery(battery);
    },
    'default': function () {
      push_log([new Date(), 'error routes', battery.control]);
      return {error: 'havent routes'};
    }
  };
  return (routes[battery.control] || routes['default'])();
}
