(function() {
var app = angular.module("x10", ["ngResource"]);

app.controller("Sandbox", function($scope, Control) {
	$scope.house = "2";
	$scope.module = "0";
	$scope.turnOn = function() {
		Control.get({ house: $scope.house, module: $scope.module, command: "on"});
	};
	$scope.turnOff = function() {
		Control.get({ house: $scope.house, module: $scope.module, command: "off"});
	};
});

app.controller("Schedules", function($scope, Control, Schedule) {
	$scope.schedules = Schedule.query();
	$scope.deleteSchedule = function(schedule) {
		schedule.$delete(function() {
			console.log("deleted");
		});
	};
	$scope.turnOn = function(schedule) {
		Control.get({ house: schedule.house, module: schedule.module, command: "on"});
	};
	$scope.turnOff = function(schedule) {
		Control.get({ house: schedule.house, module: schedule.module, command: "off"});
	};
});

app.controller("Devices", function($scope, Control, Device) {
	$scope.devices = Device.query();
	$scope.deleteDevice = function(device) {
		device.$delete(function() {
			console.log("deleted");
		});
	};
	$scope.turnOn = function(device) {
		Control.get({ house: device.house, module: device.module, command: "on"});
	};
	$scope.turnOff = function(device) {
		Control.get({ house: device.house, module: device.module, command: "off"});
	};
});

app.filter('houseCode', function() {
	return function(code) {
		return String.fromCharCode(parseInt(code) + 65);
	};
});

app.filter('moduleCode', function() {
	return function(code) {
		var pad = "0" + (code + 1);
		return pad.substr(pad.length - 2);
	};
});

app.filter('timeStamp', function($filter) {
	var angularDateFilter = $filter('date');
	return function(ts) {
		return angularDateFilter(new Date(new Date().setHours(0,0,ts,0)), 'HH:mm:ss');
	};
});

app.factory("Control", function($resource) {
	return $resource("/api/:house/:module/:command");
});

app.factory("Schedule", function($resource) {
	return $resource("/api/schedule/:id");
});

app.factory("Device", function($resource) {
	return $resource("/api/device/:id");
});

})();
