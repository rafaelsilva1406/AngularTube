window.angularTube.controller = (function () {

    function init(obj) {
        obj.controller('VideosController', function ($scope, $http, $log, VideosService,promiseTracker) {
            var $promise = {};
            configService();

            function configService() {
                $scope.youtube = VideosService.getYoutube();
                $scope.results = VideosService.getResults();
                $scope.upcoming = VideosService.getUpcoming();
                $scope.history = VideosService.getHistory();
                $scope.playlist = true;
                $scope.progress = promiseTracker();
            }

            $scope.launch = function (id, title) {
                VideosService.launchPlayer(id, title);
                VideosService.archiveVideo(id, title);
                VideosService.deleteVideo($scope.upcoming, id);
                $log.info('Launched id:' + id + ' and title:' + title);
            };

            $scope.queue = function (id, title) {
                VideosService.queueVideo(id, title);
                VideosService.deleteVideo($scope.history, id);
                $log.info('Queued id:' + id + ' and title:' + title);
            };

            $scope.delete = function (id) {
                VideosService.deleteVideo($scope.upcoming, id);
            };

            $scope.submit = function () {
                $promise = $http.get('https://www.googleapis.com/youtube/v3/search', {
                    params: {
                        key: 'AIzaSyB49USoWlwgKupg7BjR-6EPQGftTbk9xEo',
                        type: 'video',
                        maxResults: '10',
                        part: 'id,snippet',
                        fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle',
                        q: this.query
                    }
                })
                .success(function (data) {
                    VideosService.listResults(data);
                    $log.info(data);
                })
                .error(function () {
                    $log.info('Search error');
                });

                $scope.progress.addPromise($promise);
            }

            $scope.tabulate = function (state) {
                $scope.playlist = state;
            }

        });
    }

    return {
        init: init
    };
})();