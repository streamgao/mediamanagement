// add event handler
var addEvent = (function () {
  if (document.addEventListener) {
    return function (el, type, fn) {
      if (el && el.nodeName || el === window) {
        el.addEventListener(type, fn, false);
      } else if (el && el.length) {
        for (var i = 0; i < el.length; i++) {
          addEvent(el[i], type, fn);
        }
      }
    };
  } else {
    return function (el, type, fn) {
      if (el && el.nodeName || el === window) {
        el.attachEvent('on' + type, function () { return fn.call(el, window.event); });
      } else if (el && el.length) {
        for (var i = 0; i < el.length; i++) {
          addEvent(el[i], type, fn);
        }
      }
    };
  }
})();

// inner variables
var dragItems;
var dropAreas = document.querySelectorAll('[droppable=true]');
updateDataTransfer();

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



$(document).ready( function(){
    dropAreas = document.querySelectorAll('[droppable=true]');
    addEvent();
    updateDataTransfer();

    addEvent(dropAreas, 'dragover', function (event) { event.preventDefault();
        this.style.borderColor = "#000";
        return false;
    });

    addEvent(dropAreas, 'dragleave', function (event) { event.preventDefault();
        this.style.borderColor = "#ccc";
        return false;
    });

    addEvent(dropAreas, 'dragenter', function (event) {event.preventDefault();});

    addEvent(dropAreas, 'drop', function (event) { event.preventDefault();
        var iObj = event.dataTransfer.getData('obj_id');
        var oldObj = document.getElementById(iObj);
        //var oldSrc = oldObj.childNodes[0].src;
        var oldSrc = event.dataTransfer.getData('obj_src');
        oldObj.className += 'hidden';
        var oldThis = this;

        setTimeout(function() {
            oldObj.parentNode.removeChild(oldObj); // remove object from DOM
            // add similar object in another place
            oldThis.innerHTML += '<a id="'+iObj+'" draggable="true"><img src="'+oldSrc+'" /></a>';
            // and update event handlers
            updateDataTransfer();
            oldThis.style.borderColor = "#ccc";
        }, 100);
        return false;
    });
});
