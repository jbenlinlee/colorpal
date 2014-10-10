var colorEntryModule = angular.module('colorEntry', []);

colorEntryModule.directive('cpEntry', [function() {
	function setEntryColor(entry, newColor) {
		entry.rgbcolor = newColor.toHexString();
	}
	
	function linkfn(scope, elem, attrs) {
		swatchElem = $(elem).find('div#swatch');
		swatchElem.spectrum({
			color: scope.cpColor.rgbcolor,
			change: function(newColor) { 
				scope.$apply(function() {
					setEntryColor(scope.cpColor, newColor);
					scope.$emit('colorChange', scope.cpEntryIndex, newColor.toHexString());
				});
			}
		});
		
		scope.addColor = function(idx) {
			scope.$emit('addColor', idx);
		}
		
		scope.removeColor = function(idx) {
			scope.$emit('removeColor', idx);
		}
		
		scope.copyColor = function(idx) {
			scope.$emit('copyColor', idx);
		}
		
		scope.$watch('cpColor.label', function(oldLabel, newLabel) {
			scope.$emit('colorChange', scope.cpEntryIndex, scope.cpColor.rgbcolor);
		});
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