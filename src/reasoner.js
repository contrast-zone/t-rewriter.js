// reasoner.js
// (c) contrast zone, 2023
// MIT License

var Reasoner = (
    function (obj) {
        return {
            rewrite: obj.rewrite
        };
    }
) (
    (function () {
        "use strict";
        
        var rewrite = function (rules, input, phase) {
            var ruleIndex = 0;
            var getRules = function (arr, phase, segment) {
                var rules = [];
                for(var i = 1; i < arr.length; i++) {
                    var rule = arr[i]

                    var v = [];
                    if (rule[0] === "MATCH") {
                        for (var j = 1; j < rule[1].length; j++) {
                            v.push (rule[1][j]);
                        }
                        
                        rule = rule[2];
                    }
                    
                    if (rule[0] === "RULE") {
                        var r = {read: [], write: []};
                        for (var j = 1; j < rule[1].length; j++) {
                            if (phase === "FWD") {
                                r.read.push (rule[1][j]);
                            }
                            else if (phase === "BWD") {
                                r.write.push (rule[1][j]);
                            }
                        }
                        
                        for (var j = 1; j < rule[2].length; j++) {
                            if (phase === "FWD") {
                                r.write.push (rule[2][j]);
                            }
                            else if (phase === "BWD") {
                                r.read.push (rule[2][j]);
                            }
                        }
                        
                        rules.push ({index: ruleIndex++, segment: segment, vars: v, rule: r});
                    }
                }
                
                return rules;
            }
            
            var getStart = function (rules) {
                for (var i = 0; i < rules.length; i++)
                    if (rules[i].rule.read.length === 0)
                        return i;
            }
            
            var proveCFG = function (rules, input) {
                var chart = [];
                var start = getStart (rules);
                chart.push ({descendRule: -1, write: rules[start].rule.write[0], input: input, index: 0, proof: []});
                while (chart.length > 0) {
                    var el = chart[chart.length - 1];
                    if (Array.isArray (el.input) && el.input.length === el.write.length) {
                        if (el.index === el.write.length) {
                            chart.pop ();
                            if (chart.length > 0) {
                                chart[chart.length - 1].proof[chart[chart.length - 1].index] = el.proof; // construct proof
                                chart[chart.length - 1].index++;
                                chart[chart.length - 1].descendRule = -1;
                            
                            } else
                                return el.proof; // success
                        
                        } else {
                            if (el.write[el.index].charAt(0) === "<" && el.write[el.index].charAt(el.write[el.index].length - 1) === ">") { // is nonterminal
                                for (var i = el.descendRule + 1; i < rules.length; i++)
                                    if (rules[i].rule.read[0] && rules[i].rule.read[0].length === 1 && rules[i].rule.read[0][0] === el.write[el.index]) {
                                        el.descendRule = i;
                                        chart.push ({descendRule: -1, write: rules[i].rule.write[0], input: el.input[el.index], index: 0, proof: []});
                                        break;
                                    }
                                
                                if (i === rules.length)
                                    chart.pop ();
                                        
                            } else {
                                if (el.write[el.index] === el.input[el.index]) {
                                    el.proof[el.index] = el.write[el.index]; // construct proof
                                    el.index++;
                                    el.descendRule = -1;
                                
                                } else
                                    chart.pop ();
                            }
                        }    
                    } else
                        chart.pop ();
                }
                
                return ["failure"];
            }
            
            var proveUG = function (rules, input) {
                var chart = [];
                chart.push ([{descendRule: -1, write: undefined, input: input, index: -1, proof: []}]);
                var level = 0;
                while (chart.length > 0) {
                    var item;
                    if (chart[level].length === 0) {
                        if (level > 0) {
                            chart.pop ();
                            level--;
                            continue;
                        }
                        else {
                            return ["failure"]; // failure
                        }
                    }
                    else {
                        item = chart[level][chart[level].length - 1];
                    }
                    
                    if ((!item.write && !item.input) || item.index <= -2 || (item.write && item.index === item.write.length && item.input.length === item.write.length)) {
                        chart[level].pop ();
                        if (chart[level].length > 0) {
                            var tmpItem = chart[level][chart[level].length - 1];
                            if (tmpItem.index < 0) {
                                tmpItem.proof = [tmpItem.proof].concat ({segment: rules[tmpItem.descendRule].segment, proof: item.proof}); // item.proof;
                                tmpItem.index--;
                            }
                            else {
                                tmpItem.proof[tmpItem.index] = item.proof;
                                tmpItem.index++;
                            }
                            tmpItem.descendRule = -1;
                        }
                        else {
                            chart.pop ();
                            level--;
                            if (level >= 0) {
                                var tmpItem = chart[level][chart[level].length - 1];
                                tmpItem.proof = item.proof;
                                chart[level].push ({descendRule: -1, write: item.tmpWrite, input: item.tmpInput, index: -1, proof: item.proof});
                            }
                            else {
                                return item.proof; // success
                            }
                        }
                    }
                    else if (item.index === -1) {
                        if (item.descendRule + 1 < rules.length) {
                            item.descendRule++;
                            chart.push ([{descendRule: -1, write: item.write, input: rules[item.descendRule].rule.read[0], index: 0, proof: [], tmpWrite: rules[item.descendRule].rule.write[0], tmpInput: item.input, tmpProof: item.proof}]);
                            level++;
                        }
                        else {
                            item.index = 0;
                            item.descendRule = -1;
                            item.proof = [];
                        }
                    }
                    else if (item.descendRule + 1 < rules.length && item.write && item.input && item.index < item.input.length && Array.isArray(item.write[item.index]) && Array.isArray(item.input[item.index])) {
                        //item.descendRule++;
                        item.descendRule = rules.length;
                        chart[level].push ({descendRule: -1, write: item.write[item.index], input: item.input[item.index], index: -1, proof: []});
                    }
                    else if (item.descendRule + 1 < rules.length && item.write && item.input && item.index < item.input.length && item.write[item.index] === item.input[item.index]) {
                        item.proof[item.index] = item.write[item.index];
                        item.index++;
                        item.descendRule = -1;
                    }
                    else {
                        chart[level].pop ();
                    }
                }
            }
            
            var varIndex = 0;
            var prove = function (rules, input) {
                var chart = [];
                chart.push ([{descendRule: -1, write: undefined, input: input, index: -1, follows: []}]);
                var level = 0;
                while (chart.length > 0) {
                    var item;
                    if (chart[level].length === 0) {
                        if (level > 0) {
                            chart.pop ();
                            level--;
                            continue;
                        }
                        else {
                            return ["failure"]; // failure
                        }
                    }
                    else {
                        item = chart[level][chart[level].length - 1];
                    }
                    
                    var we = undefined;
                    if (item.writeEx) {
                        if (item.writeEx.val) {
                            we = item.writeEx.val;
                        }
                        else {
                            we = item.writeEx;
                        }
                    }
                    
                    if ((!item.write && !item.input) || item.index <= -2 || (item.write && item.index === item.write.length && item.input.length === item.write.length)) {
                        chart[level].pop ();
                        //if (!tmpItem || getVarsUnify (tmpItem.follows, [])) {
                        if (!tmpItem || getVarsUnify (tmpItem.follows, [], [])) {
                            //chart[level].pop ();
                            if (chart[level].length > 0) {
                                var tmpItem = chart[level][chart[level].length - 1];
                                if (tmpItem.index < 0) {
                                    //var uv = [];
                                    //var tmpIt = [tmpItem.follows].concat ({segment: rules[tmpItem.descendRule].segment, ruleIndex: tmpItem.descendRule, follows: item.follows});
                                    //getVarsUnify (tmpIt, uv);
                                    //tmpItem.follows = setVarsUnify (tmpIt, uv);
                                    tmpItem.follows = [tmpItem.follows].concat ({segment: rules[tmpItem.descendRule].segment, ruleIndex: tmpItem.descendRule, follows: item.follows});
                                    tmpItem.index--;
                                }
                                else {
                                    //var uv = [];
                                    //var tmpIt = item.follows;
                                    //getVarsUnify (tmpIt, uv);
                                    //tmpItem.follows[tmpItem.index] = setVarsUnify (tmpIt, uv);
                                    tmpItem.follows[tmpItem.index] = item.follows;
                                    tmpItem.index++;
                                }
                                tmpItem.descendRule = -1;
                            }
                            else {
                                chart.pop ();
                                level--;
                                if (level >= 0) {
                                    var tmpItem = chart[level][chart[level].length - 1];
                                    tmpItem.follows = item.follows;
                                    //chart[level].push ({descendRule: -1, write: item.tmpWrite, input: item.tmpInput, index: -1, follows: item.follows});
                                    var tmpInput = extractResult (item.follows, undefined);
                                    var tmpRead = rules[tmpItem.descendRule].rule.read[0];
                                    if (!tmpRead) {
                                        tmpRead = [];
                                    }
                                    
                                    var vi = item.varIndex;
                                    var tmpWriteEx = undefined;
                                    var vars = Ruler.getVars(rules[tmpItem.descendRule].vars, vi);
                                    if (Ruler.arrayMatch (tmpInput, tmpRead, vars, vi)) {
                                        var tmpWrite = Ruler.substVars (vars, rules[tmpItem.descendRule].rule.write[0], vi);
                                        if (vars) {
                                            tmpWriteEx = Ruler.substVars (vars, rules[tmpItem.descendRule].rule.write[0], vi, true);
                                        }
                                    }
                                    else {
                                        var tmpWrite =  ["failure"];
                                    }
                                    
                                    //chart[level].push ({descendRule: -1, write: rules[item.tmpDescendRule].rule.write[0], input: item.tmpInput, index: -1, follows: item.follows});
                                    chart[level].push ({descendRule: -1, vars: rules[tmpItem.descendRule].vars, varIndex: vi, write: tmpWrite, writeEx: tmpWriteEx, input: item.tmpInput, index: -1, follows: item.follows});

                                    //if (vars) {
                                    //    varIndex++;
                                    //}
                                }
                                else {
                                    return item.follows; // success
                                }
                            }
                        }
                    }
                    else if (item.index === -1) {
                        if (item.descendRule + 1 < rules.length) {
                            item.descendRule++;
                            //chart.push ([{descendRule: -1, write: item.write, input: rules[item.descendRule].rule.read[0], index: 0, follows: [], tmpDescendRule: item.descendRule, tmpWrite: rules[item.descendRule].rule.write[0], tmpInput: item.input, tmpProof: item.follows}]);
                            chart.push ([{descendRule: -1, vars: rules[item.descendRule].vars, varIndex: varIndex, write: item.write, writeEx: item.writeEx, input: rules[item.descendRule].rule.read[0], index: 0, follows: [], tmpDescendRule: item.descendRule, tmpInput: item.input, tmpProof: item.follows}]);
                            level++;
                            varIndex++;
                        }
                        else {
                            item.follows = [];
                            item.index = 0;
                            item.descendRule = -1;
                        }
                    }
                    else if (item.input && item.index < item.input.length && item.vars && item.vars.indexOf (item.input[item.index]) > -1) {
                        item.follows[item.index] = {var: item.input[item.index] + "[" + item.varIndex + "]", val: we ? we[item.index] : item.write[item.index]};
                        item.index++;
                        item.descendRule = -1;
                    }
                    else if (
                        item.descendRule + 1 < rules.length && item.write && item.input && item.index < item.input.length &&
                        Array.isArray(item.write[item.index]) && Array.isArray(item.input[item.index])
                    ) {
                        //item.descendRule++;
                        item.descendRule = rules.length;
                        chart[level].push ({descendRule: -1, vars: item.vars, varIndex: item.varIndex, write: item.write[item.index], writeEx: we ? we[item.index] : undefined, input: item.input[item.index], index: -1, follows: []});
                    }
                    else if (
                        item.descendRule + 1 < rules.length && item.write && item.input && item.index < item.input.length &&
                        item.write[item.index] === item.input[item.index]
                    ) {
                        if (item.writeEx && item.writeEx.var && !item.follows.var) {
                            item.follows = {var: item.writeEx.var, val: []};
                        }
                        else if (item.writeEx && (item.writeEx[item.index] && item.writeEx[item.index].var) && !item.follows.var) {
                            item.follows[item.index] = {var: item.writeEx[item.index].var, val: undefined};
                        }
                        
                        if (item.follows.var) {
                            item.follows.val[item.index] = item.write[item.index];
                        }
                        else if (item.follows[item.index] && item.follows[item.index].var) {
                            item.follows[item.index].val = item.write[item.index];
                        }
                        else {
                            item.follows[item.index] = item.write[item.index];
                        }
                        
                        item.index++;
                        item.descendRule = -1;
                    }
                    else {
                        chart[level].pop ();
                    }
                }
            }
            
            var assignVar1 = function (varbl, val, vars, propgs) {
                if (vars[varbl]) {
                    if (deeperMatch (vars[varbl], val)) {
                        if (val.var) {
                            if (propgs[varbl].indexOf (val.var) > -1) {
                                if (!deeperMatch (vars[propgs[varbl][propgs[varbl].indexOf (val.var)]], val)) {
                                    return false;
                                }
                            }
                            else {
                                propgs[varbl].push (val.var);
                            }
                        }
                        
                        for (var i = 0; i < propgs[varbl].length; i++) {
                            if (!assignVar1 (propgs[varbl][i], (val.var ? val.val : val), vars, propgs)) {
                                return false;
                            };
                        }
                        
                        vars[varbl] = val;
                        return true;
                    }
                    else if (deeperMatch (val, vars[varbl])) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    propgs[varbl] = [];
                    if (val.var) {
                        propgs[varbl].push (val.var);
                        if (!assignVar1 (val.var, val.val, vars, propgs)) {
                            return false;
                        }
                    }
                    vars[varbl] = val;
                    
                    return getVarsUnify (val, vars, propgs);
                }
            }
            
            var assignVar2 = function (varbl, val, append, vars, propgs) {
                if (vars[varbl]) {
                    if (deeperMatch (vars[varbl], [val, append])) {
                        if (val.var) {
                            if (propgs[varbl].indexOf (val.var) > -1) {
                                if (!deeperMatch (vars[propgs[varbl][propgs[varbl].indexOf (val.var)]], [val, append])) {
                                    return false;
                                }
                            }
                            else {
                                propgs[varbl].push (val.var);
                            }
                        }

                        for (var i = 0; i < propgs[varbl].length; i++) {
                            if (!assignVar2 (propgs[varbl][i], (val.var ? val.val : val), append, vars, propgs)) {
                                return false;
                            }
                        }

                        vars[varbl] = [val, append];
                        
                        return true;
                    }
                    else if (deeperMatch ([val, append], vars[varbl])) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    propgs[varbl] = [];
                    if (val.var) {
                        propgs[varbl].push (val.var);
                        if (!assignVar2 (val.var, val.val, append, vars, propgs)) {
                            return false;
                        }
                    }

                    vars[varbl] = [val, append];
                    
                    return getVarsUnify ([val, append], vars, propgs);
                }
            }
            
            var getVarsUnify = function (item, vars, propgs) {
                if (item.follows) {
                    return getVarsUnify (item.follows, vars, propgs);
                }
                else if (item.var) {
                    if (!assignVar1 (item.var, item.val, vars, propgs)) {
                        return false;
                    }
                }
                else if (Array.isArray (item)) {
                    if (item[0] && item[0].var && item[1] && item[1].follows) {
                        if (!assignVar2 (item[0].var, item[0].val, item[1], vars, propgs)) {
                            return false;
                        }
                    }
                    else {
                        for (var i = 0; i < item.length; i++) {
                            ret = getVarsUnify (item[i], vars, propgs);
                            if (!ret)
                                return false;
                        }
                    }
                }
                
                return true;
            }

            var setVarsUnify = function (arr, vars) {
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
                            ret.push (setVarsUnify (arr[i], vars));
                        }
                    }
                    else if (arr.follows) {
                        ret = {segment: arr.segment, ruleIndex: arr.ruleIndex, follows: setVarsUnify (arr.follows, vars)}
                    }
                    else if (vars[arr.var] /*&& !arr.unified*/) {
                        if (arr.val.val) {
                            ret = {var: arr.var, val: {var: arr.val.var, val: setVarsUnify (vars[arr.val.var], vars)}/*, unified: true*/}
                        }
                        else {
                            ret = {var: arr.var, val: setVarsUnify (vars[arr.var], vars)/*, unified: true*/};
                        }
                    }
                    else {
                        ret = arr;
                    }
                    
                    return ret;
                }
            }
            
            var deeperMatch = function (arr1, arr2) {
                while (arr1.var) {
                    arr1 = arr1.val;
                }
                
                while (arr2.var) {
                    arr2 = arr2.val;
                }
                
                if (Array.isArray (arr1) && Array.isArray (arr2)) {
                    if (Array.isArray (arr2) && arr2[0] && arr2[1] && deeperMatch (arr1, arr2[0]) && arr2[1].follows) {
                        return true;
                    }
                    else if (arr1.length === arr2.length) {
                        for (var i = 0; i < arr1.length; i++) {
                            if (!deeperMatch (arr1[i], arr2[i])) {
                                return false;
                            }
                        }
                        
                        if (i === arr1.length) {
                            return true;
                        }
                    }
                }
                else if (Array.isArray (arr2) && arr2[0] && arr2[1] && arr1 === arr2[0] && arr2[1].follows) {
                    return true;
                }
                else if (arr1 === arr2) {
                    return true;
                }
                else if (arr1.follows && arr2.follows) {
                    return deeperMatch (arr1.follows, arr2.follows);
                }

                return false;
            }
            
            var unifyAll = function (input) {
                var vars = [];
                getVarsUnify (input, vars, []);
                return setVarsUnify (input, vars);
            }

            var applySingleRule = function (rules, input) {
                var vars = Ruler.getVars(rules[0].vars, 0);
                if (Ruler.arrayMatch (input, rules[0].rule.read[0], vars, 0)) {
                    return Ruler.substVars (vars, rules[0].rule.write[0], 0);
                }
                else {
                    return ["failure"];
                }
            }

            var extractResult = function (proof, seg) {
                var traverse = function (loop, seg) {
                    if (!loop) {
                        return loop;
                    }
                    else if (loop[1] && loop[1].segment) {
                        return extractResult (loop, seg);
                    }
                    else if (Array.isArray (loop)) {
                        var ret = [];
                        for (var i = 0; i < loop.length; i++) {
                            ret.push (traverse (loop[i], seg));
                        }
                        return ret;
                    }
                    else if (loop && loop.var) {
                        return traverse (loop.val);
                    }
                    else {
                        return loop;
                    }
                }
                
                var loop = proof
                while (loop[1] && loop[1].segment !== undefined && (loop[1].segment === seg || (seg === undefined))) {
                    loop = loop[1].follows;
                }
                
                if (loop[1] && loop[1].segment) {
                    return traverse (loop[0], seg);
                }
                else {
                    return traverse (loop, seg);
                }
            }
            
            var ret = null;
            if (rules[0] === "RSYSTEM") {
                if (phase === "FWD") {
                    var rules = getRules (rules[1], "FWD", "ITYPE");
                }
                else if (phase === "BWD") {
                    var rules = getRules (rules[2], "BWD", "CHAIN").concat (getRules (rules[3], "BWD", "OTYPE"));
                }
                
                var proof = prove (rules, input);
                var unified = unifyAll (proof);
                var ret = extractResult (unified, "OTYPE");
                //var ret = proof;
                /*
                if (phase === "BWD")
                    while ((ret.seg === "CHAIN"))
                        ret = ret.derivesFrom;
                */
            }
            else if (rules[0] === "RULE" || rules[0] === "MATCH") {
                var rules = getRules (["SINGLE-RULE", rules], "FWD", "SINGLE-RULE");
                var ret = applySingleRule (rules, input);
                var proof = [input, {segment: "SINGLE-RULE", rule: 0, follows: ret}];
            }
            
            return (ret[0] !== "failure" ? {output: ret, rules: rules, proof: unified} : {err: {indexes: [0]}});
            //return (ret ? {output: ret.write, rules: rules} : {err: {indexes: [0]}});
            
            //rules = getRules (rules[1], "FWD", "ITYPE");
            //return {output: prove (rules, input), rules: rules};
        }
        
        return {
            rewrite: rewrite
        }
    }) ()
);
