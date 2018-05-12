var win_h = $(window).height();
var nt_form = $(".nt_form").height();
var nt_grid_h = win_h - nt_form - 168;


var this_grid = $("#jqGrid");
var count = 0;

gridInit = function() {
	this_grid.jqGrid({
		url: 'http://trirand.com/blog/phpjqgrid/examples/jsonp/getjsonp.php?callback=?&qwery=longorders',
		mtype: "GET",
		datatype: "jsonp",
		colModel: [
			{ label: 'OrderID', name: 'OrderID', key: true, width: 75 },
			{ label: 'Customer ID', name: 'CustomerID', width: 150 },
			{ label: 'Order Date', name: 'OrderDate', width: 150 },
			{ label: 'Freight', name: 'Freight', width: 150 },
			{ label:'Ship Name', name: 'ShipName', width: 150 }
		],
		viewrecords: true,
		autowidth:true,
		shrinkToFit: true,
		multiselect : true,
		height: nt_grid_h,
		rowNum: 20,
		//caption: "标题",
		pager: "#jqGridPager",
		loadComplete:function(data) {
			if(data.records === 0) {
				alert("当前没有数据！");
			}
			count = data.records;

			toPage();//分页初始化
		}
	});
};

toPage = function() {
	layui.use(['laypage', 'layer'], function() {
		var laypage = layui.laypage, layer = layui.layer;
		var rowNum = this_grid.jqGrid('getGridParam', 'rowNum');
		//测试关联jqgrid
		laypage.render({
			elem: 'pageContainer'
			,count: count //数据总量
			,limit: rowNum //每页显示的条数
			,layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip']
			,prev: '<i class="layui-icon layui-icon-left"></i>'
			,next: '<i class="layui-icon layui-icon-right"></i>'
			,jump: function(obj,first) {
				if(!first) {
					//obj 当前分页的所有选项值
					//console.log(obj.curr); //得到当前页，向后请求对应页数据，默认为起始页1，一般用于刷新类型的跳页以及HASH跳页。
					//console.log(obj.limit); //得到每页显示的条数
					//var p = this_grid.jqGrid('getGridParam','page');//jqgrid获取当前页
					this_grid.jqGrid('setGridParam', {
						url:'http://trirand.com/blog/phpjqgrid/examples/jsonp/getjsonp.php?callback=?&qwery=longorders',
						datatype:'jsonp',
						page:obj.curr,
						loadComplete: function(data) {
							if(data.records === 0) {
								alert("当前没有数据！");
							}
							obj.curr = this_grid.jqGrid('getGridParam','page');
						}
					}).setGridParam({rowNum:obj.limit}).trigger("reloadGrid");
				}
			}
		});
	});
};

$(function() {
	gridInit();//表格初始化
});
