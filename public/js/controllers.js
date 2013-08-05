function LoginCtrl($scope, Auth) {

	$scope.lrm = true;
	$scope.rrm = true;

	$scope.login = function(){
		Auth.login($scope.lu, $scope.lp);
		return false;
	};
	$scope.register = function(){
		Auth.register($scope.ru, $scope.rp);
	};
};

function HomeCtrl ($scope, $http, $location, Auth) {

	// $http.get('/me').success(function(data, status){
	// 	if (status == 404) return $location.path('/login');
	// 	$scope.username = data;
	// });

	$scope.username = Auth.username;

	$scope.logout = function(){
		$scope.username = null;
		Auth.logout();
	}

	$scope.me = function(){
			console.log(Auth.me);
	};
};

// HomeCtrl.$inject = ['$scope', '$http', '$location, Auth'];