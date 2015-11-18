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
			// Login Checkout
			if ($window.sessionStorage.login !== "success") {
				$window.location.href = '#/login';
			}

			$scope.access_id = $window.sessionStorage.user_id;
			$scope.first_name = $window.sessionStorage.first_name;
			$scope.last_name = $window.sessionStorage.last_name;
			$scope.user_email = $window.sessionStorage.user_email;
			$scope.change = function () {
				$scope.change_flag = !$scope.change_flag;
				$scope.cur_password = "";
				$scope.new_password = "";
				$scope.con_password = "";
			}
			$scope.updateClk = function () {
				if ($scope.change_flag && $scope.cur_password !== $window.sessionStorage.user_password || $scope.new_password !== $scope.con_password) {
					return false;
				}
				var param = {
					'user_id': $window.sessionStorage.user_id,
					'first_name': $scope.first_name,
					'last_name': $scope.last_name,
					'user_email': $scope.user_email,
					'new_password': $scope.new_password
				};
				var request = $http({
					method: "post",
					headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					url: HOST_DIRECTORY + "update",
					data: $.param(param)
				});
				// Store the data-dump of the FORM scope.
				$window.sessionStorage.first_name = $scope.first_name;
				$window.sessionStorage.last_name = $scope.last_name;
				$window.sessionStorage.user_email = $scope.user_email;
				if ($scope.new_password)
					$window.sessionStorage.user_password = $scope.new_password;
				request.success(function (html) {
					$window.location.href = '#/';
//                    alert("Update Success");
				});
			}
		});
