﻿window.angularTube.main = (function (service, controller) {
	var app = angular.module('AngularTube', ["ui.router", "ngMessages", "LocalStorageModule", "ui.bootstrap", "ajoslin.promise-tracker", "chieffancypants.loadingBar", "ngAnimate"]);

	function run()
	{
		app.run(function () {
			var tag = document.createElement('script'),
				firstScriptTag = document.getElementsByTagName('script')[0];
			tag.src = "http://www.youtube.com/iframe_api";
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
		.config(function ($httpProvider) {
			$httpProvider.defaults.useXDomain = true;
			delete $httpProvider.defaults.headers.common['X-Requested-With'];
		})
		.config(['localStorageServiceProvider', function (localStorageServiceProvider) {
			localStorageServiceProvider
				.setStorageType('sessionStorage');
		}])
		.config(function (cfpLoadingBarProvider) {
			cfpLoadingBarProvider.includeSpinner = true;
			cfpLoadingBarProvider.latencyThreshold = 5000;
			cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Loading...</span></div>';
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