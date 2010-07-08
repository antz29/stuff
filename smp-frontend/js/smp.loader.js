(function($) {
	
	smp.Loader = {
		modules : {},
		addModule : function(name,module) 
		{
			this.modules[name] = module;
		},
		getModule : function(name)
		{
			return this.modules[name];
		},
		load : function(module)
		{
			if (!smp.utils.isArray(module)) module = [module];
			
			$.each(module,function() {
				if (this.indexOf(' ')) {
					var modules = this.split(' ');
					
					var loadModules = function()
					{
						if (!modules.length) return false;
						var mod = modules.shift();
						mod = smp.Loader.getModule(mod);
						mod.load(loadModules);
					};
					
					loadModules();
				}
				else {
					smp.Loader.getModule(this).load();
				}
			});
		}
	};
		
	smp.Loader.Module = function(name,path) {
		
		var path = path;
		var loaded = false;
		var depends = [];
		
		smp.Loader.addModule(name,this);
		
		this.dependsOn = function(module)
		{
			if (smp.utils.isArray(module)) {
				$.each(module,function(){
					depends.push(this);
				});
			}
			else {
				depends.push(module);
			}
		};
		
		this.load = function(callback)
		{
			if (loaded) return true;
			
			var that = this;
			
			if (depends.length) {
				var module = depends.shift();
				module.load(function() {
					that.load(callback);
				});
			}
			else {
				$.ajax({
					url : path,
					dataType : 'text',
					success : function(data) {
						data = '/* ' + path + ' */\n' + data;
						eval(data);
						if (smp.utils.isFunction(callback)) callback();
					}
				});	
			}
		};
	};
	
})(jQuery);		