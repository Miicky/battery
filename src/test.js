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
  var arr = [1, -1, 2, -2, 3];

  var positiveArr = aa.filter(function(battery) {
    Logger.log(battery);
    return battery.state == 'charging';
  });

  Logger.log( positiveArr ); // 1,2,3
}
