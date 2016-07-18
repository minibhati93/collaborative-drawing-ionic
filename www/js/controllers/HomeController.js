(function(){
  angular.module('starter')
  .controller('HomeController', ['$scope', '$ionicPopover' ,'$state', HomeController]);
  
  function HomeController($scope, $ionicPopover ,$state){

         $scope.tools = { strokeSize : '20' , strokeColor: '#000000'};
 
         var strokeColor = "#000000";
         var strokeSize = 20;
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
 
         /************************  Choose Color Template  ************************/
         
         var template = '<ion-popover-view><ion-content><div class="list"><a class="item" ng-click="switchToTemplate(1)">Vehicle Maintenance</a><a class="item" ng-click="switchToTemplate(2)">Vehicle Bill of Sale</a></div></ion-content></ion-popover-view>';
         
         $scope.popover = $ionicPopover.fromTemplate(template, {
                                                     scope: $scope
                                                     });
         
         $scope.openColorPopver = function($event){
            $scope.popover.show($event);
         };
         
         $scope.closeColorPopver = function() {
            $scope.popover.hide();
         };
 
 
        /************************** Save Canvas **********************************/
 
        $scope.saveDrawing = function(){
            if(!window.localStorage.getItem("username")){
                 alert("Please Log-in");
                 $state.go('login');
            }
        };

 
 

  }

})();