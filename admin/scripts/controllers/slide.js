'use strict';
/**
 * @ngdoc function
 * @name realApp.controller:SlideCtrl
 * @description
 * # SlideCtrl
 * Controller of the realApp
 */
angular.module('realApp')
        .controller('SlideCtrl', function ($scope, $window, $http, $timeout) {
            var buf = $window.location.href;
            // get user id
            $scope.bufAry = buf.split("?");
            if ($scope.bufAry[1]) {
                $scope.bufAry1 = $scope.bufAry[1].split("=");
                if ($scope.bufAry1[0] === "userid") {
                    $scope.external_userId = $scope.bufAry1[1];
                    if ($scope.external_userId) {
                        alert($scope.external_userId);
                    }
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
                        $scope.cfdump = html;
                        if (html.result === "YES") {
                            $scope.file_data = html.data;
                            console.log($scope.file_data);
                            var len = $scope.file_data.length;
                            console.log(len);
                            var slide = 0;
                            $scope.displaySlide = function () {
                                if ($scope.file_data[slide].file_type === "image") {
                                    
                                    $scope.view_control = false;
                                    $scope.image_url = $scope.file_data[slide].url;
                                }
                                else {
                                    
                                    $scope.view_control = true;
                                    $scope.video_url = $scope.file_data[slide].url;
                                }
                                $timeout($scope.displaySlide, $scope.file_data[slide].stay_time * 1000);
                                slide ++;
                                if(slide > len -1){
                                    slide = 0;
                                }
                                
                                //console.log($scope.slide);
                                //console.log($scope.file_data[slide].stay_time);
                                //console.log($scope.file_data[slide].file_type);
                                console.log($scope.file_data[slide]);
                            };
                            $scope.displaySlide();


                        }
                    }
            );
//            $scope.changeImage = function()
//            {
//                var img = document.getElementById("img_repo");
//                img.src = images[x];
//                x++;
//                if (x >= images.length) {
//                    x = 0;
//                }
//                
//                fadeImg(img, 100, false);
//            }
//            function fadeImg(el, val, fade) {
//                if (fade === true) {
//                    val--;
//                } else {
//                    val++;
//                }
//
//                if (val > 40 && val < 100) {
//                    el.style.opacity = val / 100;
//                    setTimeout(function () {
//                        fadeImg(el, val, fade);
//                    }, 30);
//                }
//            }

        });
