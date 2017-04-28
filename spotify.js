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
        
        if (item){
            $http({
                method : "GET",
                url : "https://api.spotify.com/v1/"+((item.type=='artist')?"artists/"+item.id+"/albums":
                    "albums/"+item.id+"/tracks")
                }).then(function(response) {

                    $scope.isOpenModal = !$scope.isOpenModal;

                    if ($scope.isOpenModal && item) $scope.selectedItem = item;

                    tracksList = response.data.items;

                    if (item.type=="artist" && response.data.items){
                        albumList = response.data.items;
                        for ( i = albumList.length - 1; i >= 0; i--) {
                            
                            (function(i){
                                $http({
                                    method : "GET", 
                                    url : "https://api.spotify.com/v1/albums/"+albumList[i].id
                                }).then(function(responseAlbum) {
                                    
                                    if (responseAlbum && responseAlbum.data){
                                        if (responseAlbum.data.release_date){
                                           albumList[i].release_date = responseAlbum.data.release_date; 
                                        }
                                    }
                                });
                            })(i);

                        };
                    }

                    $scope.selectedItem.list = (item.type=="artist")?albumList:tracksList;

                });
        } else {$scope.isOpenModal = !$scope.isOpenModal;}
        
    }

	$scope.fetch = function () {
        
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
        
                if (response.data.artists && response.data.artists.items){
                    for (i = 0; i < response.data.artists.items.length; i++) { 
                        var artist = response.data.artists.items[i];
                        $scope.searchdata.push({
                            imageurl: (artist.images[0] && artist.images[0].url )?artist.images[0].url:"", 
                            desc: artist.name,
							type: artist.type,
                            id: artist.id
                        });
                    }
                }
                
                if (response.data.albums && response.data.albums.items){
                    for (i = 0; i < response.data.albums.items.length; i++) { 
                        var album = response.data.albums.items[i];
                        $scope.searchdata.push({
                            imageurl: (album.images[0] && album.images[0].url )?album.images[0].url:"", 
                            desc: album.name,
							type: album.type,
                            id: album.id
                        });
                    }
                }

                $scope.searchdata.sort(function(a, b){a.desc.localeCompare(b.desc);});
    }
    
});

/* My custom filters */

myApp.filter('FromMstoMinSec', function(){
  return function(input){
    input = input/1000;
    var minutes = parseInt(input/60, 10);
    var seconds = parseInt(input%60);

    if (minutes.toString().length == 1) {
            minutes = "0" + minutes;
    }

    if (seconds.toString().length == 1) {
            seconds = "0" + seconds;
    }

    return minutes+':'+seconds;
  }
})

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