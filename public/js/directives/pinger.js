define(['directives/directives'], function(directives){

    directives.directive('pinger', ['$http', function ($http) {

        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                
                element.bind('click', function (e) {

                    $http.get('/ping?authenticate=false');
                    
                });
            }
        };
    }]);
});