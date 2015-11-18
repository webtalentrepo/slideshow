/**
 * @ngdoc function
 * @name realApp.controller:DialogCtrl
 * @description
 * # AdminCtrl
 * Controller of the realApp
 */
angular.module("realApp")
        .controller('UpdateCtrl', function ($scope,$window,$http, $rootScope, ngDialog) {

            // data format
            $scope.first_name = $scope.ngDialogData.first_name;
            $scope.last_name = $scope.ngDialogData.last_name;
            $scope.user_email = $scope.ngDialogData.user_email;
            $scope.user_password = $scope.ngDialogData.user_password;
            // if save button click
            $scope.btnClk = function() {
                var data = {
                        id : $scope.ngDialogData.id,
                        f : $scope.first_name,
                        l : $scope.last_name,
                        e : $scope.user_email,
                        p : $scope.user_password
                }
                var request = $http({
                    method: "post",
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    url: HOST_DIRECTORY + "save_user",
                    data: $.param(data)
                });
                request.success(function (html) {
                    if(html.result==="WORNG_EMAIL"){
                        $scope.wrong_email = true;
                    }
                    else
                    {
                        $scope.closeThisDialog();
                    }
                });
                
                
            }
        });