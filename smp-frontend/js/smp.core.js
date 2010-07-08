(function($) {
	
	if ((typeof(smp) == 'undefined' || smp === null)) smp = {};
	
	smp.utils = {};
	
	smp.utils.isObject = function(mixed_var) {
		if (smp.utils.isArray(mixed_var) || smp.utils.isScalar(mixed_var)) {
			return false;
		} else {
			return (mixed_var !== null) && (typeof (mixed_var) == 'object');
		}
	};

	smp.utils.isNumeric = function(mixed_var) {
		return (typeof(mixed_var) === 'number' || typeof(mixed_var) === 'string') && mixed_var !== '' && !isNaN(mixed_var);
	};
	
	smp.utils.isInteger = function(mixed_var) {
	    if (typeof mixed_var !== 'number') {
	        return false;
	    }
	 
	    return !(mixed_var % 1);		
	};
	
	smp.utils.isScalar = function(mixed_var) {
		return (/boolean|number|string/).test(typeof mixed_var);
	};
	
	smp.utils.isUndefined = function(mixed_var) {
	    var a=arguments, l=a.length, i=0;
        if (l===0) {
        	throw new Error('Empty isUndefined'); 
        }
    
        while (i!==l) {
        	if (typeof(a[i])=='undefined' || a[i]===null) { 
        		return true; 
        	} 
        	else { 
        		i++; 
        	}
        }
        
        return false;
	};
	
	smp.utils.isArray = function(mixed_var) {
		return typeof(mixed_var) == 'object' && (mixed_var instanceof Array);
	};
})(jQuery);