'use strict';

/**
 * @ngdoc function
 * @name realApp.controller:ScheduleCtrl
 * @description
 * # ScheduleCtrl
 * Controller of the realApp
 */
angular.module('realApp')
        .controller('ScheduleCtrl', function ($scope, $http, $window) {

            if ($window.sessionStorage.login !== "success") {
                $window.location.href = '#/login';
            }

            //file id getting
            var buf = $window.location.href;
            $scope.bufAry = buf.split("?");
            if ($scope.bufAry[1]) {
                $scope.bufAry1 = $scope.bufAry[1].split("=");
                if ($scope.bufAry1[0] === "id") {
                    $scope.file_id = $scope.bufAry1[1];
                    if ($scope.file_id) {
                        console.log($scope.file_id);
                    }
                }
            }
            // file schedule data getting
            $scope.schedule_data = [];
            var data = {
                file_id: $scope.file_id
            };
            var request = $http({
                method: "post",
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                url: HOST_DIRECTORY + "get_schedule",
                data: $.param(data)
            });
            request.success(
                    function (html) {
                        if (html.result === "YES") {
                            $scope.schedule_data = html.data;
                            console.log($scope.schedule_data);
                            // Configuration Form
                            if($scope.schedule_data['title']){
                                $scope.file_title = $scope.schedule_data['title'];
                            }
                            else {
                                $scope.file_title = $scope.schedule_data['origin_name'];
                            }
                            $scope.dwell_time = Number($scope.schedule_data['stay_time']);
                            $scope.start_effect = $scope.schedule_data['start_effect'];
                            $scope.end_effect = $scope.schedule_data['end_effect'];
                            $scope.active_time = $scope.schedule_data['begin_date'].replace(/-/g,"/") + "-" + $scope.schedule_data['end_date'].replace(/-/g,"/");
                            console.log($scope.active_time);
                        }
                    }
            );
            // time picker control
            $('input[name="daterange"]').daterangepicker();
            // schedule upadte function    
            $scope.updateClk = function () {
                var param = {
                    'user_id': $scope.schedule_data['user_id'],
                    'file_id': $scope.schedule_data['id'],
                    'file_title': $scope.file_title,
                    'dwell_time': $scope.dwell_time,
                    'start_effect': $scope.start_effect,
                    'end_effect': $scope.end_effect,
                    'active_time': scheduleForm.elements["daterange"].value
                };
                console.log(param);
                var request = $http({
                    method: "post",
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    url: HOST_DIRECTORY + "schedule_update",
                    data: $.param(param)
                });
            }
            $scope.back = function(){
                $window.location.href = "#/";
            }

        });
