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
                var olditem = chart[chart.length - 1];
                chart.pop ();
                var item = chart[chart.length - 1];
                item.succ = succ;
                if (item.succ) {
                    if (item.state === "array" && !item.further) {
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
                if (succ !== !bool /*&& !Array.isArray (write)*/) {
                    for (var i = 0; i < memo.length; i++) {
                        if (
                            //read === memo[i].read && write === memo[i].write &&
                            arrayMatch (read, memo[i].read) && arrayMatch (write, memo[i].write) &&
                            ((wvars.indexOf (write) > -1) === (memo[i].wvars.indexOf (memo[i].write) > -1))
                        ) {
                            return memo[i];
                        }
                    }
                }
                
                if (succ === bool /*&& !Array.isArray (write)*/) {
                    memo.push ({
                        write: write,
                        read: read,
                        wvars: wvars,
                        ret: ret
                    });
                }
                
                return false;
            }
            
            var varIndex = 0;
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
                    state: "cycle",
                    wvars: [],
                    rvars: [],
                    write: top,
                    read: bot,
                    ret: top
                });
                while (chart.length > 1) {
                    var item = chart[chart.length - 1];
                    if (item.state === "cycle") {
                        //console.log (JSON.stringify(["CYCLE", item.read, item.write]))
                        var existsF = memoGet (item.succ, false, item.write, item.read, item.wvars);
                        var existsT = memoGet (item.succ, true, item.write, item.read, item.wvars, item.ret);
                        
                        if (item.read === false) {
                            itemPop (chart, false, item.ret, item.wvars);
                        }
                        else if (item.succ === undefined && existsF) {
                            itemPop (chart, false, item.ret, item.wvars);
                        }
                        else if (item.succ === undefined && existsT) {
                            itemPop (chart, true, existsT.ret, item.wvars);
                        }
                        else {
                            if (item.succ === false) {
                                itemPop (chart, false, item.ret, item.wvars);
                            }
                            else if (item.succ === true) {
                                itemPop (chart, true, item.ret, item.wvars);
                            }
                            else {
                                if (item.wvars[item.rvars[item.read]] === null) {
                                    item.wvars[item.rvars[item.read]] === item.ret;
                                    itemPop (chart, true, item.ret, item.wvars);
                                }
                                else if (item.rvars[item.read] === null) {
                                    item.rvars[item.read] = item.ret;
                                    itemPop (chart, true, item.ret, item.wvars);
                                }
                                else if (item.rvars[item.read] !== undefined && arrayMatch (item.ret, item.rvars[item.read], true)) {
                                    itemPop (chart, true, item.ret, item.wvars, true);
                                }
                                else if (item.wvars[item.ret] === null && item.read !== false) {
                                    item.wvars[item.ret] = item.read;
                                    itemPop (chart, true, item.read === true ? item.ret : item.read, item.wvars);
                                }
                                else if (item.wvars[item.ret] !== undefined && (item.wvars[item.ret] === true || arrayMatch (item.wvars[item.ret], item.read, true))) {
                                    itemPop (chart, true, item.read === true ? item.ret : item.read, item.wvars, true);
                                }
                                else {
                                    var looping = false;
                                    for (var i = chart.length - 2; i >= 0; i--) {
                                        var c = chart[i];
                                        if (c.state === "cycle") {
                                            if (
                                                arrayMatch (c.wvars, item.wvars) &&
                                                arrayMatch (c.write, item.write) &&
                                                arrayMatch (c.read, item.read)
                                            ) {
                                                looping = true;
                                                break;
                                            }
                                        }
                                    }
                                    
                                    if (!looping) {
                                        if (Array.isArray (item.write)) {
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
                                    else {
                                        itemPop (chart, item.read === true, item.ret, item.wvars); // Turing complete
                                        //itemPop (chart, false, item.ret, item.wvars); // total
                                    }
                                }
                            }
                        }
                    }
                    else if (item.state === "array") {
                        if (
                            (item.read === true || item.write.length === item.read.length) &&
                            item.arrayIndex === item.write.length - 1 &&
                            item.read === true
                        ) {
                            if (!item.further) {
                                item.further = true;
                                item.succ = undefined;
                            }
                            
                            if (item.succ === true || item.succ === false) {
                                itemPop (chart, true, item.ret, item.wvars);
                            }
                            else {
                                chart.push ({
                                    state: "proofSeq",
                                    wvars: item.wvars,
                                    rvars: item.rvars,
                                    write: item.ret,
                                    read: item.read,
                                    ret: item.ret
                                });
                            }
                        }
                        else if (item.succ === false || (item.succ === true && item.further)) {
                            itemPop (chart, item.succ, item.ret, item.wvars);
                        }
                        else if (
                            (
                                (item.read === true || item.write.length === item.read.length) &&
                                item.arrayIndex === item.write.length - 1 &&
                                item.succ === true
                            ) ||
                            arrayMatch (item.ret, item.read)
                        ) {
                            itemPop (chart, true, item.ret, item.wvars);
                        }
                        else if (
                            (item.read === true || item.write.length === item.read.length) &&
                            item.arrayIndex < item.write.length - 1 &&
                            (item.succ === true || item.arrayIndex === -1)
                        ) {
                            if (item.arrayIndex === -1) {
                                item.ret = [];
                            }

                            item.arrayIndex++;
                            chart.push ({
                                state: "cycle",
                                wvars: item.wvars,
                                rvars: item.rvars,
                                write: item.write[item.arrayIndex],
                                read: (
                                    item.read === true
                                    ? true
                                    : (Array.isArray (item.read) ? item.read[item.arrayIndex] : false)
                                ),
                                ret: item.write[item.arrayIndex]
                            });
                        }
                        else {
                            item.further = true;
                            chart.push ({
                                state: "proofSeq",
                                wvars: item.wvars,
                                rvars: item.rvars,
                                write: item.write,
                                read: item.read,
                                ret: item.write
                            });
                        }
                    }
                    else if (item.state === "atom") {
                        if (item.read === true) {
                            if (!item.further) {
                                item.succ = undefined;
                            }

                            if (item.succ === true || item.succ === false) {
                                itemPop (chart, true, item.ret, item.wvars);
                            }
                            else {
                                item.further = true;
                                chart.push ({
                                    state: "proofSeq",
                                    wvars: item.wvars,
                                    rvars: item.rvars,
                                    write: item.ret,
                                    read: item.read,
                                    ret: item.ret
                                });
                            }
                        }
                        else if (item.succ === true || item.succ === false) {
                            itemPop (chart, item.succ, item.ret, item.wvars);
                        }
                        else if (item.write === item.read) {
                            itemPop (chart, true, item.write, item.wvars);
                        }
                        else {
                            chart.push ({
                                state: "proofSeq",
                                wvars: item.wvars,
                                rvars: item.rvars,
                                write: item.write,
                                read: item.read,
                                ret: item.write
                            });
                        }
                    }
                    else if (item.state === "proofSeq") {
                        if (item.succ === false) {
                            itemPop (chart, item.further === true, item.ret, item.wvars);
                        }
                        else {
                            if (!item.further) {
                                item.further = true;
                                item.maxSucc = false;
                                item.acc = [];
                            }
                            
                            item.acc.push ({wvars: item.wvars, write: item.write, read: item.read});
                            var looping = false;
                            for (var i = item.acc.length - 2; i >= 0; i--) {
                                var c = item.acc[i];
                                if (
                                    arrayMatch (c.wvars, item.wvars) &&
                                    arrayMatch (c.write, item.write) &&
                                    arrayMatch (c.read, item.read)
                                ) {
                                    looping = true;
                                    break;
                                }
                            }
                            
                            item.maxSucc = item.maxSucc || item.succ;
                            if (!looping) {
                                chart.push ({
                                    state: "proofStep",
                                    ruleIndex: -1,
                                    wvars: item.wvars,
                                    rvars: item.rvars,
                                    write: item.ret,
                                    read: item.read,
                                    ret: item.ret
                                });
                            }
                            else {
                                itemPop (chart, item.maxSucc, item.ret, item.wvars);
                            }
                        }
                    }
                    else if (item.state === "proofStep") {
                        if (item.succ === true) {
                            itemPop (chart, true, item.ret, item.wvars);
                        }
                        else {
                            item.ruleIndex++;
                            if (item.ruleIndex < rules.length) {
                                chart.push ({
                                    state: "algStep",
                                    readIndex: -1,
                                    rule: rules[item.ruleIndex],
                                    wvars: item.wvars,
                                    rvars: getVars(rules[item.ruleIndex].vars),
                                    tmprvars: item.rvars,
                                    write: item.write,
                                    read: item.read,
                                    ret: item.write
                                });
                            } else {
                                itemPop (chart, false, item.ret, item.wvars);
                            }
                        }
                    }
                    else if (item.state === "algStep") {
                        if (item.succ === false || (item.rule.rule.read.length === 0 && item.write !== undefined)) {
                            itemPop (chart, false, item.ret, item.wvars);
                        }
                        else if (item.succ === true && item.readIndex === item.rule.rule.read.length) {
                            itemPop (chart, true, item.ret, item.wvars);
                        }
                        else {
                            item.readIndex++;
                            if (item.readIndex < item.rule.rule.read.length) {
                                chart.push ({
                                    state: "cycle",
                                    wvars: item.wvars,
                                    rvars: item.rvars,
                                    write: item.write,
                                    read: item.rule.rule.read[item.readIndex],
                                    ret: item.write
                                });
                            }
                            else {
                                var wvars = cloneVars (item.wvars);
                                var rvars = Ruler.getVars(item.rule.vars, varIndex);
                                if (Ruler.arrayMatch (item.ret, item.rule.rule.read[0], wvars, rvars, varIndex)) {
                                    var tmpWrite = Ruler.substVars (wvars, Ruler.substVars (rvars, item.rule.rule.write[0], varIndex));
                                    chart.push ({
                                        state: "cycle",
                                        wvars: concat (item.wvars, concat (wvars, rvars)),
                                        rvars: item.tmprvars,
                                        write: tmpWrite,
                                        read: item.read,
                                        ret: tmpWrite
                                    });
                                    
                                    if (rvars !== null) {
                                        varIndex++;
                                    }
                                }
                                else {
                                    //console.log (JSON.stringify (["SKIP UNMATCHED", item.ret]));
                                    itemPop (chart, false, item.ret, item.wvars);
                                }
                                
                                /*
                                var tmpWrite = substVars (item.wvars, substVars (item.rvars, item.rule.rule.write[0], varIndex));
                                if (arrayMatch (substVars (item.wvars, substVars (item.rvars, item.ret)), item.rule.rule.read[0])) {
                                    chart.push ({
                                        state: "cycle",
                                        wvars: concat (item.wvars, setVarIndex (item.rvars, varIndex)),
                                        rvars: item.tmprvars,
                                        write: tmpWrite,
                                        read: item.read,
                                        ret: tmpWrite
                                    });
                                    
                                    if (item.rule.vars.length > 0) {
                                        varIndex++;
                                    }
                                }
                                else {
                                    itemPop (chart, false, item.ret, item.wvars);
                                }
                                */
                            }
                        }
                    }
                }
                
                return chart[0].succ
                    ? (bot && bot !== true ? bot : chart[0].ret) //chart[0].ret//*/ Ruler.substVars (allVars, chart[0].ret)
                    : ["FAILURE", chart[0].path];
            }

            var getVars = function (vars) {
                var ret = [];
                for (var i = 0; i < vars.length; i++) {
                    ret[vars[i]] = null;
                }
                
                return ret;
            }
            /*
            var setVarIndex = function (vars, varIndex) {
                var ret = [];
                for (var i in vars) {
                    ret[i + "[" + varIndex + "]"] = vars[i];
                }
                
                return ret;
            }
            */
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

            
            var cloneVars = function (vars) {
                var ret = [];
                if (Array.isArray (vars)) {
	                for (var i in vars) {
                    	ret[i] = vars[i];
                    }
                }
                
                return ret;
            }
            
            /*
            var substVars = function (vars, arr, varIndex) {
                if (!vars) {
                    return arr;
                }
                else {
                    var ret;
                    if (Array.isArray (arr)) {
                        ret = [];
                        for (var i = 0; i < arr.length; i++) {
                            ret.push (substVars (vars, arr[i], varIndex));
                        }
                    } else {
                        if (vars[arr] === null) {
                            ret = arr + (varIndex !== undefined ? "[" + varIndex + "]" : "");
                        }
                        else if (vars[arr]) {
                            ret = vars[arr];
                        }
                        else {
                            ret = arr;
                        }
                    }
                    
                    return ret;
                }
            }
            */
            
            var arrayMatch = function (s1, s2, checkTrue) {
                if (Array.isArray (s1) && Array.isArray (s2)) {
                    if (s1.length === s2.length) {
                        var succ = true;
                        for (var i = 0; i < s1.length; i++) {
                            if (!arrayMatch (s1[i], s2[i], checkTrue)) {
                                succ = false;
                                break;
                            }
                        }
                        
                        return succ;
                    }
                }
                else {
                    return (checkTrue ? s1 === true : false) || s1 === s2;
                }
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
            
            return (ret[0] !== "FAILURE" ? {output: ret} : {err: {indexes: ret[1]}});
        }
        
        return {
            rewrite: rewrite
        }
    }) ()
);

                                        /*
                                        if (Array.isArray (item.write)) {
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
                                        */

                    /*
                    else if (item.state === "array") {
                        if (item.succ === undefined && arrayMatch (item.write, item.read, true)) {
                            itemPop (chart, true, item.write, item.wvars);
                        }
                        else if (item.succ === false) {
                            if (!item.fst) {
                                item.fst = true;
                                item.wholeRet = true;
                                chart.push ({
                                    state: "proofSeq",
                                    ruleIndex: -1,
                                    wvars: item.wvars,
                                    rvars: item.rvars,
                                    write: item.write,
                                    read: item.read,
                                    ret: item.write
                                });
                            }
                            else {
                                itemPop (chart, item.read === true, item.ret, item.wvars);
                            }
                        }
                        else {
                            if (item.fst) {
                                itemPop (chart, true, item.ret, item.wvars);
                            }
                            else {
                                if (item.arrayIndex === -1) {
                                    item.ret = [];
                                }
                                
                                if (item.arrayIndex < item.write.length - 1) {
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
                                else {
                                    if (item.read === true) {
                                        item.fst = true;
                                        item.wholeRet = true;
                                        chart.push ({
                                            state: "proofSeq",
                                            ruleIndex: -1,
                                            wvars: item.wvars,
                                            rvars: item.rvars,
                                            write: item.ret,
                                            read: item.read,
                                            ret: item.ret
                                        });
                                    }
                                    else {
                                        itemPop (chart, true, item.ret, item.wvars);
                                    }
                                }
                            }
                        }
                    }
                    */
                    /*
                    else if (item.state === "atom") {
                        if (item.write === item.read) {
                            itemPop (chart, true, item.write, item.wvars);
                        }
                        else if (item.succ === true) {
                            itemPop (chart, true, item.ret, item.wvars);
                        }
                        else if (item.succ === false) {
                            itemPop (chart, item.read === true, item.ret, item.wvars);
                        }
                        else {
                            chart.push ({
                                state: "proofSeq",
                                ruleIndex: -1,
                                wvars: item.wvars,
                                rvars: item.rvars,
                                write: item.write,
                                read: item.read,
                                ret: item.write
                            });
                        }
                    }
                    */

