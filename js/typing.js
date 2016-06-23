(function (exports) {
    // 'use strict';

    var Typing = function (element, options) {
        // secure mode in case of forgetting to write 'new'
        var el;
        if (!(this instanceof Typing)) {
            return new Typing(element, options);
        } else {
            el = document.createElement('span');
            element.appendChild(el);
            createCursor(element);
            this.el = el;
            this.opts = options;
        }
    };
	
	//Create the icon of mouse
    function createCursor(element){
      var cursor = document.createElement('span');
      cursor.setAttribute("id","cursor");
      var head = document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.innerHTML = "#cursor{" +
                        "font-weight: lighter;" +
                        "opacity:1;" +
                        "-webkit-animation:a 1s infinite;" +
                        "animation:a 1s infinite;}" +
                        "@keyframes a{" +
                        "0%{opacity:1}" +
                        "50%{opacity:0}" +
                        "100%{opacity:1}}" +
                        "@-webkit-keyframes a{" +
                        "0%{opacity:1}" +
                        "50%{opacity:0}" +
                        "100%{opacity:1}" +
                        "}";
      head.appendChild(style);
      cursor.textContent = "|";
      element.appendChild(cursor);
    }
	// construct queue for functions, context and arguments
    var fnQueue = [],
        contextQueue = [],
        argsQueue = [],
        isRunning = false;
	
    function enQueue(fn, context, args) {
        fnQueue.push(fn);
        contextQueue.push(context);
        argsQueue.push(args);

        if (!isRunning) {
            isRunning = true;
            coreFunction();
        }
    }

    // excute functions
    function coreFunction() {
        if (fnQueue.length) {
            fnQueue.shift().apply(contextQueue.shift(), [].concat(argsQueue.shift()));
        }
    }

    // protected functions
    function getRandomSpeed(speed) {
        return Math.floor(Math.random() * speed);
    }

    function _add(toAddText) {
        var self = this,
            realSpeed = self.opts.speed || 100,
            toAddChar;

        (function addChar() {
            setTimeout(function () {
                var randomSpeed = getRandomSpeed(self.opts.speed);
                realSpeed = self.opts.isRandomSpeed ? randomSpeed : self.opts.speed;

                if (toAddText.length) {
                    toAddChar = toAddText.charAt(0);
                    self.el.textContent = self.el.textContent + toAddChar;
                    toAddText = toAddText.substring(1);
                    addChar();
                }else {
                    coreFunction();
                }
            }, realSpeed);
        })();
    }

    function _remove(deleteLength) {
        var self = this,
            realSpeed = self.opts.speed || 100;

        (function deleteChar() {
            setTimeout(function () {
                var randomSpeed = getRandomSpeed(self.opts.speed),
                    nowText = self.el.textContent;
                realSpeed = self.opts.isRandomSpeed ? randomSpeed : self.opts.speed;

                if (deleteLength) {

                    self.el.textContent = nowText.substring(0, nowText.length - 1);
                    deleteChar();
                    deleteLength = deleteLength - 1;
                } else {
                    coreFunction();
                }
            }, realSpeed);
        })();
    }

    function _pause(pauseTime) {
        setTimeout(coreFunction, pauseTime);
    }


    // exposed functions
    Typing.prototype = {
        add: function (toAddText) {
			enQueue(_add, this, toAddText);
            return this;
        },

        remove: function (deleteLength) {
			enQueue(_remove, this, deleteLength);
            return this;
        },

        pause: function (pauseTime) {
		    enQueue(_pause, this, pauseTime);
            return this;
        }

    };

    // mount Typing on global object
    exports.Typing = Typing;
})(window);
