// add event handler
// var addEvent = (function () {
//   if (document.addEventListener) {
//     return function (el, type, fn) {
//       if (el && el.nodeName || el === window) {
//         el.addEventListener(type, fn, false);
//       } else if (el && el.length) {
//         for (var i = 0; i < el.length; i++) {
//           addEvent(el[i], type, fn);
//         }
//       }
//     };
//   } else {
//     return function (el, type, fn) {
//       if (el && el.nodeName || el === window) {
//         el.attachEvent('on' + type, function () { return fn.call(el, window.event); });
//       } else if (el && el.length) {
//         for (var i = 0; i < el.length; i++) {
//           addEvent(el[i], type, fn);
//         }
//       }
//     };
//   }
// })();
// var removeEvent = (function () {
//   if (document.addEventListener) {
//     return function (el, type, fn) {
//       if (el && el.nodeName || el === window) {
//         el.removeEventListener(type, fn, false);
//       } else if (el && el.length) {
//         for (var i = 0; i < el.length; i++) {
//           removeEvent(el[i], type, fn);
//         }
//       }
//     };
//   } else {
//     return function (el, type, fn) {
//       if (el && el.nodeName || el === window) {
//         el.detachEvent('on' + type, function () { return fn.call(el, window.event); });
//       } else if (el && el.length) {
//         for (var i = 0; i < el.length; i++) {
//           removeEvent(el[i], type, fn);
//         }
//       }
//     };
//   }
// })();

function addEvent(el, type, fn) {
      if (el && el.nodeName || el === window) {
        el.addEventListener(type, fn, false);
      } else if (el && el.length) {
        for (var i = 0; i < el.length; i++) {
          addEvent(el[i], type, fn);
        }
      }
}

function removeEvent(el, type, fn) {
      if (el && el.nodeName || el === window) {
        el.removeEventListener(type, fn, false);
      } else if (el && el.length) {
        for (var i = 0; i < el.length; i++) {
          removeEvent(el[i], type, fn);
        }
      }
}


var dragItems;
var dropAreas;
// update event handlers
function updateDataTransfer() {
    dragItems = document.querySelectorAll('[draggable=true]');
    for (var i = 0; i < dragItems.length; i++) {
        addEvent(dragItems[i], 'dragstart', function (event) {
            //console.log(this);
            event.dataTransfer.setData('obj_id', this.id);
            event.dataTransfer.setData('obj_src', event.target.src);
            return false;
        });
    }
}

function addEvtlisteners(){
    updateDataTransfer();
    addEvent(dropAreas, 'dragover', function (e){ e.preventDefault();
        this.style.borderColor = "#000";
        return false;});
    addEvent(dropAreas, 'dragleave', function (e){ e.preventDefault();
        this.style.borderColor = "#ccc";
        return false;});
    addEvent(dropAreas, 'dragenter', function (e){e.preventDefault();return false;});

    addEvent(dropAreas, 'drop', function (e) { e.preventDefault();
        var iObj = e.dataTransfer.getData('obj_id');
        //var oldObj = document.getElementById(iObj);
        var oldObj = $('#'+iObj)[0];
        //console.log(oldObj);
        //var oldSrc = oldObj.childNodes[0].src;
        var oldSrc = e.dataTransfer.getData('obj_src');
        oldObj.className += 'hidden';
        var oldThis = this;

        setTimeout(function() {
            $('.gallery')[0].removeChild(oldObj); // remove object from DOM
            // add similar object in another place
            oldThis.innerHTML += '<a id="'+iObj+'" draggable="true"><img src="'+oldSrc+'" /></a>';
            
            updateDataTransfer(); // and update event handlers
            oldThis.style.borderColor = "#ccc";
        }, 100);
        return false; 
      });//drop
}


function removeEvtlisteners(){
    console.log('remove!!!');
    removeEvent(dropAreas, 'dragover', function (e){ e.preventDefault();});
    removeEvent(dropAreas, 'dragleave', function (e){ e.preventDefault();});
    removeEvent(dropAreas, 'dragenter', function (e){e.preventDefault();});
    removeEvent(dropAreas, 'drop',function (e){e.preventDefault();});
}


$(document).ready( function(){
    dropAreas = document.querySelectorAll('[droppable=true]');
    //updateDataTransfer();
    addEvtlisteners();
    //setupSocket();

    $('#arrange').click(function(){
        $('.hide').removeClass('hide');
        $('#done').removeClass('btn-success');
        addEvtlisteners();
    });
    $('#done').click(function(){
        $('#done').addClass('btn-success');
        $('#arrange').removeClass('btn-primary');
        removeEvtlisteners();
        var deleteimgs=[];

        for (var i = 0; i < $('#trash a').length; i++) {
            var srcs='';
            console.log($('#trash a')[i].childNodes[0].src);
            for (var j = 7; j < $('#trash a')[i].childNodes[0].src.split('/').length; j++) {
                srcs+=$('#trash a')[i].childNodes[0].src.split('/')[j]+'/';
            }
            deleteimgs.push(srcs);
        }
        console.log(deleteimgs);

        var delimg={deleteurls: deleteimgs};

        $.post("/tagdelete", delimg,
            function(data, status){
                console.log("Data: " + data + "\nStatus: " + status);
        });
    });
});









// function setupSocket() {
//     socket = io().connect('http://localhost:3000/');

//     socket.on('connect',function(){     
//         console.log('client connected');
//     });//on connect

//     socket.on('disconnect', function () {
//         console.log('client disconnected');
//     });
// }//setupSocket()
