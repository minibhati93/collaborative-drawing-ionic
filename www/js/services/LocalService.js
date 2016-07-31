(function(){
    angular.module('starter')
    .service('LocalService', ['$q', '$http', LocalService]);
    
    function LocalService($q, $http){
        
        var all = function(){
            var deferred = $q.defer();
            var images = new Array();
 
            for (i=0; i < window.localStorage.length; i++) {
                //alert(i);
                if(window.localStorage.key(i).length >=30) continue;
                var imageName = window.localStorage.key(i);
                if(imageName == 'uuid') continue;
                var data = JSON.parse(window.localStorage.getItem(imageName));
                images.push({'id': i, 'name': imageName, 'src': data.canvasData });
                
            }
            // alert(JSON.stringify(images));
       
            if(images){
                deferred.resolve(images);
            }
            else{
                deferred.reject('error');
            }
            return deferred.promise;
        };
        
        return{
            all: all
        };
    }
    
})();