'use strict';

/**
 * @ngdoc function
 * @name realApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the realApp
 */
angular.module('realApp')
		.controller('AdminCtrl', function ($scope, $rootScope, $window, $filter, $http, editableOptions, editableThemes, ngDialog) {
			editableOptions.theme = 'bs2';
			if ($window.sessionStorage.login !== "success") {// login state checkout
				$window.location.href = '#/login';
			} else {
				$('.navbar').show();
			}
			$scope.users = []; //user information getting
			var request = $http({
				method: "post",
				headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				url: HOST_DIRECTORY + "get_users"
			});
			request.success(
				function (html) {
					$scope.users = html.data;
					$rootScope.pass_data = html.data;
				}
			);

			$scope.saveUser = function (data, user_id) { // origin save button onclick
				angular.extend(data, {id: user_id});
				var request = $http({
					method: "post",
					headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					url: HOST_DIRECTORY + "save_user",
					data: $.param(data)
				});
				request.success(function (html) {
					if (html.result === "WRONG_EMAIL") {
					}
				});
			};
			// gallery edit
			$scope.galleryEdit = function (index, user_id, first_name, last_name, user_email) {
//                alert(index + user_id);
				$window.sessionStorage.request_id = user_id;
				$window.sessionStorage.request_first_name = first_name;
				$window.sessionStorage.request_last_name = last_name;
				$window.sessionStorage.request_user_email = user_email;
				$window.location.href = "#/main";
			}
			// remove user function
			$scope.removeUser = function (user_id) {
				if (confirm("Are you sure you want to delete this user?")) {
					var data = {// user delete
						user_id: user_id
					};
					var request = $http({
						method: "post",
						headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
						url: HOST_DIRECTORY + "delete_user",
						data: $.param(data)
					});
					request.success(function () {
						var request = $http({//re-update
							method: "post",
							headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
							url: HOST_DIRECTORY + "get_users"
						});
						request.success(
								function (html) {
									$scope.users = html.data;
								}
						);
					});
				}
			};
			// add user
			$scope.addUser = function () {
				$scope.inserted = {
					id: "Auto",
					first_name: "",
					last_name: "",
					user_email: "",
					user_password: ""
				};
				$scope.users.push($scope.inserted);
				// page state setting module
				$scope.searchText = "";
				var current_state = Math.ceil((($scope.users.length + 1) / 8).toPrecision(2));
				$scope.pagination.current = current_state;
			};
			// sort function
			$scope.sort = function (key_name) {
				$scope.sortKey = key_name;
				$scope.reverse = !$scope.reverse;
			}
			// pagination module //

			$scope.pageChanged = function (newPage) {
				$window.sessionStorage.currentPage = newPage; // page settting 
			}
			if ($window.sessionStorage.currentPage) {
				$scope.pagination = {
					current: $window.sessionStorage.currentPage
				};
			}
			else {
				$scope.pagination = {
					current: 1
				};
			}
			// Dialog function
			$rootScope.$on('ngDialog.closed', function (e, $dialog) {
				// new user information request
				var request = $http({
					method: "post",
					headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					url: HOST_DIRECTORY + "get_users"
				});
				request.success(
						function (html) {
							$scope.users = html.data;
						}
				);

			});
		});
