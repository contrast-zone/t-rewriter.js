// ruler.js
// (c) contrast zone, 2024
// MIT License

var Ruler = (
    function (obj) {
        return {
            arrayMatch: obj.arrayMatch,
            getVars: obj.getVars,
            substVars: obj.substVars,
        };
    }
) (
    (function () {
        "use strict";

        var getVars = function (vars, varIndex) {
            if (varIndex !== undefined) {
                var vi = "_" + varIndex;
            }
            else {
                var vi = "";
            }

            if (vars.length > 0) {
                var v = [];
                for (var i = 0; i < vars.length; i++) {
                    v[vars[i] + vi] = null;
                }
                
                return v;
            }
            else {
                return null;
            }
        }

        var arrayMatch = function (arr1, arr2, vars1, vars2, varIndex) {
            //console.debug(JSON.stringify (arr1) + "#" + JSON.stringify (arr2));
            if (varIndex !== undefined) {
                var vi = "_" + varIndex;
            }
            else {
                var vi = "";
            }
            
            if (Array.isArray (arr1) && Array.isArray (arr2)) {
                if (arr1.length === arr2.length) {
                    for (var i = 0; i < arr1.length; i++) {
                        if (!arrayMatch (arr1[i], arr2[i], vars1, vars2, varIndex)) {
                            return false;
                        }
                    }
                    
                    if (i === arr1.length) {
                        return true;
                    }
                }
            }
            else if (
                (vars1 && typeof arr1 === 'string' && vars1[arr1] === null) &&
                (vars2 && typeof arr2 === 'string' && vars2[arr2 + vi] === null)
            ) {
                vars2[arr2 + vi] = arr1;
                return true;
            }
            else if (vars1 && typeof arr1 === 'string' && vars1[arr1] === null) {
                vars1[arr1] = (arr2 === true ? null : arr2);
                return true;
            }
            else if (vars2 && typeof arr2 === 'string' && vars2[arr2 + vi] === null) {
                vars2[arr2 + vi] = arr1;
                return true;
            }
            else if (vars1 && typeof arr2 === 'string' && vars1[arr2] === null) {
                vars1[arr2] = arr1;
                return true;
            }
            else if (
                (vars2 && typeof arr2 === 'string' && vars2[arr2 + vi] !== undefined) &&
                (vars1 && typeof arr1 === 'string' && vars1[arr1] !== undefined)
            ) {
                return arrayMatch (vars1[arr1], vars2[arr2 + vi], vars1, vars2, varIndex);
            }
            else if (vars2 && typeof arr2 === 'string' && vars2[arr2 + vi] !== undefined) {
                return arrayMatch (arr1, vars2[arr2 + vi], vars1, vars2, varIndex);
            }
            else if (vars1 && typeof arr1 === 'string' && vars1[arr1] !== undefined) {
                return arrayMatch (vars1[arr1], arr2, vars1, vars2, varIndex);
            }
            else if (arr1 === true || arr2 === true || arr1 === arr2) {
                return true;
            }

            return false;
        }

        var substVars = function (vars, arr, varIndex) {
            var vi = "_" + varIndex;
            if (!arr) {
                return null;
            }
            else if (!vars) {
                return arr;
            }
            else {
                var ret;
                if (Array.isArray (arr)) {
                    ret = [];
                    for (var i = 0; i < arr.length; i++) {
                        ret.push (substVars (vars, arr[i], varIndex));
                    }
                }
                else if (varIndex !== undefined) {
                    if (vars[arr + vi]) {
                        ret = vars[arr + vi];
                    }
                    else if (vars[arr + vi] === null) {
                        ret = arr + vi;
                    }
                    else {
                        ret = arr;
                    }
                } else {
                    if (vars[arr]) {
                        ret = vars[arr];
                    }
                    else {
                        ret = arr;
                    }
                }
                
                return ret;
            }
        }
        
        return {
            arrayMatch: arrayMatch,
            getVars: getVars,
            substVars: substVars,
        }
    }) ()
);

