var myApp = angular.module('Spotify', []);

myApp.controller('Search', function($scope, $http) {
	$scope.searchinput = "";
	$scope.searchdata =[];
	$scope.$watch('searchinput', function() {
      fetch();
    });

	function fetch() {

    	if ($scope.searchinput) { $http({
    		method : "GET",
        	url : "https://api.spotify.com/v1/search",
        	params: {
        		q: $scope.searchinput,
        		type: "album,track,artist"
        	}}).then(function(response) {
        		
        		var items = new Array();
        		
	        		//if (response.data.albums)
	        			items.concat(response.data.albums.items);console.log(items);
	        		//if (response.data.artists)
	        			items.concat(response.data.artists.items);
	        		//if (response.data.tracks)
	        			items.concat(response.data.tracks.items);
        		
            	$scope.searchdata = response.data.albums.items;
            	console.log($scope.searchdata);

        	});
        }
    }
    
});

myApp.filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace !== -1) {
                  //Also remove . and , so its gives a cleaner result.
                  if (value.charAt(lastspace-1) === '.' || value.charAt(lastspace-1) === ',') {
                    lastspace = lastspace - 1;
                  }
                  value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });