function push_log_new(info){
  var log = spreadSheet.getSheetByName('logger');
  log.appendRow(info.unshift(new Date()));
};

function push_log(info){
  var log = spreadSheet.getSheetByName('logger');
  log.appendRow(info);
};