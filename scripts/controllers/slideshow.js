'use strict';
/**
 * @ngdoc function
 * @name realApp.controller:SlideshowCtrl
 * @description
 * # SlideshowCtrl
 * Controller of the realApp
 */
angular.module('realApp')
        .controller('SlideshowCtrl', function ($scope, $window, $http, $timeout, $document,$localStorage,$sessionStorage) {

            var buf = $window.location.href;
            // get user id
            $scope.bufAry = buf.split("?");
            if ($scope.bufAry[1]) {
                $scope.bufAry1 = $scope.bufAry[1].split("=");
                $scope.external_userId = $scope.bufAry1[1];
                if ($scope.external_userId) {
//                    alert($scope.external_userId);
                }
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
            var request = $http({
                method: "post",
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                url: HOST_DIRECTORY + "get_slides",
                data: $.param(data)
            });
            request.success(
                    function (html) {
                        if (html.result === "YES" && html.data.length !== 0) {
                            $scope.file_data = html.data;
                            console.log($scope.file_data);
                            var len = $scope.file_data.length;
                            console.log(len);
                            var slide = 0;
                            $scope.displaySlide = function () {
                                if ($scope.file_data[slide].file_type === "image") {

                                    $scope.view_control = false;
                                    $scope.image_url = $scope.file_data[slide].url;

                                    // effect setting
                                    switch ($scope.file_data[slide].start_effect) {
                                        case "fadein" :
                                            $scope.effect_style = "animate-fadein-enter";break;
                                        case "top":
                                            $scope.effect_style = "animate-top-enter";break;
                                        case "down":
                                            $scope.effect_style = "animate-down-enter";break;
                                        case "left":
                                            $scope.effect_style = "animate-left-enter";break;
                                        case "right":
                                            $scope.effect_style = "animate-right-enter";break;
                                        default:
                                            $scope.effect_style = "animate-fadein-enter";break;
                                    }
                                    // end effect setting
                                    switch ($scope.file_data[slide].end_effect) {
                                        case "fadeout" :
                                            $scope.effect_style = "animate-fadeout-leave";break;
                                        case "top":
                                            $scope.effect_style += " " + "animate-top-leave";break;
                                        case "down":
                                            $scope.effect_style += " " + "animate-down-leave";break;
                                        case "left":
                                            $scope.effect_style += " " + "animate-left-leave";break;
                                        case "right":
                                            $scope.effect_style += " " + "animate-right-leave";break;
                                        default:
                                            $scope.effect_style = "animate-fadeout-leave";break;
                                    }
                                    
                                      
                                }
                                else {

                                    $scope.view_control = true;
                                    $scope.video_url = $scope.file_data[slide].url;
                                }
                                $timeout($scope.displaySlide, $scope.file_data[slide].stay_time * 1000);

                                // slide transition
                                slide++;
                                if (slide > len - 1) {
                                    slide = 0;
                                }
                                console.log(slide);
                            };
                            $scope.displaySlide();


                        }
                        else { // No data
                            console.log('no data');
                            alert("No data");
                            $window.location.href = "#/main";
                        }
                    }
            );

        });
