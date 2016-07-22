(function(){
  angular.module('starter')
  .controller('ListController', ['$scope', ListController]);
  
 function ListController($scope){
 
        $scope.images = new Array();
 
        for (var i=0; i < window.localStorage.length; i++) {

            if(window.localStorage.key(i).length >=30) continue;
            var filename = window.localStorage.key(i);
            if(filename=="uuid") continue;
            //  alert(filename);
            var data = JSON.parse(window.localStorage.getItem(filename));
            //  alert(JSON.stringify(data));
            $scope.images.push({id: i, src: data.canvasData, name: filename });

        }
        // alert(JSON.stringify($scope.images));
 
 }

})();