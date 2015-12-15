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

app.controller("Schedules", function($scope, Control) {
	$scope.house = "2";
	$scope.module = "0";
	$scope.turnOn = function() {
		Control.get({ house: $scope.house, module: $scope.module, command: "on"});
	};
	$scope.turnOff = function() {
		Control.get({ house: $scope.house, module: $scope.module, command: "off"});
	};
});

app.factory("Control", function($resource) {
	return $resource("/api/:house/:module/:command", {id: "@id"});
});

})();
