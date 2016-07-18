(function(){
  angular.module('starter')
  .controller('LoginController', ['$scope', '$state','$http', LoginController]);
  
  function LoginController($scope , $state, $http){
 
         $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
         // var clientId = "129939593061-2jvlmucpf0pk2rng15n518v68med5vta.apps.googleusercontent.com";
         var requestToken = "";
         var accessToken = "";
         var clientId = "129939593061-2jvlmucpf0pk2rng15n518v68med5vta.apps.googleusercontent.com";
         var clientSecret = "QL50fc0sEZEnvJi7DH74urL2";
 
        $scope.googleOauth = function(){
            var ref = window.open('https://accounts.google.com/o/oauth2/auth?client_id=' + clientId + '&redirect_uri=http://localhost/callback&scope=https://www.googleapis.com/auth/userinfo.email&approval_prompt=force&response_type=code&access_type=offline', '_blank', 'location=no');
            ref.addEventListener('loadstart', function(event) {
                      if((event.url).startsWith("http://localhost/callback")) {
                      requestToken = (event.url).split("code=")[1];
                      $http({method: "post", url: "https://accounts.google.com/o/oauth2/token", data: "client_id=" + clientId + "&client_secret=" + clientSecret + "&redirect_uri=http://localhost/callback" + "&grant_type=authorization_code" + "&code=" + requestToken })
                      .success(function(data) {
                               accessToken = data.access_token;
                               console.log(accessToken);
                               })
                      .error(function(data, status) {
                             alert("ERROR: " + data);
                             });
                      ref.close();
                      }
                      });
        };
 
  }

})();