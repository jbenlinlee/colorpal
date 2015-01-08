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
			return ['c=', color.rgbcolor, ';n=', encodeURIComponent(color.label), ';s=', color.share].join('');
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
				case 's=':
					newColorEntry.share = parseFloat(colorEntryComponent.substr(2));
				default:
					break;
				}
			});
			
			if (newColorEntry.rgbcolor && newColorEntry.label) {
				newPalette.push(newColorEntry);				
			}
		});
		
		if (newPalette.length == 0) {
			newPalette.push({rgbcolor: "#000000", label: "New Color", share: 100});
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
		$scope.appendColor(insertionIdx);
	});
	
	$scope.appendColor = function(insertionIdx) {
		var targetIdx = insertionIdx || $scope.colorPalette.length - 1;
		var newPalette = [];
		
		$scope.colorPalette.forEach(function(entry, idx) {
			newPalette.push(entry);
			if (idx == targetIdx) {
				var newColor = tinycolor({h: (Math.random() * 100), s: (Math.random() * 100), l: (Math.random() * 100)});	
				newPalette.push({rgbcolor: newColor.toHexString(), label: "New Color", share: 0});
			}
		});
		
		$scope.colorPalette = newPalette;		
	}
	
	$scope.$on('removeColor', function(event, removalIdx) {
		var newPalette = [];
		var shareToDistribute = parseFloat($scope.colorPalette[removalIdx].share);
		var adjustmentPerShare = shareToDistribute / ($scope.colorPalette.length - 1);
		
		$scope.colorPalette.forEach(function(entry, idx) {
			if (idx !== removalIdx) {
				entry.share = parseFloat(entry.share) + adjustmentPerShare;
				entry.nextCheck = false;
				newPalette.push(entry);
			}
		});
		
		if (newPalette.length == 0) {
			newPalette.push({rgbcolor: "#000000", label: "New Color", share: 100});
		}
		
		$scope.colorPalette = newPalette;
	});
	
	$scope.$on('copyColor', function(event, copyIdx) {
		var newPalette = [];
		$scope.colorPalette.forEach(function(entry, idx) {
			newPalette.push(entry);
		});

		var sourceColor = $scope.colorPalette[copyIdx];
		newPalette.push({rgbcolor: sourceColor.rgbcolor, label: sourceColor.label, share: 0});
		
		$scope.colorPalette = newPalette;
	});
	
	$scope.$on('colorChange', function(event, colorIdx, newColor) {
		updateUrl();
		$scope.$broadcast('paletteChange', $scope.colorPalette);
	});
	
	$scope.$on('colorShareChange', function(event, colorIdx, oldShare, newShare) {
		var changeToDistribute = -1.0 * (newShare - oldShare);
		
		var newPalette = [];

		var availableChange = $scope.colorPalette.reduce(function(prev, entry, idx) {
			return prev + (idx !== colorIdx ? parseFloat(entry.share) : 0.0);
		}, 0.0);
		
		var averageChange = changeToDistribute / ($scope.colorPalette.length - 1);
		
		$scope.colorPalette.forEach(function(entry, idx) {
			if (idx != colorIdx) {
				entry.share = parseFloat(entry.share);
				entry.share += availableChange > 0 ? entry.share / availableChange * changeToDistribute : averageChange;
				entry.share = Math.round(entry.share);
			}
			
			entry.nextCheck = false;
			newPalette.push(entry);
		});
		
		$scope.colorPalette = newPalette;
	});
	
	$scope.$on('showEditor', function(event, idx) {
		$scope.editColor = idx;
		$('div#color-editor').show();
	});
	
	$scope.closeEditor = function() {
		$('div#color-editor').hide();
	};
		
	$scope.$watch('colorPalette', function(newPalette, oldPalette) {
		updateUrl();
		$scope.$broadcast('paletteChange', newPalette);
	});
	
	parseURL(window.location);
}]);