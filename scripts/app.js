var HOST_DIRECTORY = "/onpartv/service/";
var DOWNLOAD_LIMIT_TIME = 24; // when  24 hour , new download // slide.html page

'use strict';

/**
 * @ngdoc overview
 * @name realApp
 * @description
 * # realApp
 *
 * Main module of the application.
 */
angular
        .module('realApp', [
            'ngAnimate',
            'ngCookies',
            'ngResource',
            'ngRoute',
            'ngSanitize',
            'ngTouch',
            'xeditable'
        ])
        .config(function ($routeProvider) {
            $routeProvider
                    .when('/', {
                        templateUrl: 'views/main.html',
                        controller: 'MainCtrl',
                        controllerAs: 'main'
                    })
                    .when('/slide', {
                        templateUrl: 'views/slide.html',
                        controller: 'SlideCtrl',
                        controllerAs: 'slide'
                    })
                    .when('/userinfo', {
                        templateUrl: 'views/userinfo.html',
                        controller: 'UserinfoCtrl',
                        controllerAs: 'userinfo'
                    })
                    .when('/login', {
                        templateUrl: 'views/login.html',
                        controller: 'LoginCtrl',
                        controllerAs: 'login'
                    })
                    .when('/fileupload', {
                        templateUrl: 'views/fileupload.html',
                        controller: 'FileuploadCtrl',
                        controllerAs: 'fileupload'
                    })
                    .when('/schedule', {
                        templateUrl: 'views/schedule.html',
                        controller: 'ScheduleCtrl',
                        controllerAs: 'schedule'
                    })
                    .when('/slideshow', {
                        templateUrl: 'views/slideshow.html',
                        controller: 'SlideshowCtrl',
                        controllerAs: 'slideshow'
                    })
                    .otherwise({
                        redirectTo: '/'
                    });
        });

/////////////////////////
//  RootController
//  
/////////////////////////
angular.module("realApp").controller("RootController", function ($scope, $window, $location) {
    // Route Change Watch
    $scope.$on('$routeChangeStart', function () {
        if ($window.sessionStorage.login === "success") {
            $scope.isLogin = true;
        }
        else {
            $scope.isLogin = false;
        }
    });
    $scope.logout = function(){
        $window.sessionStorage.login = "";
        $window.sessionStorage.first_name = "";
        $window.sessionStorage.last_name = "";
        $window.sessionStorage.user_id = "";
        $window.sessionStorage.user_email = "";
        $window.sessionStorage.user_password = "";
    }
    $scope.isActive = function(viewLocation) {
        return viewLocation===$location.path();
    }
});


