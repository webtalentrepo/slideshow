'use strict';

/**
 * @ngdoc function
 * @name realApp.controller:FileuploadCtrl
 * @description
 * # Fileupload
 * Controller of the realApp
 */

angular.module('realApp')

		.controller('FileuploadCtrl', function ($scope, $window) {

			var buf = $window.location.href;//checkout
			$scope.bufAry = buf.split("?");
			if ($scope.bufAry[1]) {
				$scope.bufAry1 = $scope.bufAry[1].split("=");
				if ($scope.bufAry1[0] === "request_id") {
					$scope.request_id = $scope.bufAry1[1];
				}
				$scope.back = function () {
					$window.location.href = "#/main";
				}
			}
		});
