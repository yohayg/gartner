(function () {
    'use strict';

    angular.module('application', [
            'ui.router',
            'ngAnimate',

            //foundation
            'foundation',
            'foundation.dynamicRouting',
            'foundation.dynamicRouting.animations'
        ])
        .controller('FilmsCtrl', ['$scope', '$state', 'SWAPIService', function ($scope, $state, SWAPIService) {
            $scope = genericController($scope, $state, 'films', 'film', SWAPIService);
        }])
        .controller('SpeciesCtrl', ['$scope', '$state', 'SWAPIService', function ($scope, $state, SWAPIService) {
            $scope = genericController($scope, $state, 'species', 'specie', SWAPIService);
        }])
        .controller('PlanetsCtrl', ['$scope', '$state', 'SWAPIService', function ($scope, $state, SWAPIService) {
            $scope = genericController($scope, $state, 'planets', 'planet', SWAPIService);
        }])
        .controller('PeopleCtrl', ['$scope', '$state', 'SWAPIService', function ($scope, $state, SWAPIService) {
            $scope = genericController($scope, $state, 'people', 'person', SWAPIService);
        }])
        .controller('StarshipsCtrl', ['$scope', '$state', 'SWAPIService', function ($scope, $state, SWAPIService) {
            $scope = genericController($scope, $state, 'starships', 'starship', SWAPIService);
        }])
        .controller('VehiclesCtrl', ['$scope', '$state', 'SWAPIService', function ($scope, $state, SWAPIService) {
            $scope = genericController($scope, $state, 'vehicles', 'vehicle', SWAPIService);
        }])
        .filter('capitalize', function () {
            return function (input) {
                return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1)
                }) : '';
            }
        })
        .filter('lastdir', function () {
            return function (input) {
                return (!!input) ? input.split('/').slice(-2, -1)[0] : '';
            }
        })
        .config(config)
        .run(run);

    config.$inject = ['$urlRouterProvider', '$locationProvider'];

    function config($urlProvider, $locationProvider) {
        $urlProvider.otherwise('/');

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: true
        });

        $locationProvider.hashPrefix('!');
    }

    function run() {
        FastClick.attach(document.body);
    }




    function genericController($scope, $state, multiple, single, SWAPIService) {

        // Grab URL parameters
        $scope.id = ($state.params.id || '');
        $scope.page = ($state.params.p || 1);
        $scope.single = single;

        console.log("$scope.id: "+$scope.id+" multiple:"+multiple+" single:"+single);

        //$scope.setFavorite = function (key){
        //    console.log("key: "+key+" value:"+$scope.id);
        //
        //
        //
        //    SWAPIService.setFav(key,$scope.id).success(function (data) {
        //
        //        console.log(data);
        //    });
        //    SWAPIService.getFav(key,$scope.id).success(function (data) {
        //        console.log(data);
        //    });
        //};

        $scope.like=false;
        $scope.likeText = "Like";
        $scope.isLiked = function(){
            console.log("$scope.id: "+$scope.id+" multiple:"+multiple+" $scope.single:"+$scope.single);
            SWAPIService.getFav($scope.single,$scope.id).success(function (data) {
                console.log(data);
                if(data.GET){
                    $scope.like=true;
                    $scope.likeText = "Dislike";
                }else{
                $scope.like=false;
                $scope.likeText = "Like";
                }
            }).error(function(err){
                console.error(err);
            });
        };


        $scope.setLike = function(){
            console.log("$scope.id: "+$scope.id+" multiple:"+multiple+" $scope.single:"+$scope.single);
            SWAPIService.setFav($scope.single,$scope.id).success(function (data) {
                console.log(data);
                if(data.SET[0]){
                    $scope.like=true;
                    $scope.likeText = "Dislike";
                }else{
                    $scope.like=false;
                    $scope.likeText = "Like";
                }
            }).error(function(err){
                console.error(err);
            });
        };


        $scope.setDislike = function(){
            console.log("$scope.id: "+$scope.id+" multiple:"+multiple+" $scope.single:"+$scope.single);
            SWAPIService.deleteFav($scope.single,$scope.id).success(function (data) {
                console.log(data);
                if(data.DEL == 1){
                    $scope.like=false;
                    $scope.likeText = "Like";

                }else{
                    $scope.like=true;
                    $scope.likeText = "Dislike";
                }
            }).error(function(err){
                console.error(err);
            });
        };

        if($scope.single){
            $scope.isLiked();

        }

        var urlApi = "http://swapi.co/api/" + multiple + "/" + $scope.id + "?page=" + $scope.page,
            queryParams = {
                cache: true
            };

        if ($scope.page == 1) {
            if ($scope.id != '') {
                // We've got a URL parameter, so let's get the single entity's data
                SWAPIService.query(urlApi, queryParams)
                    .success(function (data) {
                        // The HTTP GET only works if it's referencing an ng-repeat'ed array for some reason...
                        if (data.homeworld) data.homeworld = [data.homeworld];

                        $scope[single] = data;

                        var name = data.name;
                        if (single == 'film') name = data.title;
                        // Get an image from a Google Custom Search
                        var googleUrl = 'https://www.googleapis.com/customsearch/v1?cx=001000040755652345309%3Aosltt3fexvk&q=' + encodeURIComponent(name) + '&imgSize=large&num=1&fileType=jpg&key=AIzaSyB6mjdYxO6-KYkBC-TAKSXSfseBNW0FX1w',
                            googleParams = {cache: true};


                        SWAPIService.query(googleUrl, googleParams)
                            .then(function (result) {
                                $scope.imageUrl = result.data.items[0].pagemap.cse_image[0].src;
                            }, function (err) {
                                $scope.imageUrl = "Unknown";
                            });
                    })

            } else {
                // We're on page 1, so thet next page is 2.
                SWAPIService.query(urlApi, queryParams)
                    .success(function (data) {
                        $scope[multiple] = data;
                        if (data['next']) $scope.nextPage = 2;
                    });
            }
        } else {
            // If there's a next page, let's add it. Otherwise just add the previous page button.
            SWAPIService.query(urlApi, queryParams)
                .success(function (data) {
                    $scope[multiple] = data;
                    if (data['next']) $scope.nextPage = 1 * $scope.page + 1;
                });
            $scope.prevPage = 1 * $scope.page - 1;
        }
        return $scope;

    }

})();
