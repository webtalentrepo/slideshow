'use strict';
/**
 * @ngdoc function
 * @name realApp.controller:SlideCtrl
 * @description
 * # SlideCtrl
 * Controller of the realApp
 */
angular.module('realApp')
        .controller('SlideCtrl', function ($scope, $window, $http, $timeout, $document) {

            var NEW_REQUEST = false;
            // External Request Reading
            var buf = $window.location.href;
            $scope.bufAry = buf.split("?");
            if ($scope.bufAry[1]) {
                $scope.bufAry1 = $scope.bufAry[1].split("=");
                $scope.external_userId = $scope.bufAry1[1];
            }
//            var now = "04/09/2013 15:00:00";
//            var then = "02/09/2013 14:20:30";
//
//            var ms = moment(now, "DD/MM/YYYY HH:mm:ss").diff(moment(then, "DD/MM/YYYY HH:mm:ss"));
//            var d = moment.duration(ms);
//            var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");

            // LocalState Getting
            if ($window.localStorage.downtime) { // 
                var now = new Date();
                var then = $window.localStorage.downtime;
                // Difference getting
                var ms = moment(now, "DD/MM/YYYY HH:mm:ss").diff(moment(then, "DD/MM/YYYY HH:mm:ss"));
                var ms = moment.duration(ms);
                var diff_hour = ms.asHours();
                if (diff_hour > DOWNLOAD_LIMIT_TIME) {
                    NEW_REQUEST = true;
                }
                console.log(diff_hour);
            }
            else {//
                var now = new Date();
                $window.localStorage.downtime = now; // first viewing
                NEW_REQUEST = true;
            }

            // get all slides
            $scope.file_data = [];
            if ($scope.external_userId)
                $scope.reqest_data = $scope.external_userId;
            else
                $scope.reqest_data = $window.sessionStorage.user_id;
            var data = {
                user_id: $scope.reqest_data
            };
            var request = $http({// new file download begin
                method: "post",
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                url: HOST_DIRECTORY + "get_slides",
                data: $.param(data)
            });
            request.success(
                    function (html) {
                        if (html.result === "YES" && html.data.length !== 0) {
                            var now = new Date();
                            if (NEW_REQUEST) {// when new request
                                $scope.file_data = html.data;
                                $window.localStorage.local_data = JSON.stringify(html.data);
                                $window.localStorage.downtime = now; // now time update
                                console.log("SERVER DATA :" + $window.localStorage.local_data + "/" + now);
                            }
                            else {
                                if ($window.localStorage.local_data) { // if data
                                    $scope.file_data = JSON.parse($window.localStorage.local_data); // origin data
                                    console.log("LOCAL Data:" + $scope.file_data + "/" + now);
                                }
                                else { // if no data
                                    $scope.file_data = html.data; // server data
                                    $window.localStorage.local_data = JSON.stringify(html.data);
                                    $window.localStorage.downtime = now; // now time update
                                    console.log("SERVER DATA :" + $window.localStorage.local_data + "/" + now);
                                }
                            }


                            // slide show begin
                            var len = $scope.file_data.length;
                            var slide = 0;
                            $scope.displaySlide = function () {
                                if ($scope.file_data[slide].file_type === "image") {

                                    $scope.view_control = false;
                                    $scope.image_url = $scope.file_data[slide].url;

                                    // effect setting
                                    switch ($scope.file_data[slide].start_effect) {
                                        case "fadein" :
                                            $scope.effect_style = "animate-fadein-enter";
                                            break;
                                        case "top":
                                            $scope.effect_style = "animate-top-enter";
                                            break;
                                        case "down":
                                            $scope.effect_style = "animate-down-enter";
                                            break;
                                        case "left":
                                            $scope.effect_style = "animate-left-enter";
                                            break;
                                        case "right":
                                            $scope.effect_style = "animate-right-enter";
                                            break;
                                        default:
                                            $scope.effect_style = "animate-fadein-enter";
                                            break;
                                    }
                                    // end effect setting
                                    switch ($scope.file_data[slide].end_effect) {
                                        case "fadeout" :
                                            $scope.effect_style += " " + "animate-fadeout-leave";
                                            break;
                                        case "top":
                                            $scope.effect_style += " " + "animate-top-leave";
                                            break;
                                        case "down":
                                            $scope.effect_style += " " + "animate-down-leave";
                                            break;
                                        case "left":
                                            $scope.effect_style += " " + "animate-left-leave";
                                            break;
                                        case "right":
                                            $scope.effect_style += " " + "animate-right-leave";
                                            break;
                                        default:
                                            $scope.effect_style += " " + "animate-fadeout-leave";
                                            break;
                                    }


                                }
                                else {

                                    $scope.view_control = true;
                                    $scope.video_url = $scope.file_data[slide].url;
                                }
                                $scope.timer = $timeout($scope.displaySlide, $scope.file_data[slide].stay_time * 1000);

                                // slide transition
                                slide++;
                                if (slide > len - 1) {
                                    slide = 0;
                                }
                            };
                            $scope.displaySlide();


                        }
                        else { // No data
                            document.getElementById("file_repo").innerHTML = "<div style='padding-top:100px;' class='text-center'><h2>No slides active for today</h2></div>";
                        }
                    }
            );
            // When the DOM element is removed from the page,
            $scope.$on(
                    "$destroy",
                    function (event) {
                        $timeout.cancel($scope.timer);
                    }
            );
        });
