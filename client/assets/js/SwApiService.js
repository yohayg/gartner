(function () {
    'use strict';

    angular.module('application')
        .service('SWAPIService', ['$http', function ($http) {

            return {
                query: function (urlApi, queryParams) {
                    return $http({
                        method: 'GET',
                        url: urlApi,
                        params: queryParams
                    });

                },
                test: function(){
                    return $http({
                        method: 'GET',
                        url: 'http://ec2-54-93-90-68.eu-central-1.compute.amazonaws.com:7379/GET/hello'
                    })
                },
                setFav: function (key,value) {
                    return $http({
                        method: 'SET',
                        url: 'http://ec2-54-93-90-68.eu-central-1.compute.amazonaws.com:7379/SET/'+key+"-"+value+"/true"
                    });
                },
                deleteFav: function (key,value) {
                    return $http({
                        method: 'SET',
                        url: 'http://ec2-54-93-90-68.eu-central-1.compute.amazonaws.com:7379/DELETE/'+key+"-"+value
                    });
                },
                getFav: function (key,value) {
                    return $http({
                        method: 'GET',
                        url: 'http://ec2-54-93-90-68.eu-central-1.compute.amazonaws.com:7379/GET/'+key+"-"+value
                    });
                }
            };

        }])
})();
