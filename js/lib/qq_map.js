var qq_map1;
var qq_center1;
var qq_marker1;
// qq map
Vue.prototype.qq_map = function (center) {
	var _this = this;
	//地图
	qq_center1 = center;
	document.getElementById("qq_map").style.display = '';
	document.getElementById("l_map").style.height = parseInt(document.documentElement.clientHeight / 2) + 'px';
	qq_map1 = new qq.maps.Map(document.getElementById("l_map"), {
		disableDefaultUI: true,
		center: qq_center1,
		zoom: 14,
		scaleControl: true
	});
	//设置圆形
	var circle = new qq.maps.Circle({
		center: qq_center1, 
		radius: 300, 
		map: qq_map1, 
		strokeWeight: 0
	});
	//搜索
	var searchService = new qq.maps.SearchService({
		complete: function(results){
			var pois_html = new Array();
			var pois = results.detail.pois;
			for(var i=0; i<pois.length; i++) {
				pois_html.push('<div data-latLng="' + pois[i].latLng.lat + ',' + pois[i].latLng.lng + '"><h1>' + pois[i].name + '</h1><h2>' + pois[i].address + '</h2></div>');
			}
			document.getElementById("r_result").innerHTML = pois_html.join('');
		}
	});
	searchService.setPageCapacity(10);
	searchService.searchNearBy('公司', qq_map1.getCenter(), 2000);
	//初始点
	new qq.maps.Marker({
		icon: new qq.maps.MarkerImage('img/center.png', new qq.maps.Size(24, 24), new qq.maps.Point(0, 0), new qq.maps.Point(12, 12)),
		map: qq_map1,
		position: qq_center1
	});
	//动态中心点
	qq_marker1 = new qq.maps.Marker({
		icon: new qq.maps.MarkerImage('img/mark.png', new qq.maps.Size(20, 42), new qq.maps.Point(0, 0), new qq.maps.Point(10, 40)),
		position: qq_center1,
		map: qq_map1
	});
	qq.maps.event.addListener(qq_map1, 'center_changed', function() {
		qq_marker1.setPosition(qq_map1.getCenter());
		
		searchService.searchNearBy('公司', qq_map1.getCenter(), 2000);
	});
	//回到初始点
	var customToCenterDiv = document.createElement("div");
	customToCenterDiv.innerHTML = "<a><img src='img/back_center0.png' width='50'></a>" ;
	customToCenterDiv.index = 1;
	customToCenterDiv.style.margin='0 -100px 20px 0';
	customToCenterDiv.onclick = function() {
		qq_map1.panTo(qq_center1);
	}
	qq_map1.controls[qq.maps.ControlPosition.BOTTOM_RIGHT].push(customToCenterDiv);
}
//显示搜索
Vue.prototype.qq_map_search = function () {
	var _this = this;
	qq_map_search_show();
}
//关键词输入提示
function qq_map_search_keyword_suggest(val){
	var url = 'https://apis.map.qq.com/ws/place/v1/search?boundary=nearby(' + qq_map1.getCenter().getLat() + ',' + qq_map1.getCenter().getLng() + ',3000)&keyword=' + val + '&page_size=20&page_index=1&orderby=_distance&key=AW3BZ-IM7EU-NTLVB-BESN6-SKE32-WAFIT&output=jsonp&callback=qq_map_search_callback';
	Vue.http.jsonp(url).catch(function(e){});
}
function qq_map_search_callback(res){
	var pois = res.data;
	var pois_html = new Array();
	for(var i=0; i<pois.length; i++) {
		pois_html.push('<div onclick="panTo(' + pois[i].location.lat + ',' + pois[i].location.lng + ')"><h1>' + pois[i].title + '</h1><h2>' + pois[i].address + '</h2></div>');
	}
	document.getElementById("qq_map_search_result").innerHTML = pois_html.join('');
	document.getElementById("qq_map_search_result").style.display = '';
	qq_map_hide();
}
//移动到指定点
function panTo(lat, lng){
	var center = new qq.maps.LatLng(lat, lng);
	qq_map1.panTo(center);
	qq_marker1.setPosition(center);
	qq_map_search_hide();
	qq_map_show();
}
//显示地图
function qq_map_show() {
	document.getElementById("qq_map").style.display = '';
}
function qq_map_hide() {
	document.getElementById("qq_map").style.display = 'none';
}
//显示搜索
function qq_map_search_show(){
	document.getElementById("qq_map_search").style.display = '';
}
function qq_map_search_hide(){	
	document.getElementById("qq_map_search").style.display = 'none';
}