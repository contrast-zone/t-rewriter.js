// ruler.js
// (c) contrast zone, 2023
// MIT License

var Ruler = (
    function (obj) {
        return {
            arrayMatch: obj.arrayMatch,
            getVars: obj.getVars,
            substVars: obj.substVars
        };
    }
) (
    (function () {
        "use strict";

        var arrayMatch = function (arr1, arr2, vars, varIndex) {
            if (Array.isArray (arr1) && Array.isArray (arr2)) {
                if (arr1.length === arr2.length) {
                    for (var i = 0; i < arr1.length; i++) {
                        if (!arrayMatch (arr1[i], arr2[i], vars, varIndex)) {
                            return false;
                        }
                    }
                    
                    if (i === arr1.length) {
                        return true;
                    }
                }
            }
            else if (vars && typeof arr2 === 'string'){
                //if (vars[arr2] && vars[arr2].value === null) {
                if (vars[arr2 + "[" + varIndex + "]"] === null) {
                    //vars[arr2] = {value: arr1, originalArray: arr1};
                    vars[arr2 + "[" + varIndex + "]"] = arr1;
                    return true;
                }
                else if (vars[arr2 + "[" + varIndex + "]"] !== undefined) {
                    return arrayMatch (arr1, vars[arr2 + "[" + varIndex + "]"]);
                }
                else if (arr1 === arr2) {
                    return true;
                }
            }
            else if (arr1 === arr2) {
                return true;
            }

            return false;
        }
        
        var getVars = function (vars, varIndex) {
            if (vars.length > 0) {
                var v = [];
                for (var i = 0; i < vars.length; i++) {
                    //v[vars[i]] = {value: null, originalArray: null};
                    v[vars[i] + "[" + varIndex + "]"] = null;
                }
                
                return v;
            }
            else {
                return null;
            }
        }
        
        var substVars = function (vars, arr, varIndex, explicit) {
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
                        ret.push (substVars (vars, arr[i], varIndex, explicit));
                    }
                } else if (vars[arr + "[" + varIndex + "]"]) {
                    if (explicit) {
                        ret = {var: arr + "[" + varIndex + "]", val: vars[arr + "[" + varIndex + "]"]};
                    }
                    else {
                        ret = vars[arr + "[" + varIndex + "]"];
                    }
                }
                else {
                    ret = arr;
                }
                
                return ret;
            }
        }
        
        return {
            arrayMatch: arrayMatch,
            getVars: getVars,
            substVars: substVars
        }
    }) ()
);


