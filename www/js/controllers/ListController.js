(function(){
  angular.module('starter')
  .controller('ListController', ['$scope','LocalService', ListController]);
  
 function ListController($scope, LocalService){
 
         LocalService.all().then(function(images){
                 $scope.images = images;
         });
 
 }

})();