////https://learn.javascript.ru/mixins
//function Object(){
//  this._createdd = function() {
//    Logger.log('created');
//  }
//}
//
//
//function Battery(params){
//  Object.apply(this, arguments);
////  var ba_create = this.create;
////  this.create = function(){
////    ba_create.call(this);
////  }
//  var columns = ['id', 'name', 'capasity', 'date_on', 'date_off',
//                 'state', 'status', 'date', 'all_count_cycle',
//                 'count_cycle', 'date_cycle', 'all_count_refresh',
//                 'count_refresh', 'date_refresh', 'count_breakin',
//                 'date_breakin'];
//  for (var i in columns){
//    this[columns[i]] = params[columns[i]];
//  }
//}
//
//function test (e){
//  var params = {name: 'Ad', capasity: 10};
//  var a = new Battery(params);
////  Logger.log(a.name);
////  Logger.log(a.date_on);
//  Logger.log(a._createdd());
//  var coffeeMachine = new CoffeeMachine(10000);
//}
//
//
//function Machine() {
//  this._enabled = false; // вместо var enabled
//
//  this.enable = function() {
//    this._enabled = function() {
//    Logger.log('created');
//    }
//  };
//
//  this.disable = function() {
//    this._enabled = function() {
//    Logger.log('fales');
//  }
//  };
//}
//
//function CoffeeMachine(power) {
//  Machine.call(this);
//
//  this.enable();
//
//  Logger.log( this._enabled() ); // true
//}
//
//// Machine.apply(this, arguments);
////
////  var parentEnable = this.enable; // (1)
////  this.enable = function() { // (2)
////      parentEnable.call(this); // (3)
////      this.run(); // (4)
////    }
//
////
////function CoffeeMachine(power, capacity) {
////  //...
////  this.setWaterAmount = function(amount) {
////    if (amount < 0) {
////      throw new Error("Значение должно быть положительным");
////    }
////    if (amount > capacity) {
////      throw new Error("Нельзя залить воды больше, чем " + capacity);
////    }
////
////    waterAmount = amount;
////  };
////
////  this.getWaterAmount = function() {
////    return waterAmount;
////  };
////}
////
////var coffeeMachine = new CoffeeMachine(1000, 500);
////coffeeMachine.setWaterAmount(450);
////alert( coffeeMachine.getWaterAmount() ); // 450
////// --------- Класс-Родитель ------------
////// Конструктор родителя пишет свойства конкретного объекта
////function Animal(name) {
////  this.name = name;
////  this.speed = 0;
////}
////
////// Методы хранятся в прототипе
////Animal.prototype.run = function() {
////  Logger.log(this.name + " бежит!")
////}
////
////// --------- Класс-потомок -----------
////// Конструктор потомка
////function Rabbit(name) {
////  Animal.apply(this, arguments);
////}
////
////// Унаследовать
////Rabbit.prototype = Object.create(Animal.prototype);
////
////// Желательно и constructor сохранить
////Rabbit.prototype.constructor = Rabbit;
////
////// Методы потомка
////Rabbit.prototype.run = function() {
////  // Вызов метода родителя внутри своего
////  Animal.prototype.run.apply(this);
////  Logger.log(this.name + " подпрыгивает!" );
////};
////
////// Готово, можно создавать объекты
////function test2 (){
////  var rabbit = new Rabbit('Кроль');
////  rabbit.run();  
////  var anumal = new Animal('Bla');
////  anumal.run();
////}
