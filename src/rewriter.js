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
            
            var itemPop = function (chart, succ, itret, vars) {
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
                    item.wvars = concat (item.wvars, vars);
                }
            }
            
            var memoF, memoT;
            function memoGet (succ, bool, write, read, wvars, ret) {
                var memo = bool ? memoT : memoF;
                if (succ !== !bool && !Array.isArray (write)) {
                    for (var i = 0; i < memo.length - 1; i++) {
                        if (
                            read === memo[i].read && write === memo[i].write &&
                            ((wvars.indexOf (write) > -1) === (memo[i].wvars.indexOf (memo[i].write) > -1))
                        ) {
                            return memo[i];
                        }
                    }
                }
                
                if (succ === bool && !Array.isArray (write)) {
                    memo.push ({
                        write: write,
                        read: read,
                        wvars: wvars,
                        ret: ret
                    });
                }
                
                return false;
            }
            
            var prove = function (rules, top, bot) {
                var eager = (bot === true);
                var ret = undefined;
                var chart = [];
                memoF = [];
                memoT = [];
                chart.push ({
                    state: "top"
                });
                chart.push ({
                    state: "sexpr",
                    wvars: [],
                    rvars: [],
                    write: top,
                    read: bot,
                    ret: top
                });
                while (chart.length > 1) {
                    var item = chart[chart.length - 1];
                    if (item.state === "sexpr") {
                        var existsF = memoGet (item.succ, false, item.write, item.read, item.wvars);
                        var existsT = memoGet (item.succ, true, item.write, item.read, item.wvars, item.ret);
                        
                        if (item.read === false || (item.succ === undefined && existsF)) {
                            itemPop (chart, false, item.ret, item.wvars);
                        }
                        else if (item.succ === undefined && existsT) {
                            itemPop (chart, true, existsT.ret, item.wvars);
                        }
                        else {
                            if (item.succ === true || item.succ === false) {
                                if (!item.crossRules && !item.whole && Array.isArray (item.ret) && item.read !== false) {
                                    item.whole = true;
                                    item.wholeSucc = item.succ;
                                    chart.push ({
                                        state: "proofBulk",
                                        ruleIndex: -1,
                                        wvars: item.wvars,
                                        rvars: item.rvars,
                                        write: item.ret,
                                        read: item.read,
                                        ret: item.ret
                                    });
                                }
                                else {
                                    itemPop (chart, (item.wholeSucc ? true : item.succ), item.ret, item.wvars);
                                }
                            }
                            else if (Array.isArray (item.write)) {
                                chart.push ({
                                    state: "array",
                                    arrayIndex: -1,
                                    wvars: item.wvars,
                                    rvars: item.rvars,
                                    write: item.write,
                                    read: item.read,
                                    ret: item.write
                                });
                            }
                            else {
                                chart.push ({
                                    state: "atom",
                                    wvars: item.wvars,
                                    rvars: item.rvars,
                                    write: item.write,
                                    read: item.read,
                                    ret: item.write
                                });
                            }
                        }
                    }
                    else if (item.state === "array") {
                        if (item.succ === false || (Array.isArray (item.read) && item.write.length !== item.read.length)) {
                            itemPop (chart, false, item.ret, item.wvars);
                        }
                        else if (item.succ === true && item.arrayIndex === item.write.length - 1) {
                            itemPop (chart, true, item.ret, item.wvars);
                        }
                        else {
                            if (item.arrayIndex === -1) {
                                item.ret = [];
                            }
                            
                            item.arrayIndex++;
                            chart.push ({
                                state: "sexpr",
                                wvars: item.wvars,
                                rvars: item.rvars,
                                write: item.write[item.arrayIndex],
                                read: (item.read === true ? true : (Array.isArray (item.read) ? item.read[item.arrayIndex] : false)),
                                ret: item.write[item.arrayIndex]
                            });
                        }
                    }
                    else if (item.state === "atom") {
                        if (item.write === item.read) {
                            itemPop (chart, true, item.write, item.wvars);
                        }
                        else if (item.succ === true) {
                            itemPop (chart, true, item.ret, item.wvars);
                        }
                        else if (item.succ === false) {
                            itemPop (chart, false, item.ret, item.wvars);
                        }
                        else {
                            chart.push ({
                                state: "proofBulk",
                                ruleIndex: -1,
                                wvars: item.wvars,
                                rvars: item.rvars,
                                write: item.write,
                                read: item.read,
                                ret: item.write
                            });
                        }
                    }
                    else if (item.state === "proofBulk") {
                        if (item.succ === true) {
                            itemPop (chart, true, item.ret, item.wvars);
                        }
                        else {
                            item.ruleIndex++;
                            if (item.ruleIndex < rules.length) {
                                chart.push ({
                                    state: "proofStep",
                                    ruleIndex: item.ruleIndex,
                                    wvars: item.wvars,
                                    rvars: item.rvars,
                                    write: item.write,
                                    read: item.read,
                                    ret: item.write
                                });
                            } else {
                                itemPop (chart, item.read === true, item.ret, item.wvars);
                            }
                        }
                    }
                    else if (item.state === "proofStep") {
                        if (item.succ === true) {
                            if (item.crossRules) {
                                delete item.crossRules;
                                var tmpWrite = getMatchWrite (rules, item.ruleIndex, item.wvars, item.ret, rules[item.ruleIndex].rule.read[0]);
                                if (tmpWrite.succ) {
                                    console.log (JSON.stringify([item.read, rules[item.ruleIndex].rule.read[0], tmpWrite.write]))
                                    chart.push ({
                                        state: "sexpr",
                                        wvars: concat (item.wvars, concat (tmpWrite.rvars, tmpWrite.wvars)),
                                        rvars: item.rvars,
                                        write: tmpWrite.write,
                                        read: item.read,
                                        ret: tmpWrite.write
                                    });
                                }
                                else {
                                    itemPop (chart, false, item.ret, item.wvars); // ERROR!!!
                                }
                            }
                            else {
                                itemPop (chart, true, item.ret, item.wvars);
                            }
                        }
                        else if (item.succ === false) {
                            itemPop (chart, false, item.ret, item.wvars);
                        }
                        else {
                            if (item.wvars[item.rvars[item.read]] === null) {
                                //item.wvars[item.rvars[item.read]] === item.ret;
                                itemPop (chart, true, item.ret, item.wvars);
                            }
                            else if (item.rvars[item.read] === null) {
                                //item.rvars[item.read] = item.ret;
                                itemPop (chart, true, item.ret, item.wvars);
                            }
                            else if (item.rvars[item.read] !== undefined && item.rvars[item.read] === item.ret) {
                                itemPop (chart, true, item.ret, item.wvars);
                            }
                            else if (item.wvars[item.ret] === null && item.read !== false) {
                                //item.wvars[item.ret] = item.read;
                                itemPop (chart, true, item.ret, item.wvars);
                            }
                            else if (item.wvars[item.ret] !== undefined && item.wvars[item.ret] === item.read) {
                                itemPop (chart, true, item.ret, item.wvars);
                            }
                            else {
                                var looping = false;
                                var first = true;
                                for (var i = chart.length - 1; i >= 0; i--) {
                                    var c = chart[i]
                                    if (c.state === "sexpr") {
                                        if (c.wvars === item.wvars && c.write === item.write && c.read === rules[item.ruleIndex].rule.read[0]) {
                                            if (first) {
                                                first = false;
                                            }
                                            else {
                                                looping = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                                
                                if (!looping) {
                                    chart.push ({
                                        state: "sexpr",
                                        wvars: item.wvars,
                                        rvars: getVars(rules[item.ruleIndex].vars),
                                        write: item.write,
                                        read: rules[item.ruleIndex].rule.read[0],
                                        ret: item.write,
                                        crossRules: true
                                    });
                                    item.crossRules = true;
                                }
                                else {
                                    itemPop (chart, item.read === true ? true : (item.read === item.write), item.ret, item.wvars);
                                }
                            }
                        }
                    }
                }
                
                return chart[0].succ
                    ? (bot && bot !== true ? bot : chart[0].ret) //chart[0].ret//*/ Ruler.substVars (allVars, chart[0].ret)
                    : ["FAILURE"];
            }
            
            var concat = function (arr1, arr2) {
	            var ret = [];
                for (var i in arr1) {
                	ret[i] = arr1[i];
                }

	            for (var i in arr2) {
                	ret[i] = arr2[i];
                }

	            return ret;
            }

            var getVars = function (vars) {
                var v = [];
                for (var i = 0; i < vars.length; i++) {
                    v[vars[i]] = null;
                }
                
                return v;
            }
            
            var cloneVars = function (vars) {
                if (!vars) {
                    return null;
                }

                var ret;
                if (Array.isArray (vars)) {
                    ret = [];
	                for (var i in vars) {
                    	ret[i] = vars[i];
                    }
                }
                else {
                    ret = vars;
                }
                
                return ret;
            }
            
            var varIndex = 0;
            var getMatchWrite = function (rules, ruleIndex, wvars, write, read, noSubst) {
                wvars = cloneVars (wvars);
                var rvars = Ruler.getVars(rules[ruleIndex].vars, varIndex);
                if (Ruler.arrayMatch (write, read, wvars, rvars, varIndex)) {
                    var ret = {
                        succ: true,
                        rvars: rvars === null ? [] : rvars,
                        wvars: wvars === null ? [] : wvars,
                        varIndex: varIndex,
                        write: noSubst ? null : Ruler.substVarsAll (wvars, rvars, rules[ruleIndex].rule.write[0], varIndex),
                    };
                    
                    if (rvars !== null) {
                        varIndex++;
                    }
                }
                else {
                    var ret = {succ: false};
                }
                
                return ret;
            }

            var applySingleRule = function (rules, input) {
                var vars = Ruler.getVars(rules[0].vars, 0);
                if (Ruler.arrayMatch (input, rules[0].rule.read[0], null, vars, 0)) {
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
