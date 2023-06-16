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
            var getRules = function (arr, phase, segment) {
                var rules = [];
                for(var i = 1; i < arr.length; i++) {
                    var rule = arr[i]

                    var v = [];
                    if (rule[0] === "MATCH") {
                        for (var j = 1; j < rule[1].length; j++)
                            v.push (rule[1][j]);
                        
                        rule = rule[2];
                    }
                    
                    if (rule[0] === "RULE") {
                        var r = {read: [], write: []};
                        for (var j = 1; j < rule[1].length; j++) {
                            if (phase === "FWD")
                                r.read.push (rule[1][j]);
                                
                            else if (phase === "BWD")
                                r.write.push (rule[1][j]);
                        }
                        
                        for (var j = 1; j < rule[2].length; j++) {
                            if (phase === "FWD")
                                r.write.push (rule[2][j]);
                            
                            else if (phase === "BWD")
                                r.read.push (rule[2][j]);
                        }
                        
                        rules.push ({segment: segment, vars: v, rule: r});
                    }
                }
                
                return rules;
            }
            
            var getStart = function (rules) {
                for (var i = 0; i < rules.length; i++)
                    if (rules[i].rule.read.length === 0)
                        return i;
            }
            
            var parse = function (rules, input) {
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
            
            var prove = function (rules, input) {
                var chart = [];
                chart.push ([{descendRule: -1, write: undefined, input: input, index: -1, proof: []}]);
                var lvl = 0;
                while (chart.length > 0) {
                    if (chart[lvl].length === 0) {
                        if (lvl > 0) {
                            chart.pop ();
                            lvl--;
                            continue;
                        }
                        else {
                            return ["failure"]; // failure
                        }
                    }
                    else {
                        var item = chart[lvl][chart[lvl].length - 1];
                    }
                    
                    if ((!item.write && !item.input) || item.index <= -2 || (item.write && item.index === item.write.length && item.input.length === item.write.length)) {
                        chart[lvl].pop ();
                        if (chart[lvl].length > 0) {
                            var tmpItem = chart[lvl][chart[lvl].length - 1];
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
                            lvl--;
                            if (lvl >= 0) {
                                var tmpItem = chart[lvl][chart[lvl].length - 1];
                                tmpItem.proof = item.proof;
                                chart[lvl].push ({descendRule: -1, write: item.tmpWrite, input: item.tmpInput, index: -1, proof: item.proof});
                            } else {
                                return item.proof; // success
                            }
                        }
                    }
                    else if (item.index === -1) {
                        if (item.descendRule + 1 < rules.length) {
                            item.descendRule++;
                            chart.push ([{descendRule: -1, write: item.write, input: rules[item.descendRule].rule.read[0], index: 0, proof: [], tmpWrite: rules[item.descendRule].rule.write[0], tmpInput: item.input, tmpProof: item.proof}]);
                            lvl++;
                        } else {
                            item.index = 0;
                            item.descendRule = -1;
                            item.proof = [];
                        }
                    }
                    else if (item.descendRule + 1 < rules.length && item.write && item.input && item.index < item.input.length && Array.isArray(item.write[item.index]) && Array.isArray(item.input[item.index])) {
                        item.descendRule++;
                        chart[lvl].push ({descendRule: -1, write: item.write[item.index], input: item.input[item.index], index: -1, proof: []});
                    }
                    else if (item.write && item.input && item.index < item.input.length && item.write[item.index] === item.input[item.index]) {
                        item.proof[item.index] = item.write[item.index];
                        item.index++;
                        item.descendRule = -1;
                    }
                    else {
                        chart[lvl].pop ();
                    }
                }
            }

            var applySingleRule = function (rules, input) {
                var arrayMatch = function (arr1, arr2, vars) {
                    if (Array.isArray (arr1) && Array.isArray (arr2)) {
                        if (arr1.length === arr2.length) {
                            for (var i = 0; i < arr1.length; i++) {
                                if (!arrayMatch (arr1[i], arr2[i], vars)) {
                                    return false;
                                }
                            }
                            
                            if (i === arr1.length) {
                                return true;
                            }
                        }
                    }
                    else if (vars && typeof arr2 === 'string'){
                        if (vars[arr2] === null) {
                            vars[arr2] = arr1;
                            return true;
                        }
                        else if (vars[arr2] !== undefined) {
                            return arrayMatch (arr1, vars[arr2]);
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
                
                var getVars = function (vars) {
                    if (vars.length > 0) {
                        var v = [];
                        for (var i = 0; i < vars.length; i++) {
                            v[vars[i]] = null;
                        }
                        
                        return v;
                    }
                    else {
                        return null;
                    }
                }
                
                var substVars = function (vars, arr) {
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
                                ret.push (substVars (vars, arr[i]));
                            }
                        } else if (vars[arr]) {
                            ret = vars[arr];
                        }
                        else {
                            ret = arr;
                        }
                        
                        return ret;
                    }
                }
                
                var vars = getVars(rules[0].vars);
                if (arrayMatch (input, rules[0].rule.read[0], vars)) {
                    return substVars (vars, rules[0].rule.write[0]);
                }
                else {
                    return ["failure"];
                }
            }
            
            function extractResult (proof) {
                var loop = proof
                while (loop[1] && loop[1].segment !== "CHAIN" && loop[1].segment !== undefined) {
                    loop = loop[1].proof;
                }
                
                if (loop[1] && loop[1].segment) {
                    return traverse (loop[0]);
                }
                else {
                    return traverse (loop);
                }
            }
            
            function traverse (loop) {
                if (loop[1] && loop[1].segment) {
                    return extractResult (loop);
                }
                else {
                    var ret;
                    if (Array.isArray (loop)) {
                        ret = [];
                        for (var i = 0; i < loop.length; i++) {
                            ret.push (traverse (loop[i]));
                        }
                    }
                    else {
                        ret = loop;
                    }
                    
                    return ret;
                }
            }
            
            var ret = null;
            if (rules[0] === "RSYS") {
                if (phase === "FWD") {
                    var rules = getRules (rules[1], "FWD", "ITYPE");
                }
                else if (phase === "BWD") {
                    var rules = getRules (rules[2], "BWD", "CHAIN").concat (getRules (rules[3], "BWD", "OTYPE"));
                }
                
                var proof = prove (rules, input);
                //var ret = traverse (proof, proof[1]);
                var ret = extractResult (proof);
                //var ret = proof;
                /*
                if (phase === "BWD")
                    while ((ret.seg === "CHAIN"))
                        ret = ret.derivesFrom;
                */
            }
            else if (rules[0] === "RULE" || rules[0] === "MATCH") {
                var rules = getRules (["SINGLE_RULE", rules], "FWD", "SINGLE_RULE");
                var ret = applySingleRule (rules, input);
            }
            
            return (ret[0] !== "failure" ? {output: ret, rules: rules} : {err: {indexes: [0]}});
            //return (ret ? {output: ret.write, rules: rules} : {err: {indexes: [0]}});
            
            //rules = getRules (rules[1], "FWD", "ITYPE");
            //return {output: prove (rules, input), rules: rules};
        }
        
        return {
            rewrite: rewrite
        }
    }) ()
);
