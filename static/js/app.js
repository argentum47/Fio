var app = angular.module('fio', ['fio.services', 'fio.controllers', 'fio.directives'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/io', {templateUrl: 'static/partials/io.html', controller: 'IOCtrl'});
    $routeProvider.when('/recurring', {templateUrl: 'static/partials/recurring.html'});
    $routeProvider.when('/totals', {templateUrl: 'static/partials/totals.html'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);