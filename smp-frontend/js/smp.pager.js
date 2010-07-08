(function($) {

	smp.Pager = function(opt) {
		this.options = $.extend({}, smp.Pager.defaults, opt);

		this.page = 1;
		this.pages = false;
		this.pager = false;
		this.overlay = false;

		var $this = this;

		this.getOptions = function()
		{
			return options;
		};
		
		this.setOptions = function(new_opts)
		{
			this.options = $.extend({}, this.options, new_opts);
		};

		this.reload = function(callback)
		{
			$this.gotoPage(this.page,callback);
		};

		this.nextPage = function(callback)
		{
			$this.gotoPage((this.page + 1), callback);
		};

		this.prevPage = function(callback)
		{
			$this.gotoPage((this.page - 1), callback);
		};

		this.firstPage = function(callback)
		{
			$this.gotoPage(1, callback);
		};

		this.lastPage = function(callback)
		{
			if (!$this.pages) return false;
			$this.gotoPage((this.pages), callback);
		};

		this.gotoPage = function(page,callback)
		{
			renderPage(page,callback);
		};

		this.disablePager = function()
		{
			$this.options.pagerTarget.find('a').addClass('ui-state-disabled');
		};

		this.enablePager = function()
		{
			$this.options.pagerTarget.find('a').removeClass('ui-state-disabled');
		};

		this.showOverlay = function()
		{
			if (!$this.overlay) {
				$this.overlay = $('<div/>').addClass('ui-helper-zfix').css({background: 'url(/_static/img/loading.gif) no-repeat center center #fff',opacity : 0.5,position : 'absolute',display:'none',zIndex:100000});
				$('body').prepend($this.overlay);
			}

			$this.overlay.height($this.options.dataTarget.outerHeight());
			$this.overlay.width($this.options.dataTarget.outerWidth());
			$this.overlay.show().css('visibility','hidden');
			$this.overlay.position({my:'center',at:'center',of:$this.options.dataTarget});

			$this.overlay.css('visibility','visible');
		};

		this.hideOverlay = function()
		{
			$this.overlay.fadeOut('fast');
		};

		var renderPager = function(data,callback)
		{
			if (!$this.pager) {
				$this.options.pagerTarget.html('');

				var tmp = $this.options.pagingTemplate.getTemplate();
				tmp = tmp.replace('{text}',$this.options.pagerText);
				$this.options.pagingTemplate.setTemplate(tmp);

				var page = data.page ? data.page : 1;
				var pages = data.pages ? data.pages : 1;
				var display = data.display ? data.display : 0;
				
				$this.options.pagingTemplate.render({ pager : {
					page : '<span class="page">' + page + "</span>",
					pages :'<span class="pages">' +  pages + "</span>",
					display : '<span class="display">' +  display + "</span>"
				}},function(render) {
					$this.pager = render;
					$this.options.pagerTarget.append($this.pager);

					$this.pager.find('a.first').bind('click',function() {
						if ($(this).hasClass('ui-state-disabled')) return false;
						$this.firstPage();
						return false;
					});

					$this.pager.find('a.last').bind('click',function() {
						if ($(this).hasClass('ui-state-disabled')) return false;
						$this.lastPage();
						return false;
					});

					$this.pager.find('a.next').bind('click',function() {
						if ($(this).hasClass('ui-state-disabled')) return false;
						$this.nextPage();
						return false;
					});

					$this.pager.find('a.prev').bind('click',function() {
						if ($(this).hasClass('ui-state-disabled')) return false;
						$this.prevPage();
						return false;
					});

					$this.pager.find('a.reload').bind('click',function() {
						if ($(this).hasClass('ui-state-disabled')) return false;
						$this.reload();
						return false;
					});

					updatePager(data);
					callback();
				});
			}
			else {
				updatePager(data);
				callback();
			}
		};

		var updatePager = function(data)
		{
			if (!data || data.page == 1) {
				$this.pager.find('a.button.first').addClass('ui-state-disabled');
				$this.pager.find('a.button.prev').addClass('ui-state-disabled');
			}
			else {
				$this.pager.find('a.button.first').removeClass('ui-state-disabled');
				$this.pager.find('a.button.prev').removeClass('ui-state-disabled');
			}

			if (!data || data.page >= data.pages) {
				$this.pager.find('a.button.last').addClass('ui-state-disabled');
				$this.pager.find('a.button.next').addClass('ui-state-disabled');
			}
			else {
				$this.pager.find('a.button.last').removeClass('ui-state-disabled');
				$this.pager.find('a.button.next').removeClass('ui-state-disabled');
			}

			var page = data.page ? data.page : 1;
			var pages = data.pages ? data.pages : 1;
			var display = data.display ? data.display : 0;

			$this.pager.find('span.page').text(page);
			$this.pager.find('span.pages').text(pages);
			$this.pager.find('span.display').text(display);
		};

		var renderPage = function(page,callback)
		{
			$this.page = page;

			if (!($this.options.service instanceof smp.Service)) throw new Exception('Not provided a valid smp.Service instance.');

			$this.options.searchOptions.display = $this.options.display;
			$this.options.searchOptions.page = $this.page;

			$.proxy($this.options.startLoading,$this)();

			$this.disablePager();
			$this.showOverlay();

			$this.options.service.search($this.options.search,function(data) {
				$this.page = data ? data.page : 0;
				$this.pages = data ? data.pages : 0;

				$this.enablePager();

				renderPager(data,function() {
					$this.options.dataTarget.html('');
					if (!data) {
						$this.hideOverlay();
						return;
					}

					if ($this.options.dataColumn) {
						var mydata = data.data[$this.options.dataRow][$this.options.dataColumn];
					}
					else {
						var mydata = data.data;
					}
					$(mydata).each(function() {
						var data = this;

						var tdata = $.proxy($this.options.dataFilter,$this)(data);
						$this.options.itemTemplate.render(tdata,function(render) {
							render = $.proxy($this.options.renderFilter,$this)(render,data);
							$this.options.dataTarget.append(render);
						});
					});

					if ($.isFunction(callback)) $.proxy(callback,$this)();
					$.proxy($this.options.endLoading,$this)();
					$this.hideOverlay();
				});

			},$this.options.searchOptions);
		};
	};

	smp.Pager.defaults = {
		display : 10,
		itemTemplate : false,
		pagingTemplate : false,
		dataFilter : function(item) { return item; },
		renderFilter : function(render,data) { return render; },
		search : 'all',
		searchOptions : {},
		service : false,
		dataTarget : false,
		pagerTarget : false,
		startLoading : function() {},
		endLoading : function() {},
		pagerText : "Page {page} of {pages}",
		dataColumn: false,
		dataRow : 0
	};
})(jQuery);