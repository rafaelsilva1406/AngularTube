window.angularTube.main = (function (service, controller) {
	var app = angular.module('AngularTube', ["ui.router", "ajoslin.promise-tracker"]);

	function run()
	{
		app.run(function () {
			var tag = document.createElement('script');
			tag.src = "http://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		});
	}

	function config()
	{
		app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise('/home');
			$stateProvider
			  .state('home', {
				  url: '/home',
				  templateUrl: 'view/page/home.html',
				  controller: 'VideosController'
			  });
		}])
		app.config(function ($httpProvider) {
			$httpProvider.defaults.useXDomain = true;
			delete $httpProvider.defaults.headers.common['X-Requested-With'];
		});
	}

	function init()
	{
		if (app != undefined || Object.getOwnPropertyNames(app).length != 0) {
			run();
			config();
			service.init(app);
			controller.init(app);
		} else {
			alert('Angular instance failed.');
		}
	}

	return {
		init:init
	};
})(window.angularTube.service,window.angularTube.controller);
window.angularTube.main.init();