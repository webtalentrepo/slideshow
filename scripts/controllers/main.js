'use strict';

/**
 * @ngdoc function
 * @name realApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the realApp
 */

angular.module('realApp')

        .controller('MainCtrl', function ($scope, $window, $http, $location) {

            $scope.drag_flag = 0;
            if ($window.sessionStorage.login !== "success") {
                $window.location.href = '#/login';
            }
            // file upload button define
            $scope.file_page = function () {

                $window.location.href = '#/fileupload';

            }
            // file Schedule function
            $scope.scheduleClk = function (id) {
                $window.location.href = '#/schedule?id=' + id;
            }
            // file delete function
            $scope.deleteClk = function (id, file_name) {
                console.log(id + file_name);
                if (confirm("Do you delete the file?")) {
                    var delete_data = {
                        id: id,
                        file_name: file_name
                    };
                    var request = $http({
                        method: "post",
                        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                        url: HOST_DIRECTORY + "delete_file",
                        data: $.param(delete_data)
                    });
                    request.success(
                            function (html) {
                                if (html.result === "YES") {
                                    var new_request = $http({
                                        method: "post",
                                        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                                        url: HOST_DIRECTORY + "get_files",
                                        data: $.param(data)
                                    });
                                    new_request.success(
                                            function (html) {
                                                if (html.result === "YES") {
                                                    $scope.myfiles = html.data;
                                                }
                                            }
                                    );
                                }
                            }
                    );
                }
            }
            // gallery file getting
            $scope.myfiles = [];
            $scope.file_data = [];
            var data = {
                user_id: $window.sessionStorage.user_id
            };
            var request = $http({
                method: "post",
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                url: HOST_DIRECTORY + "get_files",
                data: $.param(data)
            });
            request.success(
                    function (html) {
                        if (html.result === "YES") {
                            $scope.myfiles = html.data;
                            console.log($scope.myfiles);
                        }
                    }
            );
            // Reordering Function

            $(document).ready(function () {
                $("ul.reorder-photos-list").sortable({tolerance: 'pointer'});
            });
            $scope.file_move = function (file_id) {
                var h = [];
                $("ul.reorder-photos-list li").each(function () {
                    if ($(this).attr('id')) {
                        if (file_id != $(this).attr('id').substr(9)) {
                            h.push($(this).attr('id').substr(9));
                        }
                    }
                    else {
                        h.push(file_id);
                        $scope.drag_flag = 1;
                    }
                });
                if ($scope.drag_flag === 1) {
                    $scope.drag_flag = 0;
                    $scope.reorder_data = {
                        ids: h
                    }
                    console.log(h);
                    var request = $http({
                        method: "post",
                        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                        url: HOST_DIRECTORY + "reordering",
                        data: $.param($scope.reorder_data)
                    });
                    request.success(
                            function (html) {
                                $scope.cfdump = html;
                                if (html.result === "YES") {
                                    console.log(html);
                                }
                            }
                    );

                }
            }

        });
