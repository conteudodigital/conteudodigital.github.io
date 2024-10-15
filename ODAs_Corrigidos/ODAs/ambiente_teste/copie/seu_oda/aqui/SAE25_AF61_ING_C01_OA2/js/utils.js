/**
 * Função de indentificação de navegador portável
 * 
 * @returns boolean
 */
function isMobile(){
	var mobileType = 'Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|TB07';
	var reg = new RegExp(mobileType);
	return (reg.test(navigator.userAgent))?true:false;
}

/**
 * Função de indentificação de navegador chrome
 * 
 * @returns boolean
 */
function isChrome(){ 
	return navigator.userAgent.toLowerCase().indexOf('chrome') > -1;        
}

/**
 * Função para shuffle no array
 * 
 */
function shuffle(o){
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};



/**
 * Verifica se tenho um elemento no array
 * 
 * @param needle
 * @param haystack
 * @returns {Boolean}
 */
function inArray(needle, haystack){
	var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}


/**
 * Função de repetição de uma string
 * 
 * @param int num
 * @returns string
 */
String.prototype.repeat = function( num ){
    return new Array( num + 1 ).join( this );
};

/**
 * Loading file css
 * 
 * @param filename
 */
function loadCssFile(filename){
	var fileref=document.createElement("link");
	fileref.setAttribute("rel", "stylesheet");
	fileref.setAttribute("type", "text/css");
	fileref.setAttribute("href", filename);
	document.getElementsByTagName("head")[0].appendChild(fileref);
}

/**
 * Limpa cache fake
 *
 */
function hidden(){
    $('#blink').hide(0, function(){$(this).show()});
}

$.fn.doesExist = function(){
	return jQuery(this).length > 0;
}

function versionCompare(v1, v2) {
	array1 = v1.split(".");
	array2 = v2.split(".");
	var bigArray, smallArray;
	if (array1.length > array2.length) {
		bigArray = array1;
		smallArray = array2;
	}
	else {
		bigArray = array2;
		smallArray = array1;
	}
	for(i = 0; i < bigArray.length; i++) {
		if (smallArray[i] == undefined) {
			smallArray[i] = 0;
		}
		cmp = parseInt(array1[i], 10) - parseInt(array2[i], 10);
		if (cmp !== 0) {
			return cmp;
		}
	}
	return 0;
}