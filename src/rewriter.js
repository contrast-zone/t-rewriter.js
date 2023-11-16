// rewriter.js
// (c) contrast zone, 2023
// MIT License

var Rewriter = (
    function (obj) {
        return {
            rewrite: obj.rewrite
        };
    }
) (
    (function () {
        "use strict";
        
        var rewrite = function (rules, input) {
            var getRules = function (arr, phase) {
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
                        
                        rules.push ({vars: v, rule: r});
                    }
                }
                
                return rules;
            }
            
            var itemPop = function (chart, succ, itret) {
                chart.pop ();
                var item = chart[chart.length - 1];
                item.succ = succ;
                if (item.succ) {
                    if (item.state === "array") {
                        item.ret[item.arrayIndex] = itret;
                    }
                    else {
                        item.ret = itret;
                    }
                }
            }
            
            var varIndex = -1;
            var prove = function (rules, top, bot) {
                var eager = (bot === true);
                var ret = undefined;
                var chart = [];
                chart.push ({state: "top"});
                chart.push ({
                    state: "sexpr",
                    write: top,
                    read: bot,
                    ret: top
                });
                while (chart.length > 1) {
                    var item;
                    item = chart[chart.length - 1];
                    if (item.state === "sexpr") {
                        /*if (item.succ === true) {
                            itemPop (chart, true, item.ret);
                        }
                        else if (item.succ === false || item.read === false) {
                            if (!item.crossRules && !item.whole && Array.isArray (item.write) && item.read !== false) {
                                item.whole = true;
                                chart.push ({
                                    state: "proofBulk",
                                    ruleIndex: -1,
                                    write: item.write,
                                    read: item.read,
                                    ret: item.write
                                });
                            }
                            else {
                                itemPop (chart, false, item.ret);
                            }
                        }
                        */
                        if (item.succ === true || item.succ === false) {
                            if (!item.crossRules && !item.whole && Array.isArray (item.write) && item.read !== false) {
                                item.whole = true;
                                item.wholeSucc = item.succ;
                                chart.push ({
                                    state: "proofBulk",
                                    ruleIndex: -1,
                                    write: item.write,
                                    read: item.read,
                                    ret: item.write
                                });
                            }
                            else {
                                itemPop (chart, (item.wholeSucc ? true : item.succ), item.ret);
                            }
                        }
                        else if (Array.isArray (item.write)) {
                            chart.push ({
                                state: "array",
                                arrayIndex: -1,
                                write: item.write,
                                read: item.read,
                                ret: item.write
                            });
                        }
                        else {
                            chart.push ({
                                state: "atom",
                                write: item.write,
                                read: item.read,
                                ret: item.write
                            });
                        }
                    }
                    else if (item.state === "array") {
                        if (item.succ === false || (Array.isArray (item.read) && item.write.length !== item.read.length)) {
                            itemPop (chart, false, item.ret);
                        }
                        else if (item.arrayIndex === item.write.length - 1) {
                            itemPop (chart, true, item.ret);
                        }
                        else {
                            if (item.arrayIndex === -1) {
                                item.ret = [];
                            }
                            
                            item.arrayIndex++;
                            chart.push ({
                                state: "sexpr",
                                write: item.write[item.arrayIndex],
                                read: (item.read === true ? true : (Array.isArray (item.read) ? item.read[item.arrayIndex] : false)),
                                ret: item.write[item.arrayIndex]
                            });
                        }
                    }
                    else if (item.state === "atom") {
                        if (item.succ === true || (item.succ === false && item.read === true)) {
                            itemPop (chart, true, item.ret);
                        }
                        else if (item.succ === false) {
                            itemPop (chart, false, item.ret);
                        }
                        else {
                            chart.push ({
                                state: "proofBulk",
                                ruleIndex: -1,
                                write: item.write,
                                read: item.read,
                                ret: item.write
                            });
                        }
                    }
                    else if (item.state === "proofBulk") {
                        if (item.succ === true) {
                            itemPop (chart, true, item.ret);
                        }
                        else {
                            item.ruleIndex++;
                            if (item.ruleIndex < rules.length) {
                                chart.push ({
                                    state: "proofStep",
                                    ruleIndex: item.ruleIndex,
                                    write: item.write,
                                    read: item.read,
                                    ret: item.write
                                });
                            } else {
                                itemPop (chart, false, item.ret);
                            }
                        }
                    }
                    else if (item.state === "proofStep") {
                        var vi = item.varIndex;
                        var vars = Ruler.getVars(rules[item.ruleIndex].vars, vi);
                        if (item.succ === true || Ruler.arrayMatch (item.write, item.read, vars, vi)) {
                            if (item.crossRules) {
                                delete item.crossRules;
                                var vi = item.varIndex;
                                var vars = Ruler.getVars(rules[item.ruleIndex].vars, vi);
                                if (Ruler.arrayMatch (item.ret, rules[item.ruleIndex].rule.read[0], vars, vi)) {
                                    var tmpWrite = Ruler.substVars (vars, rules[item.ruleIndex].rule.write[0], vi);
                                    chart.push ({
                                        state: "sexpr",
                                        write: tmpWrite,
                                        read: item.read,
                                        ret: tmpWrite
                                    });
                                }
                                else {
                                    itemPop (chart, false, item.ret); // ERROR!!!
                                }
                            }
                            else {
                                itemPop (chart, true, item.ret);
                            }
                        }
                        else if (item.succ === false) {
                            itemPop (chart, false, item.ret);
                        }
                        else {
                            var vi = item.varIndex;
                            var vars = Ruler.getVars(rules[item.ruleIndex].vars, vi);
                            if (Ruler.arrayMatch (item.write, rules[item.ruleIndex].rule.read[0], vars, vi)) {
                                var tmpWrite = Ruler.substVars (vars, rules[item.ruleIndex].rule.write[0], vi);
                                chart.push ({
                                    state: "sexpr",
                                    write: tmpWrite,
                                    read: item.read,
                                    ret: tmpWrite
                                });
                            }
                            else if (Array.isArray (item.write)) {
                                chart.push ({
                                    state: "sexpr",
                                    write: item.write,
                                    read: rules[item.ruleIndex].rule.read[0],
                                    ret: item.write,
                                    crossRules: true
                                });
                                item.crossRules = true
                            }
                            else {
                                itemPop (chart, false, item.ret);
                            }
                        }
                    }
                }
                
                return chart[0].succ ? /*["SUCCESS"]*/chart[0].ret : ["FAILURE"];
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
                var proof1 = prove (rules1, input, true);
                var ret = proof1;//extractResult (proof1, "CHAIN");
            }
            else if (rules[0] === "RULE" && rules[2] && rules[1][0] === "READ" && rules[2][0] === "WRITE" && (isMeta (rules[1]) || isMeta (rules[2]))) {
                var rules0 = getRules (rules[1], "FWD", "READ");
                var proof0 = prove (rules0, undefined, input);
                var ret = proof0;//extractResult (proof0, "READ");
                if (ret[0] !== "FAILURE") {
                    var rules2 = getRules (rules[2], "BWD", "WRITE");
                    var proof2 = prove (rules2, undefined, true);
                    var ret = proof2;//extractResult (proof1, "WRITE");
                }                
            }
            else if (rules[0] === "RULE" && rules[3] && rules[1][0] === "READ" && rules[2][0] === "CHAIN" && rules[3][0] === "WRITE") {
                var rules0 = getRules (rules[1], "FWD", "READ");
                var proof0 = prove (rules0, undefined, input);
                var ret = proof0;//extractResult (proof0, "READ");
                if (ret[0] !== "FAILURE") {
                    var rules1 = getRules (rules[2], "FWD", "CHAIN");
                    var proof1 = prove (rules1, input, true);
                    var ret = proof1;//extractResult (proof1, "CHAIN");
                    if (ret[0] !== "FAILURE") {
                        var rules2 = getRules (rules[3], "BWD", "WRITE");
                        var proof2 = prove (rules2, undefined, ret);
                        var ret = proof2;//extractResult (proof2, "WRITE");
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
            
            return (ret[0] !== "FAILURE" ? {output: ret} : {err: {indexes: [0]}});
        }
        
        return {
            rewrite: rewrite
        }
    }) ()
);
