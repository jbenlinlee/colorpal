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
	
	$scope.toggleModeAndSave = function() {
		switch ($scope.editMode) {
			case "edit":
				// save and switch to browse mode
				$scope.cpColor.rgbcolor = $scope.editColor.toHexString();
				$scope.editMode = "browse";
				break;
			
			case "browse":
				// save data for restore on cancel
				$scope.savedTitle = $scope.cpColor.label;
				$scope.savedColor = $scope.cpColor.rgbcolor;
				
				$scope.editColor = tinycolor($scope.cpColor.rgbcolor);
				$scope.editColorString = $scope.editColor.toHexString();
				
				$scope.savedShare = $scope.cpColor.share;
				$scope.changed = false;
				$scope.editMode = "edit";
				break;
		}
	}
	
	$scope.cancelEditMode = function() {
		$scope.cpColor.label = $scope.savedTitle;
		$scope.cpColor.rgbcolor = $scope.savedColor;
		$scope.cpColor.share = $scope.savedShare;
		$scope.editMode = "browse";
	}
	
	$scope.removeColor = function(idx) {
		$scope.$emit('removeColor', idx);
	}
	
	$scope.copyColor = function(idx) {
		$scope.$emit('copyColor', idx);
	}
		
	$scope.$watch('cpColor.label', function(newLabel, oldLabel) {
		if (oldLabel && newLabel !== oldLabel) {
			$scope.$emit('colorChange', $scope.cpEntryIndex, $scope.cpColor.rgbcolor);
			$scope.changed = true;
		}
	});
	
	$scope.$watch('cpColor.share', function(newShare, oldShare) {			
		if (oldShare && newShare !== oldShare) {
			if ($scope.cpColor.nextCheck) {
				$scope.$emit('colorShareChange', $scope.cpEntryIndex, parseFloat(oldShare), parseFloat(newShare));
				$scope.changed = true;
			}
		
			$scope.cpColor.nextCheck = true;
		}
	});
	
	$scope.$watch('cpColor.rgbcolor', function(newColor, oldColor) {
		$scope.changed = true;
	});
	
	function updateEditColor(red, green, blue) {
		$scope.editColor = tinycolor({r:red, g:green, b:blue});
		$scope.editColorString = $scope.editColor.toHexString();
		$scope.changed = true;
	}
	
	$scope.$watch('red', function(newVal, oldVal) {
		updateEditColor($scope.red, $scope.green, $scope.blue);
	});
	
	$scope.$watch('green', function(newVal, oldVal) {
		updateEditColor($scope.red, $scope.green, $scope.blue);
	});

	$scope.$watch('blue', function(newVal, oldVal) {
		updateEditColor($scope.red, $scope.green, $scope.blue);
	});
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