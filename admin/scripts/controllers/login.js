'use strict';

/**
 * @ngdoc function
 * @name realApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the realApp
 */
angular.module('realApp')
		.controller('LoginCtrl', function ($scope, $http, $window, $rootScope) {

			$scope.btnClk = function () {
				var param = {
					'user_email': $scope.user_email,
					'user_password': $scope.user_password
				};
				var request = $http({
					method: "post",
					headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					url: HOST_DIRECTORY + "login",
					data: $.param(param)
				});
				// Store the data-dump of the FORM scope.
				request.success(
					function (html) {
						if (html.result === "YES" && html.data.user_email === "root") {
							$window.sessionStorage.login = "success";//session create
//								console.log(html.data);
							$window.sessionStorage.first_name = html.data.first_name;
							$window.sessionStorage.last_name = html.data.last_name;
							$window.sessionStorage.user_id = html.data.id;
							$window.sessionStorage.user_email = html.data.user_email;
							$window.sessionStorage.user_password = html.data.user_password;
							$rootScope.isLogin = true;
							// Login Complete //
							$window.location.href = '#/';
						} else {
							alert('Invalid Administrator name or password!');
						}
					}
				);
			}
		});
