'use strict';

/**
 * @ngdoc function
 * @name realApp.controller:UserinfoCtrl
 * @description
 * # UserinfoCtrl
 * Controller of the realApp
 */
angular.module('realApp')
        .controller('UserinfoCtrl', function ($scope, $http, $window) {
            
            if ($window.sessionStorage.login !== "success") { // login checkout
                $window.location.href = '#/login';
            }

            $scope.updateClk = function () { // if update click
                if ($scope.cur_password !== $window.sessionStorage.user_password || $scope.new_password !== $scope.con_password) {
            
                    return false;
                }
                var param = {
                    'new_password': $scope.new_password
                };
                var request = $http({
                    method: "post",
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    url: HOST_DIRECTORY + "admin_update",
                    data: $.param(param)
                });
                // Store the data-dump of the FORM scope.
                if ($scope.new_password)
                    $window.sessionStorage.user_password = $scope.new_password;
                request.success(
                        function (html) {
                         
                       
                                alert("Update Success");
                     

                        }
                );

            }

        });
