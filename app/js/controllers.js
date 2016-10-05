var app = angular.module('batteriesApp', ['ngRoute']);
var url = 'https://script.google.com/macros/s/AKfycbwVTQOXZXzEKOw2NaRujZmF2tXsnsXXnfSFWptyVNwcj57pjxLt/exec';

app.config(function($routeProvider) {
$routeProvider
  .when('/', {
      templateUrl : 'new.html',
  })
  .when('/index', {
      templateUrl : 'new.html',
  })
  .when('/dashboard', {
      templateUrl : 'dashboard.html',
  })
  .otherwise({
    template : 'dashboard.html',
  });
});

app.controller('loaderPage', function ($scope) {
  $scope.loading = false;
});

app.controller('NewBattery', function ($scope, $http) {
  $scope.isActive = function(route) {
    return route === $location.path();
  };
  $scope.batteries = [];
  $scope.okButtonValue = 'Add';
  $scope.loading = false;
  $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  $scope.init = function () {
    $scope.loading = true;
    var data = $.param({data: JSON.stringify({battery: {'control': 'get_batteries'}})});
    $http.post(url, data)
      .success(function (data) {
        $scope.batteries = data;
        $scope.loading = false;
      })
      .error(function (data){
        console.log('eroor');
        console.log(data);
        $scope.loading = false;
      });
  };

  $scope.editBattery = function () {
    $scope.loading = true;
    var battery = {
      'control': 'edit_battery',
      'id': $scope.current_battery.id,
      'name': $scope.current_battery.name,
      'capasity': $scope.current_battery.capasity
    };
    var data = $.param({data: JSON.stringify({battery})});
    $http.post(url, data)
      .success(function (data) {
        $scope.loading = false;
      })
      .error(function (data){
        $scope.loading = false;
      });
    $scope.okButtonValue = 'Add';
    $scope.current_battery = {};
  };

  $scope.setEditBattery = function (id, index){
    $scope.okButtonValue = 'Save';
    $scope.current_battery = $scope.batteries[index];
  };

  $scope.deleteBattery = function (id, index) {
    $scope.loading = true;
    var battery = {'control': 'del_battery', 'id': id};
    var data = $.param({data: JSON.stringify({battery})});
    $http.post(url, data)
      .success(function () {
        $scope.loading = false;
        $scope.batteries.splice(index, 1);
      })
      .error(function() {
        $scope.loading = false;
      });
  };

  $scope.createBattery = function () {
    $scope.loading = true;
    $scope.okButtonValue = 'Add';
    var battery = $scope.current_battery;
    battery.control = 'add_battery';
    if (battery.name.length !== 0 && battery.capasity.length !== 0){
      var data = $.param({data: JSON.stringify({battery})});
      $http.post(url, data)
        .success(function (data) {
          $scope.batteries.push(data);
          $scope.loading = false;
          $scope.current_battery = {};
        }).error(function (data){
          $scope.loading = false;
          $scope.current_battery = {};
        });
    } else {
      alert('Не валідно!');
    }
  };
});

function getMaxLength(array) {
  var max = array[Object.keys(array)[0]].length;
  for (var i in array) {
    if (array[i].length > max) {
      max = array[i].length;
    }
  }
  return max;
}

app.controller('DashBoard', function ($scope, $http) {
  $scope.isActive = function(route) {
     return route === $location.path();
  };
  $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  $scope.columns= ['need', 'charging', 'ready', 'absent'];
  $scope.loading = false;
  $scope.init = function () {
    var battery = {'control': 'dashboardBatteries'};
    $scope.loading = true;
    var data = $.param({data: JSON.stringify({battery})});
    $http.post(url, data)
      .success(function (data) {

        $scope.batteries = data;
        console.log($scope.batteries);
        $scope.loading = false;
        $scope.maxBattery = getMaxLength($scope.batteries)
      })
      .error(function (data){
        console.log('eroor');
        $scope.loading = false;
      });
  };

  var indexedColumns = [];
  $scope.batteriesToFilter = function() {
      indexedColumns = [];
      return $scope.batteries;
  };

  $scope.filterColumns = function(battery) {
      var columnIsNew = indexedColumns.indexOf(battery.state) == -1;
      if (columnIsNew) {
          indexedColumns.push(battery.state);
      }
      return columnIsNew;
  };

  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  $scope.operateBattery = function (battery){
    if ((battery.state != 'charging') || (isNumeric(battery.current_capasity))){
      $scope.loading = true;
      battery.control = 'proceed_battery';
      var data = $.param({data: JSON.stringify({battery})});
      $http.post(url, data).success(function (data) {
        $scope.loading = false;
        battery.state = data.battery.state;
        battery.status = data.battery.status;
        console.log($scope.batteries);
      }).error(function(){
        console.log('Error');
        $scope.loading = false;
      });
    }
  };
});
