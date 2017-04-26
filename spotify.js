var myApp = angular.module('Spotify', []);

myApp.controller('Search', function($scope, $http) {
    $scope.offset = 0;
	$scope.searchinput = "";
	$scope.searchdata =[];
	$scope.$watch('searchinput', function() {
      if ($scope.searchinput) {$scope.fetch(); $scope.searchdata =[];}
    });

    $scope.isOpenModal = false;
    $scope.selectedItem = null;

    $scope.openModal = function (item){
        $scope.isOpenModal = !$scope.isOpenModal;
        
        if ($scope.isOpenModal && item) $scope.selectedItem = item;
        console.log($scope.selectedItem);
    }

	$scope.fetch = function () {
        console.log($scope.offset);
    	$http({
    		method : "GET",
        	url : "https://api.spotify.com/v1/search",
        	params: {
        		q: $scope.searchinput,
        		type: "album,artist",
                offset: $scope.offset,
                limit: 20
        	}}).then(function(response) {
   
                dataParse(response);
                
        	});
        
    }

    function dataParse(response){
        console.log(response.data);
                if (response.data.artists && response.data.artists.items){
                    for (i = 0; i < response.data.artists.items.length; i++) { 
                        var artist = response.data.artists.items[i];
                        $scope.searchdata.push({
                            imageurl: (artist.images[0] && artist.images[0].url )?artist.images[0].url:"", 
                            desc: artist.name,
							type: artist.type
                        });
                    }
                }
                
                if (response.data.albums && response.data.albums.items){
                    for (i = 0; i < response.data.albums.items.length; i++) { 
                        var album = response.data.albums.items[i];
                        $scope.searchdata.push({
                            imageurl: (album.images[0] && album.images[0].url )?album.images[0].url:"", 
                            desc: album.name,
							type: album.type
                        });
                    }
                }

                /*if (response.data.tracks && response.data.tracks.items){
                    for (i = 0; i < response.data.tracks.items.length; i++) { 
                        var track = response.data.tracks.items[i];
                        $scope.searchdata.push({
                            imageurl: (track.album.images[0] && track.album.images[0].url )?track.album.images[0].url:"", 
                            desc: track.name,
                            type: track.type
                        });
                    }
                }*/

                $scope.searchdata.sort(function(a, b){a.desc.localeCompare(b.desc);});
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