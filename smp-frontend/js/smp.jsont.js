(function($) {
		
	smp.Jsont = function(template,formatters) {		
		
		var formatters = formatters ? formatters : {};
		
		var error_template = "{.section error}<p><strong>{name}: </strong> {message}</p>{.end}";
		
		var getTemplate = function(url,callback) {
			var t = "";
			$.ajax({
				url : url,
				async : false,
				success : function(data) {
					t = data;
				}
			});
			return t;
		};
				
		var renderTemplate = function(data)
		{	
			var out = "";
			try {
				out = jsont.expand(data);
			}
			catch (e) {
				var errort = new jsontemplate.Template(error_template);
				out = errort.expand({error : e});
			}
			
			return out;
		};
		
		var moreFormatters = function(name) {
			return eval('formatters.' + name);
		};
		
		var template = getTemplate(template);
		var jsont = false;
		
		this.getTemplate = function()
		{
			return template;
		};
		
		this.setTemplate = function(tmp)
		{
			template = tmp;
			jsont =  new jsontemplate.Template(template,{more_formatters : moreFormatters});
		};
		
		this.render = function(data,callback) {
			var out = renderTemplate(data);		
			callback($(out),data);
		};
		
		this.setTemplate(template);
	};
	
})(jQuery);