var app = angular.module('app', ['ui.router', 'ngAnimate', 'ngSanitize', 'templates', 'ui.router.title']);


app.run(function($rootScope){
  //console.log('app running!');
});

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  // HTML5 mode
  $locationProvider.html5Mode(true).hashPrefix('!');
  // UI router
  $stateProvider
  .state('home', {
    url: '/home',
    templateUrl: 'views/home.html',
    controller: 'HomeCtrl',
    resolve: {
      $title: function() { return 'T-Mobile POC'; }
    }
  })
  // Send undefined routes back home
  $urlRouterProvider.otherwise('/home');
});
