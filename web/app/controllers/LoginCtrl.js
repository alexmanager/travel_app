'use strict';

angular
    .module('travelApp')
    .controller('LoginController', ['$scope', '$location', '$rootScope', 'AuthService',
        function ($scope, $location, $rootScope, AuthService) {

            $scope.error_message = null;

            $scope.goToForgotPwd = function(){
                $location.path('/password_recovery');
            };

            $scope.submit = function (credentials) {
                $scope.error_message = null;

                if($scope.form.$valid){
                    AuthService.login(credentials, function(data){
                            var is_admin = AuthService.isAdmin(data.user.roles);
                            if (is_admin){
                                $location.path('/admin');
                            }else{
                                $location.path('/');
                            }
                        },
                        function(data){
                            if (data.message){
                                $scope.error_message = data.message;
                            }else{
                                $scope.error_message = 'Server error.';
                            }

                        }
                    );
                }
            };
        }
    ]);