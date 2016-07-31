(function(){
  angular.module('starter')
  .controller('HomeController', ['$scope', '$ionicPopover', '$http' ,'$state', '$ionicModal', 'AuthService' ,HomeController]);
  
  function HomeController($scope, $ionicPopover, $http ,$state, $ionicModal, AuthService){
 
         function showSuccessToast(message){
             window.plugins.toast.showWithOptions({
                  message: message,
                  duration: "short", // 2000 ms
                  position: "bottom",
                  styling: {
                  opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
                  backgroundColor: '#00CD00', // make sure you use #RRGGBB. Default #333333
                  textColor: '#FFFFFF', // Ditto. Default #FFFFFF
                  textSize: 17, // Default is approx. 13.
                  cornerRadius: 16, // minimum is 0 (square). iOS default 20, Android default 100
                  horizontalPadding: 20, // iOS default 16, Android default 50
                  verticalPadding: 16 // iOS default 12, Android default 30
                  }
              });
         }
 
         function showErrorToast(message){
             window.plugins.toast.showWithOptions({
                  message: message,
                  duration: "short", // 2000 ms
                  position: "bottom",
                  styling: {
                  opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
                  backgroundColor: '#FF3030', // make sure you use #RRGGBB. Default #333333
                  textColor: '#FFFFFF', // Ditto. Default #FFFFFF
                  textSize: 17, // Default is approx. 13.
                  cornerRadius: 16, // minimum is 0 (square). iOS default 20, Android default 100
                  horizontalPadding: 20, // iOS default 16, Android default 50
                  verticalPadding: 16 // iOS default 12, Android default 30
                  }
              });
         }

         $scope.tools = { strokeSize : '20' , strokeColor: '#000000'};
         $scope.activityName = 'Default';
 
         var strokeColor = "#000000";
         var strokeSize = 20;
 
 
         $scope.selectedColorButton = function(hex){
            //$scope.strokeColorFinal = hex;
            strokeColor = hex;
            //alert($scope.strokeColorFinal);
         };

         $scope.updateStrokeSize = function(){
            //$scope.strokeSizeFinal = $scope.tools.strokeSize;
            strokeSize = $scope.tools.strokeSize;
            //console.log("$scope.strokeSizeFinal is: "+$scope.strokeSizeFinal)
         };
 
         var paintCanvas = document.getElementById('canvas');
         paintCanvas.width = window.innerWidth;
         paintCanvas.height = window.innerHeight * (0.75);
         
         
         var useragent = navigator.userAgent.toLowerCase();
         var isAndroid = /android/i.test(useragent);
         var isiOS = (useragent.indexOf('iphone') != -1 || useragent.indexOf('ipad') != -1 || useragent.indexOf('ipod') != -1 );
         if (navigator.userAgent.match(/iPod/)) console.log(1);
         if (navigator.userAgent.match(/iPad/)) console.log(2);
         if (navigator.userAgent.match(/iPhone/)) console.log(1);
         
         var mousePosition;
         if (isiOS) {
         var computemouseposition = function(e) {
            mousePosition = {x: e.pageX-paintCanvas.offsetLeft, y: e.pageY-paintCanvas.offsetTop};
         
         }
         var computetouchposition = function(e) {
            // console.log("e.touches[0].pageX: "+e.touches[0].pageX+" paintCanvas.offsetLeft: "+paintCanvas.offsetLeft);
            mousePosition = {x: e.touches[0].pageX-paintCanvas.offsetLeft, y: e.touches[0].pageY-paintCanvas.offsetTop};
            // console.log(JSON.stringify(mousePosition));
         }

         var mouseisup = function(e) {
            handleMouseUp(e);
         }
         paintCanvas.onmousedown = computemouseposition;
         paintCanvas.onmousemove = computemouseposition;
         paintCanvas.ontouchstart = computetouchposition;
         
         
         paintCanvas.ontouchmove = function(e) {
            computetouchposition(e);
            handleMouseMove(e);
         }
         paintCanvas.ontouchend = mouseisup;
         document.onmouseup = mouseisup;
         document.ontouchcancel = mouseisup;
         }
         
         
         var stage = new createjs.Stage(paintCanvas);
         
         //check to see if we are running in a browser with touch support
         stage.autoClear = false;
         stage.enableDOMEvents(true);
         var touchEnabled = createjs.Touch.enable(stage);
 
 
         if (touchEnabled && !isiOS) {
             console.log("Touch enabled");
             stage.addEventListener("stagemousedown", handlePressDown);
             stage.addEventListener("stagemouseup", handlePressUp);
         } else {
             console.log("Touch not enabled");
             stage.addEventListener("stagemousedown", handleMouseDown);
             stage.addEventListener("stagemouseup", handleMouseUp);
         }
         createjs.Ticker.setFPS(24);
         
         // set up our defaults:
         
         
         var shape;
         
         // For touch interaction
         var pointers = [];
         
         // For mouse only interaction
         var oldPoint;
         var oldMidPoint;
         
         shape = new createjs.Shape();
         stage.addChild(shape);
         
         // add handler for stage mouse events:
         function handleMouseDown(event) {
             var stagemouseX = (isiOS ? mousePosition.x : stage.mouseX);
             
             var stagemouseY = (isiOS ? mousePosition.y : stage.mouseY);
             oldPoint = new createjs.Point(stagemouseX, stagemouseY);
             oldMidPoint = oldPoint.clone();
             stage.addEventListener(isiOS ? "touchmove" : "stagemousemove" , handleMouseMove);
         }
         
         function handleMouseUp(event) {
             stage.removeEventListener(isiOS ? "touchmove" : "stagemousemove" , handleMouseMove);
         }
         
         function handleMouseMove(event) {
             var stagemouseX = (isiOS ? mousePosition.x : stage.mouseX);
             var stagemouseY = (isiOS ? mousePosition.y : stage.mouseY);
             var midPoint = new createjs.Point(oldPoint.x + stagemouseX>>1,
                                               oldPoint.y + stagemouseY>>1);
             
             shape.graphics.clear().setStrokeStyle(strokeSize, 'round', 'round').
             beginStroke(strokeColor).moveTo(midPoint.x, midPoint.y).
             curveTo(oldPoint.x, oldPoint.y, oldMidPoint.x, oldMidPoint.y);
             
             oldPoint.x = stagemouseX;
             oldPoint.y = stagemouseY;
             
             oldMidPoint.x = midPoint.x;
             oldMidPoint.y = midPoint.y;
             
             stageUpdate();
         }
         
         function handlePressDown(event) {
             var pointerData = {};
             pointerData.oldPoint = new createjs.Point(event.stageX,
                                                       event.stageY);
             pointerData.oldMidPoint = pointerData.oldPoint.clone();
             pointers[event.pointerID] = pointerData;
             if (pointers.length == 1) {
             stage.addEventListener("stagemousemove" , handlePressMove);
             }
         }
         
         function handlePressUp(event) {
             pointers.splice(pointers[event.pointerID], 1);
             if (pointers.length === 0) {
             stage.removeEventListener("stagemousemove" , handlePressMove);
             }
         }
         
         function handlePressMove(event) {
         pointerData = pointers[event.pointerID];
         var midPoint = new createjs.Point(
                                           pointerData.oldPoint.x + event.stageX>>1,
                                           pointerData.oldPoint.y + event.stageY>>1);
         
         shape.graphics.clear().setStrokeStyle( strokeSize , 'round', 'round').
         beginStroke(strokeColor).moveTo(midPoint.x, midPoint.y).
         curveTo(pointerData.oldPoint.x, pointerData.oldPoint.y,
                 pointerData.oldMidPoint.x, pointerData.oldMidPoint.y);
         
         pointerData.oldPoint.x = event.stageX;
         pointerData.oldPoint.y = event.stageY;
         
         pointerData.oldMidPoint.x = midPoint.x;
         pointerData.oldMidPoint.y = midPoint.y;
         
         stageUpdate();
         }
         
         function stageUpdate() {
            stage.update();
            if (isAndroid && document.location.protocol.substr(0,4) != "http") {
                // HACK: Force redraw on Android
                paintCanvas.style.display='none';
                paintCanvas.offsetHeight;
                paintCanvas.style.display='block';
            }
         }
 
 
         /************************  Edit Activity Name  ************************/
         $scope.editName = function(){
 
             function onPrompt(results){
                 if(results.buttonIndex == 1) return;
                 $scope.activityName = results.input1;
                 $scope.$apply();
                 // navigator.notification.alert('Activity name updated!', null, 'Activity', 'Ok');
             }
 
             navigator.notification.prompt(
                               'Enter activity name',  // message
                               onPrompt,                  // callback to invoke
                               'Activity Name',            // title
                               ['Cancel', 'Ok'],             // buttonLabels
                               ''+$scope.activityName+''                 // defaultText
                               );
         };
 
 
         /************************  Choose Color Template  ************************/
 
         $scope.colors= [{name: 'Blue',hex: '#387ef5'},{name: 'Green' ,hex :'#66FF00'}, {name: 'Black' ,hex :'#000000'},  {name: 'Red' ,hex :'#FF0000'}, {name: 'Yellow' ,hex :'#ffc900'}, {name: 'Violet' ,hex :'#886aea'}, {name: 'Azure' ,hex :'#007FFF'}, {name: 'Beige', hex: '#F5F5DC'}, {name: 'Lime', hex: '#BFFF00'}, {name: 'Lavender', hex: '#BF94E4'}, {name: 'Crimson', hex: '#DC143C'} ];
 
 
         $scope.popover = $ionicPopover.fromTemplateUrl('templates/color-popover.html', {
            scope: $scope,
            }).then(function(popover) {
                $scope.popover = popover;
         });
 
         $scope.openColorPopver = function($event){
            $scope.popover.show($event);
         };
         
         $scope.closeColorPopver = function() {
            $scope.popover.hide();
         };
 
 
         /************************  Erase drawing on Canvas  ************************/
 
         $scope.eraseCanvas = function(){
            strokeColor = '#ffffff';
         };
 
 
 
        /************************  Clear Canvas  ************************/
 
         $scope.clearCanvas = function(){
             stage.clear();
             stage.removeChild(shape);
             shape = new createjs.Shape();
             stage.addChild(shape);
             stageUpdate();
         };

        /************************  Choose Stroke Template  ************************/
 
         $ionicPopover.fromTemplateUrl('templates/stroke-popover.html', {
                                          scope: $scope,
                                          }).then(function(popover) {
                                                  $scope.strokePopover = popover;
                                                  });
 
         $scope.openStrokePopver = function($event) {
            $scope.strokePopover.show($event);
        };
 
        /************************** Save Canvas **********************************/

 
        $scope.saveDrawing = function(){
            // if(!window.localStorage.getItem("uuid")){
            //      // alert("Please Log-in");
            //     //  $scope.openLoginModal();
            // }
            // else{
                // alert("Go ahead");
                if($scope.activityName == 'Default'){
                    window.localStorage.setItem('Untitled', $scope.serializeCanvas);
                    $scope.activityName = 'Untitled';
                }
                var canvasData = paintCanvas.toDataURL();
                // alert(canvasData);
                var data = {'canvasData': canvasData, 'modified': new Date(), 'created': new Date()};
                // alert(JSON.stringify(data));
                window.localStorage.setItem($scope.activityName, JSON.stringify(data));
                 
            //}
        };

        /************************  Choose Background Template  ************************/
        var width = window.innerWidth;
        var height = window.innerHeight * (0.75);

        $scope.img = { 'width': width, 'height': height };

        $scope.backgrounds = [{name: 'Sky', src: 'img/background/sky.png'},{name: 'Blue', src: 'img/background/orange.png'}];
 
        $ionicPopover.fromTemplateUrl('templates/background-popover.html', {
                                          scope: $scope,
                                          }).then(function(popover) {
                                                  $scope.backgroundPopover = popover;
                                                  });
 
        $scope.openBackgroundPopver = function($event) {
            $scope.backgroundPopover.show($event);
        };

        $scope.selectedBackgroundButton = function(src){

            context = paintCanvas.getContext("2d");
            var imageObj = new Image();
            imageObj.onload = function() {
                context.drawImage(imageObj, 0, 0);
            };
            imageObj.src = src;
        };
 
 
        /************************** Google oauth **********************************/
 
        $ionicModal.fromTemplateUrl('templates/login-modal.html', {
            scope: $scope,
            backdropClickToClose: false
         }).then(function(modal) {
             $scope.modalA = modal;
         });
 
 
         // Triggered in the login modal to close it
        $scope.closeLogin = function() {
            $scope.modalA.hide();
        };
         
         // Open the login modal
        $scope.openLoginModal = function() {
            $scope.modalA.show();
        };
 
 
        $scope.data = {};

        $scope.validateEmail = function(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        $scope.login = function() {
            // console.log("LOGIN user: " + $scope.data.email + " - PW: " + $scope.data.password);
            if(!$scope.validateEmail($scope.data.email)){
                return false;
            }
            $scope.data.email = $scope.data.email.toLowerCase();
    
            AuthService.doAuth($scope.data.email, $scope.data.password, 'login').then(function(response){
                // alert(JSON.stringify(response));
                var result = JSON.stringify(response);
                console.log(result);
                if(response.data.result == 'ok'){
                      showSuccessToast('Login successful!');
                      window.localStorage.setItem('uuid', $scope.data.email);
                      $scope.closeLogin();
                }
                else if(response.data.result == 'wrong'){
                      showErrorToast('Incorrect password or email address');
                }
                else{
                      showErrorToast('Login failed. Sign up');
                }
                                                                                      
          
            });
        };
 
         $scope.register = function() {
            // console.log("LOGIN user: " + $scope.data.email + " - PW: " + $scope.data.password);
            if(!$scope.validateEmail($scope.data.email)){
                return false;
            }
            AuthService.doAuth($scope.data.email, $scope.data.password, 'register').then(function(response){
                // alert(JSON.stringify(response));
                var result = JSON.stringify(response);
                console.log(result);

            });
        };


        
        
 

  }

})();