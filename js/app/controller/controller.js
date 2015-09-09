window.angularTube.controller = (function () {

    function init(obj) {
        obj.controller('VideosController', ['$scope', '$http', '$log', 'HelloService', 'VideosService', 'YoutubeService', 'promiseTracker', 'cfpLoadingBar', 'localStorageService', function ($scope, $http, $log, HelloService, VideosService, YoutubeService, promiseTracker, cfpLoadingBar, localStorageService) {
            var $promise = {};
            $scope.youtube = VideosService.getYoutube();
            $scope.results = VideosService.getResults();
            $scope.upcoming = VideosService.getUpcoming();
            $scope.history = VideosService.getHistory();
            $scope.playlist = true;
            $scope.progress = promiseTracker();
            HelloService.config();
            
            $scope.start = function () {
                cfpLoadingBar.start();
                cfpLoadingBar.inc();
                cfpLoadingBar.set(0.3);
                cfpLoadingBar.status();
            };

            $scope.complete = function () {
                cfpLoadingBar.complete();
            }

            $scope.launch = function (id, title) {
                VideosService.launchPlayer(id, title);
                VideosService.archiveVideo(id, title);
                VideosService.deleteVideo($scope.upcoming, id);
                $log.info('Launched id:' + id + ' and title:' + title);
            };

            $scope.queue = function (id, title) {
                VideosService.queueVideo(id, title);
                console.log($scope.history);
                VideosService.deleteVideo($scope.history, id);
                $log.info('Queued id:' + id + ' and title:' + title);
            };

            $scope.delete = function (id) {
                VideosService.deleteVideo($scope.upcoming, id);
            };

            $scope.submit = function (search) {
                $scope.start();
                $promise = YoutubeService.getAPI(search)
                    .then(function (data) {
                        VideosService.listResults(data);
                        $scope.complete();
                    });
                    
                $scope.progress.addPromise($promise);
            }

            $scope.tabulate = function (state) {
                $scope.playlist = state;
            }

        }]);
    }

    return {
        init: init
    };
})();