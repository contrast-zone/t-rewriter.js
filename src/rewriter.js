// rewriter.js
// (c) contrast zone, 2023
// MIT License

var Rewriter= (
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
                var ruleIndex = 0;
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
            
            var varIndex = -1;
            //var prove = function (rules, input, isChain) {
            var prove = function (rules, top, bot) {
                var ret = undefined, tmpRet = undefined;
                var chart = [];

                chart.push ({descendRule: -1, write: top, input: bot, index: 0, phase: "whole", follows: []});

                while (chart.length > 0) {
                    var item;
                    item = chart[chart.length - 1];
                    
                    // accept if index passes rule length
                    if (
                        (!item.write && !item.input) || item.phase === "parsed" ||
                        (item.write && Array.isArray(item.write) && (item.input === -1 || (Array.isArray(item.input) && item.input.length === item.write.length)) && item.index === item.write.length) ||
                        (item.write && typeof item.write === "string" && (item.input === -1 || item.write === item.input) && item.index > 0)
                    ) {
                        chart.pop ();
                        if (!item.subStep && item.parent) {
                            var tmpItem = item.parent;
                            if (tmpItem.phase === "whole" || tmpItem.phase === "parsed") {
                                if (!(tmpItem.follows && tmpItem.follows[1] && tmpItem.follows[1].branches)) {
                                    tmpItem.follows = [tmpItem.follows, {branches: []}];
                                }
                                tmpItem.follows[1].branches.push ({segment: rules[item.ruleIndex].segment, ruleIndex: item.ruleIndex, follows: item.follows});
                                tmpItem.descendRule = -1;
                                tmpItem.phase = "parsed";
                            }
                            else {
                                if (!tmpItem.follows[tmpItem.index]) {
                                    tmpItem.follows[tmpItem.index] = item.follows;
                                }
                                else {
                                    tmpItem.follows[tmpItem.index] = [tmpItem.follows[tmpItem.index], {branches: []}];//item.follows;
                                    tmpItem.follows[tmpItem.index][1].branches.push ({segment: rules[item.ruleIndex].segment, ruleIndex: item.ruleIndex, follows: item.follows});
                                }

                                tmpItem.descendRule = -1;
                                tmpItem.index++;
                            }
                        }
                        else {
                            if (item.parent) {
                                var tmpItem = item.parent;
                                if (tmpItem.phase !== "whole") {
                                    tmpItem.follows[tmpItem.index] = item.follows;
                                }
                                else {
                                    tmpItem.follows = item.follows;
                                }
                                
                                var tmpInput = extractResult (item.follows, undefined);
                                var tmpRead = rules[item.ruleIndex].rule.read[0];
                                if (!tmpRead) {
                                    tmpRead = [];
                                }
                                
                                var vi = item.varIndex;
                                var vars = Ruler.getVars(rules[item.ruleIndex].vars, vi);
                                if (Ruler.arrayMatch (tmpInput, tmpRead, vars, vi)) {
                                    var tmpWrite = Ruler.substVars (vars, rules[item.ruleIndex].rule.write[0], vi);
                                }
                                else {
                                    var tmpWrite =  ["FAILURE"];
                                }
                                
                                chart.push ({parent: tmpItem, ruleIndex: item.ruleIndex, descendRule: -1, vars: rules[item.ruleIndex].vars, varIndex: vi, write: tmpWrite, input: item.tmpInput[0], index: 0, phase: (item.tmpInput === -1 ? "parts" : "whole"), follows:  [], tmpInput: item.tmpInput[1]});
                                item.parent.succ = true;
                            }
                            // success
                            else {
                                if (!ret) {
                                    ret = item.follows;
                                }
                                else if (item.succ) {
                                    if (!tmpRet) {
                                        ret = [ret, {branches: [{follows: item.follows}]}];
                                        tmpRet = ret;
                                    } else {
                                        tmpRet[1].branches[0].follows = item.follows;
                                        tmpRet = tmpRet[1].branches[0].follows;
                                    }
                                }
                                
                                if (item.input === -1 && item.succ) {
                                    var tmpInput = extractResult (item.follows, undefined);
                                    chart.push ({descendRule: -1, write: tmpInput, input: bot, index: 0, phase: "whole", follows: item.follows});
                                } else {
                                    break;
                                }
                            }
                        }
                    }
                    // first, try the whole rule, then by parts
                    else if (item.phase === "whole") {
                        if (item.descendRule + 1 < rules.length) {
                            item.descendRule++;
                            if (rules[item.descendRule].vars.length > 0) {
                                varIndex++;
                            }
                            chart.push ({subStep: true, parent: item, ruleIndex: item.descendRule, descendRule: -1, vars: rules[item.descendRule].vars, varIndex: varIndex, write: item.write, input: rules[item.descendRule].rule.read[0], index: 0, phase: "parts", follows: [], tmpInput: [item.input, item.tmpInput]});
                        } else {
                            item.descendRule = -1;
                            item.index = 0;
                            item.follows = [];
                            item.phase = "parts";
                        }
                    }
                    // advance rule - array
                    else if (
                        item.phase === "parts" &&
                        item.descendRule + 1 < rules.length && item.write && item.input && item.index < item.input.length &&
                        Array.isArray(item.write[item.index]) && (Array.isArray(item.input/*[item.index]*/) || item.input === -1)
                    ) {
                        item.descendRule++;
                        chart.push ({parent: item, ruleIndex: item.descendRule, descendRule: -1, vars: item.vars, varIndex: item.varIndex, write: item.write[item.index], input: item.input[item.index], index: 0, phase: "whole", follows: []});
                    }
                    // advance rule - flat
                    else if (
                        item.phase === "parts" &&
                        item.descendRule + 1 < rules.length && item.write && item.input &&
                        Array.isArray(item.write) && (Array.isArray(item.input) || item.input === -1) &&
                        (typeof item.write[item.index] === 'string')
                    ) {
                        item.descendRule++;
                        chart.push ({subStep: true, parent: item, ruleIndex: item.descendRule, descendRule: -1, vars: item.vars, varIndex: item.varIndex, write: item.write[item.index], input: rules[item.descendRule].rule.read[0], index: 0, phase: "parts", follows: [], tmpInput: [(item.input === -1 ? -1 : item.input[item.index]), item.tmpInput]});
                    }
                    // advance index - variables
                    else if (
                        item.phase === "parts" &&
                        item.write &&
                        item.input && Array.isArray (item.input) && item.index < item.input.length &&
                        item.vars && item.vars.indexOf (item.input[item.index]) > -1
                    ) {
                        item.follows[item.index] = item.write[item.index];
                        item.index++;
                        item.descendRule = -1;
                    }
                    // advance index - array
                    else if (
                        item.phase === "parts" &&
                        item.write && item.input && Array.isArray(item.write) &&
                        ((item.input === -1) || (Array.isArray(item.input) && item.index < item.input.length && item.write[item.index] === item.input[item.index]))
                    ) {
                        item.follows[item.index] = item.write[item.index];
                        item.index++;
                        item.descendRule = -1;
                    }
                    // advance index - flat
                    else if (
                        item.phase === "parts" &&
                        item.write && item.input && item.index < 1 &&
                        ((item.input === -1) || (item.write === item.input))
                    ) {
                        item.follows = item.write;
                        item.index++;
                        item.descendRule = -1;
                    }
                    else {
                        chart.pop ();
                    }
                }
                
                if (ret) {
                    return ret; // success
                }
                else {
                    return ["FAILURE"];
                }
            }

            var applySingleRule = function (rules, input) {
                var vars = Ruler.getVars(rules[0].vars, 0);
                if (Ruler.arrayMatch (input, rules[0].rule.read[0], vars, 0)) {
                    return Ruler.substVars (vars, rules[0].rule.write[0], 0);
                }
                else {
                    return ["FAILURE"];
                }
            }

            var extractResult = function (proof, seg) {
                var traverse = function (loop, seg) {
                    if (!loop) {
                        return loop;
                    }
                    else if (loop[1] && (loop[1].branches || loop[1].segment)) {
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
                while (loop[1] && loop[1].branches && (loop[1].branches[0].segment === seg || (seg === undefined))) {
                    loop = loop[1].branches[0].follows
                }
                while (loop[1] && loop[1].segment !== undefined && (loop[1].segment === seg || (seg === undefined))) {
                    loop = loop[1].follows;
                }
                
                if (loop[1] && loop[1].branches) {
                    return traverse (loop[0], seg);
                }
                else if (loop[1] && loop[1].segment) {
                    return traverse (loop[0], seg);
                }
                else {
                    return traverse (loop, seg);
                }
            }
            
            function isMeta (arr) {
                for (var i = 1; i < arr.length; i++) {
                    if (arr[i][0] === "RULE" || arr[i][0] === "MATCH") {
                        return true;
                    }
                }
                
                return false;
            }
            
            var ret = null;
            if (rules[0] === "CHAIN") {
                var rules1 = getRules (rules, "FWD", "CHAIN");
                var proof1 = prove (rules1, input, -1);
                var ret = extractResult (proof1, "CHAIN");
            }
            else if (rules[0] === "RULE" && rules[2] && rules[1][0] === "READ" && rules[2][0] === "WRITE" && (isMeta (rules[1]) || isMeta (rules[2]))) {
                var rules0 = getRules (rules[1], "FWD", "READ");
                var proof0 = prove (rules0, undefined, input);
                var ret = extractResult (proof0, "READ");
                if (ret[0] !== "FAILURE") {
                    var rules1 = getRules (rules[2], "BWD", "WRITE");
                    var proof1 = prove (rules1, undefined, -1);
                    var ret = extractResult (proof1, "WRITE");
                }                
            }
            else if (rules[0] === "RULE" && rules[2] && rules[1][0] === "READ" && rules[2][0] === "CHAIN" && rules[3][0] === "WRITE") {
                var rules0 = getRules (rules[1], "FWD", "READ");
                var proof0 = prove (rules0, undefined, input);
                var ret = extractResult (proof0, "READ");
                
                if (ret[0] !== "FAILURE") {
                    var rules1 = getRules (rules[2], "FWD", "CHAIN");
                    var proof1 = prove (rules1, input, -1);
                    var ret = extractResult (proof1, "CHAIN");
                    
                    if (ret[0] !== "FAILURE") {
                        var rules2 = getRules (rules[3], "BWD", "WRITE");
                        //var proof2 = prove (rules2, ret);
                        var proof2 = prove (rules2, undefined, ret);
                        var ret = extractResult (proof2, "WRITE");
                    }
                }
            }
            else if (rules[0] === "RULE" || rules[0] === "MATCH") {
                var rules1 = getRules (["SINGLE-RULE", rules], "FWD", "SINGLE-RULE");
                var ret = applySingleRule (rules1, input);
                var proof1 = [input, {branches: [{segment: "SINGLE-RULE", ruleIndex: 0, follows: ret}]}];
            }
            else {
                ret = ["FAILURE"];
            }
            
            return (ret[0] !== "FAILURE" ? {output: ret, rules: rules1, proof: proof1} : {err: {indexes: [0]}});
        }
        
        return {
            rewrite: rewrite
        }
    }) ()
);
