(function(){
  angular.module('starter')
  .service('AuthService', ['$q', '$http', AuthService]);
  
  function AuthService($q, $http){

    var BASE_URL = 'http://aspiringapps.com:8888/api';
 
    var doAuth = function(email, password, action){
        var args = {
          user: email, password: password, action: action
        };
        return $http({ url:BASE_URL+'/auth',method:"POST",params:args });
    };

     return{
        doAuth: doAuth
     };
  }

})();