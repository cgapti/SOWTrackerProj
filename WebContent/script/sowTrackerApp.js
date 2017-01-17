'use strict';

// declare modules
angular.module('sowTrackerApp', ['sowRecordApp', 'orderBookApp', 'ngRoute'])
 
.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/sowRecord', {
            controller: 'myCtrl',
            templateUrl: 'module/sowRecord/views/sowRecord.html'
        })
 
        .when('/orderBook', {
            controller: 'MainCtrl',
            templateUrl: 'module/sowOrderBook/views/WorkOrder.html'
        })
 
        .otherwise({ redirectTo: '/index' });
}])