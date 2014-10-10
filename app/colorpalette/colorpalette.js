var colorPaletteModule = angular.module('colorPalette', []);

colorPaletteModule.controller('colorPaletteController', ['$scope', function($scope) {
	$scope.colorPalette = [
		{rgbcolor: "#FF0000", label: "Red"},
		{rgbcolor: "#00FF00", label: "Green"},
		{rgbcolor: "#0000FF", label: "Blue"}
	];
	
	$scope.exportURL = "";
	
	function updateUrl() {
		// #c=FFFFFF;n=abcdefg,c=777777;n=test
		var urlString = $scope.colorPalette.map(function(color, idx) {
			return ['c=', color.rgbcolor, ';n=', encodeURIComponent(color.label)].join('');
		}).join(',');
		
		encodedHash = encodeURIComponent(urlString);
		
		$scope.exportURL = [window.location.protocol, '//', window.location.host, window.location.pathname, '#', encodedHash].join('');
	}
	
	function parseURL(loc) {
		var urlHash = decodeURIComponent(loc.hash.substr(1));
		var rawColorDataArray = urlHash.split(',');
		
		var newPalette = [];
		rawColorDataArray.forEach(function(colorString, idx) {
			var elements = colorString.split(';');
			var newColorEntry = {};
			elements.forEach(function(colorEntryComponent, idx) {
				var head = colorEntryComponent.substr(0,2);
				switch (head) {
				case 'c=':
					newColorEntry.rgbcolor = colorEntryComponent.substr(2);
					break;
				case 'n=':
					newColorEntry.label = decodeURIComponent(colorEntryComponent.substr(2));
					break;
				default:
					break;
				}
			});
			
			if (newColorEntry.rgbcolor && newColorEntry.label) {
				newPalette.push(newColorEntry);				
			}
		});
		
		if (newPalette.length == 0) {
			newPalette.push({rgbcolor: "#000000", label: "New Color"});
		}
		
		$scope.colorPalette = newPalette;
	}
	
	$scope.export = function() {
		var cleanColorPalette = [];
		$scope.colorPalette.forEach(function(entry, idx) {
			cleanColorPalette.push({rgbcolor: entry.rgbcolor, label: entry.label});
		});
		
		$scope.exportJSON = JSON.stringify(cleanColorPalette);
	}
	
	$scope.$on('addColor', function(event, insertionIdx) {
		var newPalette = [];
		$scope.colorPalette.forEach(function(entry, idx) {
			newPalette.push(entry);
			if (idx == insertionIdx) {
				newPalette.push({rgbcolor: "#000000", label: "New Color"});
			}
		});
		
		$scope.colorPalette = newPalette;
	});
	
	$scope.$on('removeColor', function(event, removalIdx) {
		var newPalette = [];
		$scope.colorPalette.forEach(function(entry, idx) {
			if (idx !== removalIdx) {
				newPalette.push(entry);
			}
		});
		
		if (newPalette.length == 0) {
			newPalette.push({rgbcolor: "#000000", label: "New Color"});
		}
		
		$scope.colorPalette = newPalette;
	});
	
	$scope.$on('copyColor', function(event, copyIdx) {
		var newPalette = [];
		$scope.colorPalette.forEach(function(entry, idx) {
			newPalette.push(entry);
		});

		var sourceColor = $scope.colorPalette[copyIdx];
		newPalette.push({rgbcolor: sourceColor.rgbcolor, label: sourceColor.label});
		
		$scope.colorPalette = newPalette;
	});
	
	$scope.$on('colorChange', function(event, colorIdx, newColor) {
		updateUrl();
	});
		
	$scope.$watch('colorPalette', function(newPalette, oldPalette) {
		updateUrl();
	});
	
	parseURL(window.location);
}]);