window.angularTube.service = (function () {
	function handleError(obj) {

		if (obj.status == 0) {
			return "Not able to connect to API.";
		}

		return obj.status + " : " + obj.statusText;
	}

	function init(obj)
	{
		obj.service('HelloService', ['$http', '$location', '$q', function ($http, $location, $q) {
			var user = {}

			this.config = function () {
				hello.init({
					google: 'CLIENT ID HERE'
				});

				hello.on('auth.login', function (auth) {
					/*
					 * Here add some logic to display to UI
					 */
					//hello(auth.network).api('/me').then(function (data) {
					//	user = data;
					//}, function (e) {
					//	alert('Signin error: ' + e.error.message);
					//});
				});
			};

			this.getUser = function(){
				return user;
			};
		}]);

		obj.service('VideosService', ['$window', '$rootScope', '$log', function ($window, $rootScope, $log) {
			var service = this,
				youtube = {
					ready: false,
					player: null,
					playerId: null,
					videoId: null,
					videoTitle: null,
					playerHeight: '480',
					playerWidth: '640',
					state: 'stopped'
				},
				results = [],
				upcoming = [
				  { id: 'h7ArUgxtlJs', title: 'deadmau5 feat. Rob Swire - Ghosts N Stuff' },
			   ],
			   history = [
				{ id: 'Mn69LJ0239E', title: 'Best of Deadmau5 (Continuous Mix | High Quality)' }
			   ];

			$window.onYouTubeIframeAPIReady = function () {
				youtube.ready = true;
				service.bindPlayer('placeholder');
				service.loadPlayer();
				$rootScope.$apply();
			};

			function onYoutubeReady(event) {
				youtube.player.cueVideoById(history[0].id);
				youtube.videoId = history[0].id;
				youtube.videoTitle = history[0].title;
			}

			function onYoutubeStateChange(event) {
				if (event.data == YT.PlayerState.PLAYING) {
					youtube.state = 'playing';
				} else if (event.data == YT.PlayerState.PAUSED) {
					youtube.state = 'paused';
				} else if (event.data == YT.PlayerState.ENDED) {
					youtube.state = 'ended';
					service.launchPlayer(upcoming[0].id, upcoming[0].title);
					service.archiveVideo(upcoming[0].id, upcoming[0].title);
					service.deleteVideo(upcoming, upcoming[0].id);
				}
				$rootScope.$apply();
			}

			this.bindPlayer = function (elementId) {
				youtube.playerId = elementId;
			};

			this.createPlayer = function () {
				return new YT.Player(youtube.playerId, {
					height: youtube.playerHeight,
					width: youtube.playerWidth,
					playerVars: {
						rel: 0,
						showinfo: 0
					},
					events: {
						'onReady': onYoutubeReady,
						'onStateChange': onYoutubeStateChange
					}
				});
			};

			this.loadPlayer = function () {
				if (youtube.ready && youtube.playerId) {
					if (youtube.player) {
						youtube.player.destroy();
					}
					youtube.player = service.createPlayer();
				}
			};

			this.launchPlayer = function (id, title) {
				youtube.player.loadVideoById(id);
				youtube.videoId = id;
				youtube.videoTitle = title;
				return youtube;
			}

			this.listResults = function (data) {
				results.length = 0;
				for (var i = data.items.length - 1; i >= 0; i--) {
					results.push({
						id: data.items[i].id.videoId,
						title: data.items[i].snippet.title,
						description: data.items[i].snippet.description,
						thumbnail: data.items[i].snippet.thumbnails.default.url,
						author: data.items[i].snippet.channelTitle
					});
				}
				return results;
			}

			this.queueVideo = function (id, title) {
				console.log(upcoming);
				upcoming.push({
					id: id,
					title: title
				});
				return upcoming;
			};

			this.archiveVideo = function (id, title) {
				history.unshift({
					id: id,
					title: title
				});
				return history;
			};

			this.deleteVideo = function (list, id) {
				for (var i = list.length - 1; i >= 0; i--){
					if (list[i].id == id) {
						list.splice(i, 1);
						break;
					}
				}
			};

			this.getYoutube = function () {
				return youtube;
			};

			this.getResults = function () {
				return results;
			};

			this.getUpcoming = function () {
				return upcoming;
			};

			this.getHistory = function () {
				return history;
			};

		}]);
		obj.service('YoutubeService',['$http', '$location', '$q', function ($http, $location, $q) {

			this.getAPI = function (data) {

				if (data.query == '') {
					return handleError({status:0});
				}

				return $http.get('https://www.googleapis.com/youtube/v3/search', {
					params: {
						key: 'YOUTUBE API KEY HERE',
						type: 'video',
						maxResults: '10',
						part: 'id,snippet',
						fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle',
						q: data.query
					}
				})
				.then(
				function (response) {

					if (response.data == undefined || response.data == '') {
						return handleError({ status: 0 });
					} else {
						return response.data;
					}
						
					},
				function (response) {
					return handleError(response);
				});
			};
		}]);
	}

	return {
		init:init
	};
})();