// rewriter.js
// (c) contrast zone, 2024
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
            var checkRules = function (rules) {
                var syntax = 
                /*
                `
                    (
                        CHAIN
                        (RULE (READ) (WRITE (CHAIN [_expressions])))
                        (RULE (READ) (WRITE [_expression]         ))
                        
                        (RULE (READ [_expressions]) (WRITE ([_expression] [_expressions])                            ))
                        (RULE (READ [_expressions]) (WRITE ([_expression] NIL)                                       ))
                        (RULE (READ [_expression] ) (WRITE [_binding]                                                ))
                        (RULE (READ [_expression] ) (WRITE [_rule]                                                   ))
                        (RULE (READ [_binding]    ) (WRITE (MATCH ((VAR [_atoms]) ([_rule] NIL)))                    ))
                        (RULE (READ [_atoms]      ) (WRITE (<ATOMIC> [_atoms])                                       ))
                        (RULE (READ [_atoms]      ) (WRITE (<ATOMIC> NIL)                                            ))
                        (RULE (READ [_rule]       ) (WRITE (RULE ((READ (<COMPOUND> NIL)) ((WRITE (<ANY> NIL)) NIL)))))
                    )
                `
                */
                `
                    (
                        CHAIN
                        (RULE (READ) (WRITE [_expression]                                                                         ))
                        (RULE (READ) (WRITE (CHAIN [_expressions])                                                                ))
                        (RULE (READ) (WRITE (RULE ((READ [_rexpressions]) ((WRITE [_wexpressions]) NIL)))                         ))
                        (RULE (READ) (WRITE (RULE ((READ [_rexpressions]) ((CHAIN [_expressions]) ((WRITE [_wexpressions]) NIL))))))
                        
                        (RULE (READ [_expressions]) (WRITE ([_expression] [_expressions])                            ))
                        (RULE (READ [_expressions]) (WRITE ([_expression] NIL)                                       ))
                        (RULE (READ [_expression] ) (WRITE [_binding]                                                ))
                        (RULE (READ [_expression] ) (WRITE [_rule]                                                   ))
                        (RULE (READ [_binding]    ) (WRITE (MATCH ((VAR [_atoms]) ([_rule] NIL)))                    ))
                        (RULE (READ [_atoms]      ) (WRITE (<ATOMIC> [_atoms])                                       ))
                        (RULE (READ [_atoms]      ) (WRITE (<ATOMIC> NIL)                                            ))
                        (RULE (READ [_rule]       ) (WRITE (RULE ((READ (<COMPOUND> NIL)) ((WRITE (<ANY> NIL)) NIL)))))

                        (RULE (READ [_rexpressions]) (WRITE ([_rexpression] [_rexpressions])                          ))
                        (RULE (READ [_rexpressions]) (WRITE ([_rexpression] NIL)                                      ))
                        (RULE (READ [_rexpression] ) (WRITE [_rbinding]                                               ))
                        (RULE (READ [_rexpression] ) (WRITE [_rrule]                                                  ))
                        (RULE (READ [_rbinding]    ) (WRITE (MATCH ((VAR [_ratoms]) ([_rrule] NIL)))                  ))
                        (RULE (READ [_ratoms]      ) (WRITE (<ATOMIC> [_ratoms])                                      ))
                        (RULE (READ [_ratoms]      ) (WRITE (<ATOMIC> NIL)                                            ))
                        (RULE (READ [_rrule]       ) (WRITE (RULE ((READ (<COMPOUND> NIL)) ((WRITE (<ANY> NIL)) NIL)))))
                        (RULE (READ [_rrule]       ) (WRITE (RULE ((READ NIL) ((WRITE (<ANY> NIL)) NIL)))             ))

                        (RULE (READ [_wexpressions]) (WRITE ([_wexpression] [_wexpressions])                          ))
                        (RULE (READ [_wexpressions]) (WRITE ([_wexpression] NIL)                                      ))
                        (RULE (READ [_wexpression] ) (WRITE [_wbinding]                                               ))
                        (RULE (READ [_wexpression] ) (WRITE [_wrule]                                                  ))
                        (RULE (READ [_wbinding]    ) (WRITE (MATCH ((VAR [_watoms]) ([_wrule] NIL)))                  ))
                        (RULE (READ [_watoms]      ) (WRITE (<ATOMIC> [_watoms])                                      ))
                        (RULE (READ [_watoms]      ) (WRITE (<ATOMIC> NIL)                                            ))
                        (RULE (READ [_wrule]       ) (WRITE (RULE ((READ (<ANY> NIL)) ((WRITE (<COMPOUND> NIL)) NIL)))))
                        (RULE (READ [_wrule]       ) (WRITE (RULE ((READ (<ANY> NIL)) ((WRITE NIL) NIL)))             ))
                    )
                `
                var syntaxRules = getRules (SExpr.parse (syntax), "FWD");
                var expression = SExpr.normalize (SExpr.parse (rules));
                var ret = prove (syntaxRules, undefined, expression);
                                
                return ret;
            }
            
            var getRules = function (arr, phase) {
                var rules = [];
                for(var i = 2; i < arr.length - 1; i++) {
                    var rule = arr[i]

                    var v = [];
                    if (rule[1] === "MATCH") {
                        for (var j = 2; j < rule[2].length - 1; j++) {
                            v.push (rule[2][j]);
                        }
                        
                        rule = rule[3];
                    }
                    
                    if (rule[1] === "RULE") {
                        var r = {read: [], write: []};
                        for (var j = 2; j < rule[2].length - 1; j++) {
                            if (phase === "FWD") {
                                r.read.push (rule[2][j]);
                            }
                            else if (phase === "BWD") {
                                r.write.push (rule[2][j]);
                            }
                        }
                        
                        for (var j = 2; j < rule[3].length - 1; j++) {
                            if (phase === "FWD") {
                                r.write.push (rule[3][j]);
                            }
                            else if (phase === "BWD") {
                                r.read.push (rule[3][j]);
                            }
                        }
                        
                        rules.push ({vars: v, rule: r});
                    }
                }
                
                return rules;
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
                        var existsF = memoGet (item.succ, false, item.write, item.read, item.wvars);
                        var existsT = memoGet (item.succ, true, item.write, item.read, item.wvars, item.ret);
                        if (item.succ === undefined && existsF) {
                            itemPop (chart, false, item.ret, item.wvars);
                        }
                        else if (item.succ === undefined && existsT) {
                            itemPop (chart, true, existsT.ret, item.wvars);
                        }
                    }
                    
                    var item = chart[chart.length - 1];
                    if (item.state === "cycle") {
                        if (item.read === false) {
                            itemPop (chart, false, item.ret, item.wvars);
                        }
                        else if (item.succ === false) {
                            itemPop (chart, false, item.ret, item.wvars);
                        }
                        else if (item.succ === true) {
                            itemPop (chart, true, item.ret, item.wvars);
                        }
                        else {
                            if (item.wvars[item.rvars[item.read]] === null) {
                                //item.wvars[item.rvars[item.read]] === item.ret; // messes with memoF
                                itemPop (chart, true, item.ret, item.wvars);
                            }
                            else if (item.rvars[item.read] === null) {
                                //item.rvars[item.read] = item.ret;  // messes with memoF
                                itemPop (chart, true, item.ret, item.wvars);
                            }
                            else if (item.rvars[item.read] !== undefined && arrayMatch (item.ret, item.rvars[item.read], true)) {
                                itemPop (chart, true, item.ret, item.wvars, true);
                            }
                            else if (item.wvars[item.ret] === null && item.read !== false) {
                                //item.wvars[item.ret] = item.read;  // messes with memoF
                                itemPop (chart, true, item.ret, item.wvars);
                            }
                            else if (item.wvars[item.ret] !== undefined && (item.wvars[item.ret] === true || arrayMatch (item.wvars[item.ret], item.read, true))) {
                                itemPop (chart, true, item.ret, item.wvars, true);
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
                                    chart.push ({
                                        state: (Array.isArray (item.write) || item.write === undefined ? "pbulk" : "atomPhase"),
                                        phase: (Array.isArray (item.write) ? "arrayPhase" : "atomPhase"),
                                        wvars: item.wvars,
                                        rvars: item.rvars,
                                        write: item.write,
                                        read: item.read,
                                        ret: item.write
                                    });
                                }
                                else {
                                    itemPop (chart, "infrec", item.ret, item.wvars);
                                }
                            }
                        }
                    }
                    else if (item.state === "pbulk") {
                        if (item.succ === "infrec") {
                            itemPop (chart, item.read === true, item.write, item.wvars);
                        }
                        else if ((item.read === true && item.succ === false) || (item.read !== true && item.succ === true)) {
                            itemPop (chart, true, item.ret, item.wvars);
                        }
                        else if (!item.pstepped && ((item.read === true && item.succ === true) || (item.read !== true && item.succ === false))) {
                            item.pstepped = true;
                            chart.push ({
                                state: "pstep",
                                ruleIndex: -1,
                                wvars: item.wvars,
                                rvars: item.rvars,
                                write: item.ret,
                                read: item.read,
                                ret: item.ret
                            });
                        }
                        else if (item.pstepped) {
                            itemPop (chart, item.read === true, item.ret, item.wvars);
                        }
                        else {
                            chart.push ({
                                state: item.phase,
                                arrayIndex: -1,
                                wvars: item.wvars,
                                rvars: item.rvars,
                                write: item.ret,
                                read: item.read,
                                ret: item.ret
                            });
                        }
                    }
                    else if (item.state === "atomPhase") {
                        if (item.write === "<ATOMIC>") {
                            itemPop (chart, !Array.isArray (item.read) || item.read === true,  item.read === true ? item.ret : item.read, item.wvars);
                        }
                        else if (item.write === "<COMPOUND>") {
                            itemPop (chart, Array.isArray (item.read) || item.read === true, item.read === true ? item.ret : item.read, item.wvars);
                        }
                        else if (item.write === "<ANY>") {
                            itemPop (chart, true, item.read === true ? item.ret : item.read, item.wvars);
                        }
                        else {
                            itemPop (chart, item.ret === item.read || item.read === true, item.ret, item.wvars);
                        }
                    }
                    else if (item.state === "arrayPhase") {
                        if (item.succ === "infrec") {
                            itemPop (chart, item.succ, item.ret, item.wvars);
                        }
                        else if (item.succ === false || (item.read !== true && !(Array.isArray (item.read) && item.write.length === item.read.length))) {
                            itemPop (chart, false, item.write, item.wvars);
                        }
                        else {
                            if (item.arrayIndex === -1) {
                                item.ret = [];
                            }

                            item.arrayIndex++;
                            if (item.arrayIndex < item.write.length) {
                                chart.push ({
                                    state: "cycle",
                                    wvars: item.wvars,
                                    rvars: item.rvars,
                                    write: item.write[item.arrayIndex],
                                    read: (
                                        Array.isArray (item.read)
                                        ? item.read[item.arrayIndex]
                                        : item.read === true
                                    ),
                                    ret: item.write[item.arrayIndex]
                                });
                            }
                            else {
                                itemPop (chart, true, item.ret, item.wvars);
                            }
                        }
                    }
                    else if (item.state === "pstep") {
                        if (item.succ === "infrec") {
                            itemPop (chart, item.succ, item.ret, item.wvars);
                        }
                        else if (item.succ === true) {
                            itemPop (chart, true, item.ret, item.wvars);
                        }
                        else {
                            item.ruleIndex++;
                            if (item.ruleIndex < rules.length) {
                                chart.push ({
                                    state: "pstepPhase",
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
                    else if (item.state === "pstepPhase") {
                        if (item.succ === "infrec") {
                            itemPop (chart, item.succ, item.ret, item.wvars);
                        }
                        else if (item.succ === false || (item.rule.rule.read.length === 0 && item.write !== undefined)) {
                            itemPop (chart, false, item.ret, item.wvars);
                        }
                        else if (item.succ === true && item.readIndex === item.rule.rule.read.length) {
                            itemPop (chart, true, item.ret, item.wvars);
                        }
                        else {
                            item.readIndex++;
                            if (item.readIndex < item.rule.rule.read.length) {
                                var skip = false;
                                
                                // speed optimization begin
                                if (
                                    Array.isArray (item.write) &&
                                    Array.isArray (item.rule.rule.read[item.readIndex])
                                ) {
                                    if (item.write.length !== item.rule.rule.read[item.readIndex].length) {
                                        skip = true;
                                    }
                                    else {
                                        for (var i = 0; i < item.write.length; i++) {
                                            if (
                                                !Array.isArray (item.write[i]) &&
                                                !Array.isArray (item.rule.rule.read[item.readIndex][i]) &&
                                                item.rule.vars.indexOf (item.rule.rule.read[item.readIndex][i]) === -1 &&
                                                (item.wvars[item.write[i]] === undefined && item.write[i] !== item.rule.rule.read[item.readIndex][i])
                                            ) {
                                                skip = true;
                                                break;
                                            };
                                        }
                                    }
                                }
                                // speed optimization end
                                
                                if (skip) {
                                    itemPop (chart, false, item.ret, item.wvars);
                                }
                                else {
                                    chart.push ({
                                        state: "cycle",
                                        wvars: item.wvars,
                                        rvars: item.rvars,
                                        write: item.write,
                                        read: item.rule.rule.read[item.readIndex],
                                        ret: item.write
                                    });
                                }
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
                            }
                        }
                    }
                }
                
                return chart[0].succ
                    ? (bot && bot !== true ? bot : chart[0].ret)
                    : ["FAILURE", chart[0].path];
            }
            
            var memoF, memoT;
            function memoGet (succ, bool, write, read, wvars, ret) {
                var memo = bool ? memoT : memoF;
                if (succ !== !bool /*&& !Array.isArray (write)*/) {
                    for (var i = 0; i < memo.length; i++) {
                        if (
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
            
            var itemPop = function (chart, succ, itret, vars) {
                var olditem = chart[chart.length - 1];
                chart.pop ();
                var item = chart[chart.length - 1];
                item.succ = succ;
                if (item.succ === true) {
                    if (item.state === "arrayPhase" /*&& !item.further*/) {
                        item.ret[item.arrayIndex] = itret;
                    }
                    else {
                        item.ret = itret;
                    }
                    item.wvars = concat (item.wvars, vars);
                }
            }

            var getVars = function (vars) {
                var ret = [];
                for (var i = 0; i < vars.length; i++) {
                    ret[vars[i]] = null;
                }
                
                return ret;
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

            var cloneVars = function (vars) {
                var ret = [];
                if (Array.isArray (vars)) {
	                for (var i in vars) {
                    	ret[i] = vars[i];
                    }
                }
                
                return ret;
            }
            
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
                    if (arr[i][1] === "RULE" || arr[i][1] === "MATCH") {
                        return true;
                    }
                }
                
                return false;
            }
            
            var ret = null;
            var checked = checkRules (rules);
            if (checked[0] === "FAILURE") {
                ret = ["FAILURE"];
                alert ("error reading rules");
            }
            else {
                rules = SExpr.parse (rules);
                input = SExpr.parse (input);
                if (rules[1] === "CHAIN") {
                    var rules1 = getRules (rules, "FWD", "CHAIN");
                    var proof1 = prove (rules1, input, true);
                    var ret = proof1;//extractResult (proof1, "CHAIN");
                }
                else if (rules[1] === "RULE" && rules[2] && rules[2][1] === "READ" && rules[3][1] === "WRITE" && (isMeta (rules[2]) || isMeta (rules[3]))) {
                    var rules0 = getRules (rules[2], "FWD", "READ");
                    var proof0 = prove (rules0, undefined, input);
                    var ret = proof0;//extractResult (proof0, "READ");
                    if (ret[0] !== "FAILURE") {
                        var rules2 = getRules (rules[3], "BWD", "WRITE");
                        var proof2 = prove (rules2, undefined, true);
                        var ret = proof2;//extractResult (proof1, "WRITE");
                    }                
                }
                else if (rules[1] === "RULE" && rules[4] && rules[2][1] === "READ" && rules[3][1] === "CHAIN" && rules[4][1] === "WRITE") {
                    var rules0 = getRules (rules[2], "FWD", "READ");
                    var proof0 = prove (rules0, undefined, input);
                    var ret = proof0;//extractResult (proof0, "READ");
                    if (ret[0] !== "FAILURE") {
                        var rules1 = getRules (rules[3], "FWD", "CHAIN");
                        var proof1 = prove (rules1, input, true);
                        var ret = proof1;//extractResult (proof1, "CHAIN");
                        if (ret[0] !== "FAILURE") {
                            var rules2 = getRules (rules[4], "BWD", "WRITE");
                            var proof2 = prove (rules2, undefined, ret);
                            var ret = proof2;//extractResult (proof2, "WRITE");
                        }
                    }
                }
                else if (rules[1] === "RULE" || rules[1] === "MATCH") {
                    var rules1 = getRules (["(", "SINGLE-RULE", rules, ")"], "FWD", "SINGLE-RULE");
                    var ret = applySingleRule (rules1, input);
                    var proof1 = [input, {branches: [{segment: "SINGLE-RULE", ruleIndex: 0, follows: ret}]}];
                }
                else {
                    ret = ["FAILURE"];
                }
            }
            
            return (ret[0] !== "FAILURE" ? {output: ret} : {err: {indexes: ret[1]}});
        }
        
        return {
            rewrite: rewrite
        }
    }) ()
);

