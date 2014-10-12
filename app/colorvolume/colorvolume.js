var colorVolumeModule = angular.module('colorVolume', []);

colorVolumeModule.directive('cpVolume', [function() {
	function linkfn(scope, elem, attrs) {
		function rgbToHsl(rgbHex) {
			var red = parseInt(rgbHex.substr(1,2), 16) / 255.0;
			var green = parseInt(rgbHex.substr(3,2), 16) / 255.0;
			var blue = parseInt(rgbHex.substr(5,2), 16) / 255.0;
			
			var sortedRGBVals = [red, green, blue].sort(function(a, b) {
				return a - b;
			});
			
			var minRGB = sortedRGBVals[0];
			var maxRGB = sortedRGBVals[1];
			
			var luminance = (minRGB + maxRGB) / 2.0;
			var saturation = 0.0;
			var hue = 0.0;
			
			if (minRGB != maxRGB) {
				saturation = (maxRGB - minRGB) / (luminance < 0.5 ? (maxRGB + minRGB) : (2.0 - maxRGB - minRGB));
				
				if (maxRGB = red) {
					hue = (green - blue) / (maxRGB - minRGB);
				} else if (maxRGB = green) {
					hue = 2.0 + (blue - red) / (maxRGB - minRGB);
				} else if (maxRGB = blue) {
					hue = 4.0 + (red - green) / (maxRGB - minRGB);
				}
				
				hue *= 60;
				hue += hue < 0 ? 360 : 0;
			}
			
			return [hue, saturation, luminance];
		}
		
		function updateBlock(newPalette) {
			var newVolumeData = {};
			newPalette.forEach(function(colorEntry, idx) {
				newVolumeData[colorEntry.rgbcolor] = newVolumeData[colorEntry.rgbcolor] ||
					{rgbcolor: colorEntry.rgbcolor, hslcolor: rgbToHsl(colorEntry.rgbcolor), share: 0};
				newVolumeData[colorEntry.rgbcolor].share += parseFloat(colorEntry.share);
			});
			
			var colorVolumeObjects = [];
			var roundedShareSum = 0.0;
			Object.keys(newVolumeData).forEach(function(colorKey) {
				colorVolumeObjects.push(newVolumeData[colorKey]);				
				roundedShareSum += newVolumeData[colorKey].share;
			});
			
			// sort by share
			colorVolumeObjects.sort(function(a, b) {
				return b.share - a.share;
			});
			
			// normalize
			colorVolumeObjects.forEach(function(colorEntry) {
				colorEntry.share = Math.round(colorEntry.share / roundedShareSum * 100.0);
			});
			
			var keyColor = colorVolumeObjects.shift();
			var sortedColorVolumes = [keyColor];

			function dist(key, color) {
				return (0.75 * (color[0] - key[0])) + (0.15 * (color[1] - key[1])) + (0.05 * (color[2] - key[2]));
			}
			
			while (colorVolumeObjects.length > 0) {					
				colorVolumeObjects.sort(function(a, b) {
					return dist(keyColor, a) - dist(keyColor, b);
				});
				
				keyColor = colorVolumeObjects.shift();
				sortedColorVolumes.push(keyColor);
			}
						
			var i = 0;
			var parentElement = document.getElementById("volumeBlock")
			var blockElements = parentElement.getElementsByClassName("color-volume-block");

			sortedColorVolumes.forEach(function(colorVolume) {
				for (var j = 0; j < colorVolume.share && i < blockElements.length; ++j, ++i) {
					blockElements.item(i).style.setProperty('background-color', colorVolume.rgbcolor);
				}
			});
			
			for (; i < blockElements.length; ++i) {
				blockElements.item(i).style.setProperty('background-color', 'transparent');
			}			
		}
		
		scope.$on('paletteChange', function(event, palette) {
			updateBlock(palette);
		});
	}
	
	return {
		templateUrl: 'app/colorvolume/colorvolume.html',
		link: linkfn,
		restrict: "E",
		scope: {
			cpPalette: "=cpPalette",
		}
	}
}]);