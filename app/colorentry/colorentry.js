var colorEntryModule = angular.module('colorEntry', []);

colorEntryModule.controller('cpEntryController', ['$scope', function($scope) {
	$scope.editMode = "browse";
	$scope.changed = false;
	$scope.cpColor.nextCheck = true;
	
	$scope.savedTitle = "";
	$scope.savedColor = undefined;
	$scope.savedShare = 0.0;
	
	$scope.red = 0;
	$scope.green = 0;
	$scope.blue = 0;
	$scope.editColorString = "#000000";
	$scope.editColor = undefined;
	
	$scope.showEditor = function() {
		$scope.$emit('showEditor', $scope.cpEntryIndex);
	}
}]);

colorEntryModule.directive('cpEntry', [function() {
	function linkfn(scope, elem, attrs) {
	}
	
	return {
		templateUrl: 'app/colorentry/colorentry.html',
		link: linkfn,
		restrict: "E",
		scope: {
			cpColor: "=cpColor",
			cpEntryIndex: "=cpEntryIndex"
		}
	}
}])