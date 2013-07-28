var app = angular.module('fio', ['fio.services', 'fio.controllers', 'fio.directives', 'fio.filters'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/io', {templateUrl: 'public/partials/io.html', controller: 'IOCtrl'});
  $routeProvider.when('/recurring', {templateUrl: 'public/partials/recurring.html'});
  $routeProvider.when('/totals', {templateUrl: 'public/partials/totals.html'});
  $routeProvider.otherwise({redirectTo: '/io'});
}]);
