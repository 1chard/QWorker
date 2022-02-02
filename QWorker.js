/**
    * @callback mapCallback
    * @param {Element} elem
    * @param {Number} index
    * @returns {*}
*/

/**
    * @callback eachCallback
    * @param {Element} elem
    * @param {Number} index
    * @returns {boolean|undefined}
*/

/**
    * @callback voidCallback
    * @param {Element} elem
    * @param {Number} index
    * @returns {undefined}
*/

/**
    * @callback eventCallback
    * @param {Event} event
    * @param {*...} parameterToFunction
    * @returns {*}
*/

/** 
    * @param {String|Element[]|...Element} arg 
    * @returns {Q}
*/
var Q = function (arg) {
    if (typeof arg === 'string') {
        if(Q.validSelector(arg)){
            return Q.ofQuery(arg);
        } else {
            return Q.ofHTML(arg);
        }
    } else if(arg instanceof Array){
        return Q.ofArray(arg);
    } else {
        if( 'length' in arg ){
            return Q.ofArray(Array.from(arg));
        } else {
            return Q.ofArray(arguments);
        }
    }
}

/** 
* @param {String} s
* @returns {Q}
*/
Q.validSelector = function(s){
    try{
        document.createDocumentFragment().querySelector(s);
        return true;
    } catch {
        return false;
    }
}

/** 
* @param {String} q
* @returns {Q}
*/
Q.ofQuery = function(q){
    return Q.ofArray(document.querySelectorAll(q));
}

/** 
* @param {Element[]} es
* @returns {Q}
*/
Q.ofArray = function(es){
    const instance = Object.create(Q.prototype);

    instance.length = es.length;

    for (let i = 0; i < instance.length; ++i) {
        instance[i] = es[i];
    }

    return instance;
}

/** 
* @param {s} s
* @returns {Q}
*/
Q.ofHTML = function(s){
    return Q.ofArray([Q.newElement(s)]);
}

/** 
* @param {String} q
* @returns {Element}
*/
Q.newElement  = function(q){
    const e = document.createElement("template");
    e.innerHTML = q.trim();
    return e.content.firstChild;
}

/** 
 * @param {string} [n]
 * @returns {Q}
*/
Q.prototype.val = function (n) {
    if (n !== undefined) {
        this.do(e => e.innerT = n);
    } else {
        return this[0] && this[0].value;
    }
}

/**
 * @param {mapCallback} cb
 * @returns {*[]}
*/
Q.prototype.map = function (cb) {
    const array = [];

    for (let i = 0; i < this.length; ++i) {
        array.push(cb.call(this, this[i], i));
    }

    return array;
}

/**
 * @param {voidCallback} cb
 * @returns {Q}
*/
Q.prototype.do = function (cb) {
    for (let i = 0; i < this.length; ++i) {
        cb.call(this, this[i], i);
    }

    return this;
}

/**
 * @param {eachCallback} cb
 * @returns {Q}
*/
Q.prototype.each = function (cb) {
    for (let i = 0; i < this.length; ++i) {
        if(cb.call(this, this[i], i) === false){
            break;
        }
    }

    return this;
}

/**
 * @param {string} eventname 
 * @returns {Q}
 */
Q.prototype.trigger = function (eventname) {
    return this.do(e => e.dispatchEvent(new Event(eventname)));
}

/**
 * @param {Element} e 
 * @returns {boolean}
 */
Q.prototype.has = function (e) {
    for (let i = 0; i < this.length; ++i) {
        if(this[i] === e){
            return true;
        }
    }

    return false;
}

/**
 * @param {string} eventname 
 * @param {string=} filter 
 * @param {eventCallback} callback 
 */
Q.prototype.on = function(eventname, filter, callback){
    /*
    if(typeof filter === 'string'){
        
    } else if(filter instanceof Function) {
        
    } else {

    }
    */
}
