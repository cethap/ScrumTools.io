/**
 * Created by ScrumTools on 11/21/14.
 */
'use strict';


var tasksApp = angular.module('tasks');


tasksApp.controller('TasksCreateUpdateController', ['$scope', '$stateParams', 'Authentication', '$location', 'Tasks', 'SocketSprint','notify',
    function ($scope, $stateParams, Authentication, $location, Tasks, SocketSprint,notify) {
        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        $scope.priorities = [
            'Muy Alta',
            'Alta',
            'Media',
            'Baja',
            'Muy Baja'
        ];

        $scope.createTask = function (story) {
            var t = new Tasks({
                taskName: this.taskName,
                taskDescription: this.taskDescription,
                taskPriority: this.taskPriority,
                taskHours: this.taskHours,
                taskRemark: this.taskRemark,
                taskRuleValidation: this.taskRuleValidation
            });

            t.$save({ storyId: story._id }, function (task) {
                SocketSprint.emit('task.created', {task: task, room: story.sprintId});
                $scope.taskName = '';
                $scope.taskDescription = '';
                $scope.taskPriority = {};
                $scope.taskHours = '';
                $scope.taskRemark = '';
                $scope.taskRuleValidation = '';
                notify({message:'Tarea creada exitosamente!', templateUrl:'modules/error/angular-notify.html'});
            });
        };
        
        $scope.updateTask = function (updatedTask) {
            var task = updatedTask;

            task.$update({ storyId: task.storyId, taskId: task._id }, function(response) {
                SocketSprint.emit('task.updated', {task: response, room: $stateParams.sprintId});
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);