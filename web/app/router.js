angular
    .module('travelApp')
    .config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        var allowLoadAdmin = false;
        $urlRouterProvider.otherwise("/");
        $stateProvider
            .state('home', {
                url: "/",
                resolve: {
                    loadTravels:['TravelService', 'loadHomeCtrl', function(TravelService, loadHomeCtrl){
                        return TravelService.getTravels();
                    }],

                    loadHomeCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('controllers/HomeCtrl.js');
                    }]
                },
                templateUrl: "templates/home.html",
                controller: "HomeController"
            })
            .state('admin', {
                url: "/admin",
                resolve: {
                    checkForAdmin: ['UserService', '$state', 'AuthService', '$ocLazyLoad', function(UserService, $state, AuthService, $ocLazyLoad){
                        return UserService.getUserInfo().then(function successCallback(response) {
                            var is_admin = AuthService.isAdmin(response.data.roles);
                            if (is_admin){
                                allowLoadAdmin = true;
                            }else{
                                allowLoadAdmin = false;
                                $state.go("home");
                            }
                        }, function errorCallback(response) {
                            allowLoadAdmin = false;
                            $state.go("home");
                        });
                    }],

                    loadAdminCtrl: ['$ocLazyLoad', 'checkForAdmin', function($ocLazyLoad, checkForAdmin) {
                        if (allowLoadAdmin){
                            return $ocLazyLoad.load(['controllers/AdminCtrl.js']);
                        }
                    }],

                    loadUsers:['UserService', 'loadAdminCtrl', function(UserService, loadHomeCtrl){
                        return UserService.getUsers();
                    }]
                },
                templateUrl: function (){
                    if (allowLoadAdmin){
                        return 'templates/admin.html';
                    }else{
                        return '';
                    }
                },
                controllerProvider: ['$state', function ($state) {
                    if (allowLoadAdmin){
                        return 'AdminController';
                    }else{
                        return '';
                    }
                }]
            })
            .state('login', {
                url: "/login",
                resolve: {
                    loadLoginCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('controllers/LoginCtrl.js');
                    }]
                },
                templateUrl: "templates/login.html",
                controller: "LoginController"
            })
            .state('signup', {
                url: "/signup",
                resolve: {
                    loadsignupCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('controllers/SignupCtrl.js');
                    }]
                },
                templateUrl: "templates/signup.html",
                controller: "SignupController"
            })
            .state('password_recovery', {
                url: "/password_recovery",
                resolve: {
                    loadsignupCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('controllers/PasswordRecoveryCtrl.js');
                    }]
                },
                templateUrl: "templates/password_recovery.html",
                controller: "PasswordRecoveryController"
            })
    }
]);