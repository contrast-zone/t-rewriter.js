// ruler.js
// (c) contrast zone, 2023
// MIT License

var Ruler = (
    function (obj) {
        return {
            arrayMatch: obj.arrayMatch,
            getVars: obj.getVars,
            substVars: obj.substVars,
            substVarsAll: obj.substVarsAll,
            cloneVars: obj.cloneVars
        };
    }
) (
    (function () {
        "use strict";

        var getVars = function (vars, varIndex) {
            if (vars.length > 0) {
                var v = [];
                for (var i = 0; i < vars.length; i++) {
                    v[vars[i] + "[" + varIndex + "]"] = null;
                }
                
                return v;
            }
            else {
                return null;
            }
        }

        var arrayMatch = function (arr1, arr2, vars1, vars2, varIndex) {
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
                (vars2 && typeof arr2 === 'string' && vars2[arr2 + "[" + varIndex + "]"] === null)
            ) {
                vars2[arr2 + "[" + varIndex + "]"] = arr1;
                return true;
            }
            else if (vars1 && typeof arr1 === 'string' && vars1[arr1] === null) {
                vars1[arr1] = (arr2 === true ? null : arr2);
                return true;
            }
            else if (vars2 && typeof arr2 === 'string' && vars2[arr2 + "[" + varIndex + "]"] === null) {
                vars2[arr2 + "[" + varIndex + "]"] = arr1;
                return true;
            }
            
            else if (vars1 && typeof arr2 === 'string' && vars1[arr2] === null) {
                vars1[arr2] = arr1;
                return true;
            }
            
            else if (
                (vars2 && typeof arr2 === 'string' && vars2[arr2 + "[" + varIndex + "]"] !== undefined) &&
                (vars1 && typeof arr1 === 'string' && vars1[arr1] !== undefined)
            ) {
                return arrayMatch (vars1[arr1], vars2[arr2 + "[" + varIndex + "]"], vars1, vars2, varIndex);
            }
            else if (vars2 && typeof arr2 === 'string' && vars2[arr2 + "[" + varIndex + "]"] !== undefined) {
                return arrayMatch (arr1, vars2[arr2 + "[" + varIndex + "]"], vars1, vars2, varIndex);
            }
            else if (vars1 && typeof arr1 === 'string' && vars1[arr1] !== undefined) {
                return arrayMatch (vars1[arr1], arr2, vars1, vars2, varIndex);
            }
            else if (arr1 === arr2) {
                return true;
            }

            return false;
        }
        
        var substVars = function (vars, arr, varIndex) {
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
                    if (vars[arr + "[" + varIndex + "]"]) {
                        ret = vars[arr + "[" + varIndex + "]"];
                    }
                    else if (vars[arr + "[" + varIndex + "]"] === null) {
                        ret = arr + "[" + varIndex + "]";
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
        
        var substVarsAll = function (vars1, vars2, arr, varIndex) {
            var ret = substVars (vars2, arr, varIndex);
            var ret = substVars (vars1, ret);
            return ret;
        }
        
        var cloneVars = function (vars) {
            if (!vars) {
                return null;
            }

            var ret;
            if (Array.isArray (vars)) {
                ret = [];
	            for (var i in vars) {
                	ret[i] = vars[i];//cloneVars (vars[i]);
                }
            }
            else {
                ret = vars;
            }
            
            return ret;
        }
        
        return {
            arrayMatch: arrayMatch,
            getVars: getVars,
            substVarsAll: substVarsAll,
            substVars: substVars,
            cloneVars: cloneVars
        }
    }) ()
);

