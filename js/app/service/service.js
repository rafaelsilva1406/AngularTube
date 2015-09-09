window.angularTube.service = (function () {

    function init(obj)
    {
        obj.service('VideosService', ['$window', '$rootScope', '$log', function ($window, $rootScope, $log) {

            var service = this;

            var youtube = {
                ready: false,
                player: null,
                playerId: null,
                videoId: null,
                videoTitle: null,
                playerHeight: '480',
                playerWidth: '640',
                state: 'stopped'
            };
            var results = [];
            var upcoming = [
              { id: 'kRJuY6ZDLPo', title: 'La Roux - In for the Kill (Twelves Remix)' },
              { id: '45YSGFctLws', title: 'Shout Out Louds - Illusions' },
              { id: 'ktoaj1IpTbw', title: 'CHVRCHES - Gun' },
              { id: '8Zh0tY2NfLs', title: 'N.E.R.D. ft. Nelly Furtado - Hot N\' Fun (Boys Noize Remix) HQ' },
              { id: 'zwJPcRtbzDk', title: 'Daft Punk - Human After All (SebastiAn Remix)' },
              { id: 'sEwM6ERq0gc', title: 'HAIM - Forever (Official Music Video)' },
              { id: 'fTK4XTvZWmk', title: 'Housse De Racket â˜â˜€â˜ Apocalypso' }
            ];
            var history = [
              { id: 'XKa7Ywiv734', title: '[OFFICIAL HD] Daft Punk - Give Life Back To Music (feat. Nile Rodgers)' }
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
                for (var i = list.length - 1; i >= 0; i--) {
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
    }

    return {
        init:init
    };
})();