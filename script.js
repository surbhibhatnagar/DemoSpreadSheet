// Code goes here
'use strict';

var gridApp = angular.module('gridApp', []);
gridApp.service('dataService', function () {

    // private variable
    var _dependentObj = [];
    var _exprObj = new Array(10);
    for (var i = 0; i < 10; i++) {
        _exprObj[i] = new Array(10);
    }

    // public API
    return {
        dependentObj: _dependentObj,
        exprObj: _exprObj
    };
});

gridApp.controller('cellCtrl', function ($scope, dataService) {

    $scope.data = dataService.dependentObj;
    $scope.exprObj = dataService.exprObj;
    /*Calculates macro expression
     * Triggers on 'enter' Key press event of ng-keypress*/
    $scope.calculate = function ($event, data, records) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode == 13) {
            $scope.records[$scope.$varRow][$scope.$index].Value = parse(data, records);
        }
    };
    /*Recalculates value of all the cells containing macros
     * Triggers on changing cell values of ng-change event */
    $scope.recalculate = function () {
        var cellIndex = $scope.$varRow.toString() + $scope.$index.toString();
        //Check if current index is present in dependents array
        if ($scope.data.includes(cellIndex)) {
            //Look for expressions containing cellIndex
            for (var i = 0; i < 10; i++) {
                for (var j = 0; j < 10; j++) {
                    if ($scope.exprObj[i][j]) {
                        var expr = $scope.exprObj[i][j];
                        var operator1y = letterToNumber(expr.slice(5, 6));
                        var operator1x = expr.slice(6, 7);
                        var operator2y = letterToNumber(expr.slice(9, 10));
                        var operator2x = expr.slice(10, 11);
                        if (expr.includes('ADD') && $scope.records[operator1x][operator1y].Value && $scope.records[operator2x][operator2y].Value) {
                            $scope.records[i][j].Value = (parseFloat($scope.records[operator1x][operator1y].Value) +
                            parseFloat($scope.records[operator2x][operator2y].Value));
                        }
                        if (expr.includes('MUL') && $scope.records[operator1x][operator1y].Value && $scope.records[operator2x][operator2y].Value) {
                            $scope.records[i][j].Value = ($scope.records[operator1x][operator1y].Value) *
                                ($scope.records[operator2x][operator2y].Value);
                        }

                    }
                }
            }
            //

        }
    };

    function letterToNumber(letter) {
        var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
        return alphabet.indexOf(letter);
    }

    // Parse =MUL(A0, A1) or =MUL(A0, A1)
    function parse(data, records) {
        var mulRe = /=MUL\(([A-Z][0-9], [A-Z][0-9])\)/g;
        var addRe = /=ADD\(([A-Z][0-9], [A-Z][0-9])\)/g;
        //replace letters with numbers
        if (data.match(mulRe)) {
            var operator1y = letterToNumber(data.slice(5, 6));
            var operator1x = data.slice(6, 7);
            var operator2y = letterToNumber(data.slice(9, 10));
            var operator2x = data.slice(10, 11);
            if (records[operator1x][operator1y].Value && records[operator2x][operator2y].Value) {
                //Push only unique indices
                if (!$scope.data.includes(operator1x + operator1y)) {
                    $scope.data.push(operator1x + operator1y);
                }
                if (!$scope.data.includes(operator2x + operator2y)) {
                    $scope.data.push(operator2x + operator2y);
                }
                $scope.exprObj[$scope.$varRow][$scope.$index] = data;
                console.log("Parsing Multiply expr" + $scope.data);
                return (records[operator1x][operator1y].Value * records[operator2x][operator2y].Value);

            }
            else
                return "Expr values not valid";
        }
        else if (data.match(addRe)) {
            var operator1y = letterToNumber(data.slice(5, 6));
            var operator1x = data.slice(6, 7);
            var operator2y = letterToNumber(data.slice(9, 10));
            var operator2x = data.slice(10, 11);
            if (records[operator1x][operator1y].Value && records[operator2x][operator2y].Value) {
                //Push only unique indices
                if (!$scope.data.includes(operator1x + operator1y)) {
                    $scope.data.push(operator1x + operator1y);
                }
                if (!$scope.data.includes(operator2x + operator2y)) {
                    $scope.data.push(operator2x + operator2y);
                }
                $scope.exprObj[$scope.$varRow][$scope.$index] = data;
                console.log("Parsing Add expr" + $scope.data);
                return (parseFloat(records[operator1x][operator1y].Value) + parseFloat(records[operator2x][operator2y].Value));
            }
            else
                return "Expr values not valid";
        }
        else
            return "Expr not valid";
    }

});
//Table controller
gridApp.controller('GridCtrl', function ($scope) {

    $scope.numRows = 0;
    $scope.numColumns = 0;
    $scope.alphaIndex = function (n) {
        return String.fromCharCode(65 + n);
    };
    $scope.init = function () {
        var i, j, cell;
        var records = [],
            record;
        $scope.numRows = 10;
        $scope.numColumns = 10;
        for (i = 0; i < $scope.numRows; i++) {
            record = [];
            for (j = 0; j < $scope.numColumns; j++) {
                cell = {
                    value: ''
                };
                record.push(cell);
            }
            records.push(record);
        }
        $scope.records = records;

    };
    $scope.init();

});
