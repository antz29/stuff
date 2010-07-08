(function($) {
	smp.Service = function(url) {		
		
		var url = url;
				
		function request(url,method,data,success,error,async) {
			var async = async ? true : false;
			
			var req = {
					url : url,
					cache : false,
					type : method,
					data : data,
					dataType: 'json',
					async: async,
					complete : function(xh) {
						var data  = $.parseJSON(xh.responseText);
						if (data && data.status != 'ok') {
							if($.isFunction(error)) error(data);
						}
						else {
							if($.isFunction(success)) success(data);
						}
					}
				};
			
			$.ajax(req);
		}
		
		function createUrl(base,params,opt) {
			
			var curl = base;
			var query = false;
			
			if (base.indexOf('?') != -1) {
				curl = base.split('?').shift();
				query = base.split('?').pop();
			}	
				
			if (opt.columns) {
				var cols = [];
				$.each(opt.columns,function(k,column) {
					if (!smp.utils.isScalar(column)) {
						$.each (column,function(key,value) {
							switch (key) {
								case 'rel':
								case 'dyn':
								case 'col':
									cols.push(key + ':' + value);
									break;
								default:
									if (smp.utils.isArray(value)) {
										value = value.join('|') + '|';
									}
									cols.push(key + ':' + value);
									break;
							}
						});
					}
					else {
						cols.push(this);
					}
				});
				curl = curl + '/_columns/' + cols.join(',');
			}
			if (params) {
				if (smp.utils.isScalar(params)) {
					curl = curl + '/' + params;
				}
				else {
					$.each(params,function(col,data) {
						
						curl = curl + '/' + col;
						
						if (data.op) {
							if (data.op == 'in') {
								if (smp.utils.isArray(data.val)) data.val = data.val.join('|');
								curl = curl + '/' + data.op + ':' + data.val + '|';
							}
							else {
								curl = curl + '/' + data.op + ':' + data.val;
							} 
						}
						else {
							curl = curl + '/' + data;
						}
					});
				}
			}

			if(opt.order) {
				if (!$.isArray(opt.order)) opt.order = [opt.order];
				
				$.each(opt.order,function(i,ord) {
					if (!ord.dir) {
						curl = curl + '/_order/' + ord;
					}
					else {
						curl = curl + '/_order/' + ord.col + ':' + ord.dir;
					}
				});
			}
			
			if(opt.page) curl = curl + '/_page/' + opt.page;				
			if(opt.display) curl = curl + '/_display/' + opt.display;
			if(opt.unique) curl = curl + '/_unique/' + opt.unique;	
			if(opt.group) curl = curl + '/_group/' + opt.group;	
			if(opt.agg) curl = curl + '/_agg/' + opt.agg;
			if(opt.validate) curl = curl + '/+validate';	
			
			if (query) {
				curl = curl + '?' + query;
			}
			
			return curl;
		}
		
		this.schema = function(success,options) {
			if (!success) success = function() {};
			if (!options) options = {};
			options.columns = true;
			var options = $.extend({},smp.Service.defaults,options);
			var curl = createUrl(url,false,options);
			request(curl,'get',null,success,options.error,options.async);
			return true;
		};
		
		this.find = function(id,success,options) {
			var options = $.extend({},smp.Service.defaults,options);
			if (!success) success = function() {};
			if (!smp.utils.isScalar(id)) return false;
			var curl = createUrl(url,id,options);
			request(curl,'get',null,success,options.error,options.async);
			return true;
		};
		
		this.validate = function(data,id,success) {
			if (!success) success = function() {};
			var options = $.extend({},smp.Service.defaults);
			var curl = smp.utils.isUndefined(id) ? url + '/validate/_/' : url + '/validate/_/' + id;
			request(curl,'get',data,success,options.error,options.async);
			return true;
		};
		
		this.search = function(search,success,options) {
			var options = $.extend({},smp.Service.defaults,options);
			if (!success) success = function() {};
			var curl = createUrl(url,(search == 'all' ? null : search),options);
			request(curl,'get',null,success,options.error,options.async);
			return true;
		};
		
		this.add = function(data,success,options) {
			
			var options = $.extend({},smp.Service.defaults,options);
			if (!success) success = function() {};
			request(url,'post',data,success,options.error,options.async);
			return true;
		};
		
		this.update = function(id,data,success,options) {
			
			var options = $.extend({},smp.Service.defaults,options);
			if (!success) success = function() {};
			if (!smp.utils.isScalar(id)) return false;
			request(url + '/' + id,'put',data,success,options.error,options.async);
			return true;
		};
		
		this.remove = function(id,success,options) {
			
			var options = $.extend({},smp.Service.defaults,options);
			if (!success) success = function() {};
			if (!smp.utils.isScalar(id)) return false;
			request(url + '/' + id,'delete',null,success,options.error,options.async);
			return true;
		};
		
		this.setUrl = function(new_url) {
			url = new_url;
		};
	};
	
	smp.Service.defaults = {
		columns : null,
		order : null,
		page : null,
		display : null,
		success : function(data) { console.log(data); }, 
		error: function(data) {
			if ($('<div/>').dialog) {
				var popup = $('<div/>').attr('title','Simplicity Service Error').prependTo('body');
				
				$.each(data,function(k,v) {
					popup.append($('<p/>').html('<b>'+k+':</b>' + v));
				});
				
				popup.dialog({
					modal : true,
					buttons : {
						'Ok' : function () { 
							$(this).dialog("close"); 
							popup.remove();
						}
					}
				});
			}
			else {
				var error = "Simplicity Service Error\r\n\r\n";
				$.each(data,function(k,v) {
					error = error + k + ': ' + v + "\r\n";
				});
			}		
		}
	};
})(jQuery);		