// reasoner.js
// (c) contrast zone, 2023
// MIT License

var Reasoner = (
    function (obj) {
        return {
            parse: obj.parse,
            rewrite: obj.rewrite
        };
    }
) (
    (function () {
        "use strict";
        
        var parse = function (text) {
            var ret;
            
            ret = parseSExpr (text, 0);

            if (ret.err)
                return ret;
            
            else if (ret.pos === text.length)
                return ret.arr;
            
            else
                return {err: "Expected end of file", pos: ret.pos};
        }
        
        var parseSExpr = function (text, pos) {
            var skipWhitespace = function (text, i) {
                do {
                    var pos = i;
                    
                    while (i < text.length && " \t\n\r".indexOf(text.charAt(i)) > -1)
                        i++;

                    if (text.substr(i, 2) == "//") {
                        for (var j = i + 2; j < text.length && text.charAt(j) !== "\n"; j++);
                        if (j < text.length)
                            i = j + 1;
                        
                        else
                            i = j;

                    } else if (text.substr(i, 2) == "/*") {
                        for (var j = i + 2; j < text.length && text.substr(j, 2) !== "*/"; j++);
                        if (j < text.length)
                            i = j + 2;
                    }
                    
                } while (i > pos);
                
                return i;
            }
            
            var lastToken = pos;
            var arr = [];
            var i = skipWhitespace (text, pos);
                        
            if (text.substr (i, 2) === "/*")
                return {err: "unterminated comment", pos: i};
            
            else if (text.charAt(i) === "(")
                i++;
            
            else
                return {err: "expected '('", pos: i};
            
            do {
                i = skipWhitespace (text, i);
                if (text.substr (i, 2) === "/*")
                    return {err: "unterminated comment", pos: i};
                
                if (text.substr (i, 2) === "*/")
                    return {err: "unexpected end of multiline comment", pos: i};
                
                lastToken = i;
                if (text.charAt (i) === "(") {
                    var ret = parseSExpr (text, i);
                    
                    if (ret.err)
                        return ret;
                    
                    arr.push (ret.arr);
                    i = ret.pos;
                    
                } else if (text.charAt (i) === '"') {
                    do {
                        if (text.charAt (i) === "\\")
                            i += 2;
                        
                        else
                            i++;
                        
                    } while ('"\n'.indexOf (text.charAt (i)) === -1 && i < text.length);
                    
                    if (text.charAt (i) === '"') {
                        try {
                            i++;
                            arr.push (JSON.parse(text.substring (lastToken, i)));
                            
                        } catch {
                            return {err: "bad escaped character in string", pos: lastToken}
                        }
                        
                    } else
                        return {err: "unterminated string", pos: lastToken};
                    
                } else {
                    while ('"() \t\n\r'.indexOf (text.charAt (i)) === -1 && text.substr(i, 2) !== "//" && text.substr(i, 2) !== "/*" && i < text.length)
                        i++;
                    
                    if (i > lastToken)
                        arr.push (text.substring (lastToken, i));

                }

            } while (i > lastToken);
            
            if (text.charAt (i) === ")") {
                i = skipWhitespace (text, i + 1);
                if (text.substr (i, 2) === "/*")
                    return {err: "unterminated comment", pos: i};
                
                else
                    return {pos: i, arr: arr};
                
            } else
                return {err: "expected ')'", pos: i};
        }
        
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
                            var e = [rule[1][j]]
                            if (phase === "FWD")
                                r.read.push (e);
                                
                            else if (phase === "BWD")
                                r.write.push (e);
                        }
                        
                        for (var j = 1; j < rule[2].length; j++) {
                            var e = [rule[2][j]];
                            if (phase === "FWD")
                                r.write.push (e);
                            
                            else if (phase === "BWD")
                                r.read.push (e);
                        }
                        
                        rules.push ({segment: segment, vars: v, rules: [r]});
                    }
                }
                
                return rules;
            }
            
            var getMemoChart = function (write, rec, seg) {
                for (var i = 0; i < memo.length; i++)
                    if (arrayMatch (memo[i].atom, write))
                        break;
                
                if (i === memo.length) {
                    var mc = makeMemoChart (write, rec, seg);
                    memo.push ({atom: write, chart: mc});
                    
                } else
                    var mc = memo[i].chart;
                
                return mc;
            }
            
            var makeMemoChart = function (write, rec, seg) {
                var chart = [];
                chart.push ({write: [write], derivesFrom: null, seg: seg});
                for (var ci = 0; ci < chart.length; ci++) {
                    for (var cj = 0; cj < chart[ci].write.length; cj++) {
                        var w = chart[ci].write[cj];
                        for (var i = 0; i < rules.length; i++) {
                            var v = getVars (rules[i].vars);
                            if (rules[i].rules[0].read.length === 0) {
                                var cond = (w === undefined);//memoMatch ([], w, undefined, [w, rec]);
                            
                            } else {
                                for (var el = 0; el < rules[i].rules[0].read.length; el++) { // do all read sides match?
                                    var cond = memoMatch (v, w, rules[i].rules[0].read[el][0], rec, chart[ci].seg);
                                    if (!cond) {
                                        if (arrayMatch (w, rules[i].rules[0].read[el][0], v))
                                            cond = {a:"0", vars: v, seg: seg, write: w, derivesFrom: undefined};
                                        else
                                            break;
                                    }
                                }
                            }

                            if (cond) { // all read sides match
                                var wa = [];
                                for (var j = 0; j < chart[ci].write.length; j++)
                                    if (w !== chart[ci].write[j])
                                        wa.push (chart[ci].write[j]);

                                for (var j = 0; j < rules[i].rules[0].write.length; j++) {
                                    var vw = substVars (v, rules[i].rules[0].write[j][0]);
                                    for (var k = 0; k < wa.length; k++) // is write[j] in wa?
                                        if (arrayMatch (wa[k], vw))
                                            break;
                                    
                                    if (k === wa.length) // write[j] not in wa
                                        wa.push (vw);
                                }
                                
                                for (var j = 0; j < chart.length; j++) { // is wa in chart?
                                    if (wa.length === chart[j].write.length) {
                                        var elCount = 0;
                                        for (var el1 = 0; el1 < wa.length; el1++) { // is el1 in chart[j]?
                                            for (var el2 = 0; el2 < chart[j].write.length; el2++)
                                                if (arrayMatch (wa[el1], chart[j].write[el2]))
                                                    break;
                                            
                                            if (el2 < chart[j].write.length) // el1 is in chart[j]
                                                elCount++;
                                        }
                                        
                                        if (elCount === wa.length)
                                            break;
                                    }
                                }

                                if (j === chart.length) { // wa not in chart
                                    var tmpcond = cond;
                                    if (tmpcond && tmpcond !== true) {
                                        while (tmpcond.derivesFrom)
                                            tmpcond = tmpcond.derivesFrom;
                                            
                                        tmpcond.derivesFrom = chart[ci].derivesFrom;
                                    
                                    } else
                                        cond = chart[ci].derivesFrom;
                                    
                                    chart.push ({rule: rules[i], vars: v, seg: rules[i].segment, write: wa, derivesFrom: cond});
                                }
                            }
                        }
                    }
                }
                
                return chart;
            }
            
            var memoMatch = function (vars, write, read, rec, seg) {
                var oldVars = saveVars (vars);
                if (isRec (rec, write))
                    return false;
                
                var chart = getMemoChart (write, [write, rec], seg);
                for (var i = 0; i < chart.length; i++)
                    if (chart[i].write.length === 1)
                        for (var j = 0; j < chart[i].write.length; j++)
                        {
                                restoreVars (vars, oldVars);
                            if (arrayMatch (chart[i].write[j], read, vars))
                                return {a:"y",rule: chart[i].rule, vars: chart[i].vars, seg: chart[i].seg, write: /*read*/chart[i].write[j], derivesFrom: chart[i].derivesFrom};
                        }

                var r = read;
                for (var ci = 0; ci < chart.length; ci++) {
                    if (chart[ci].write.length === 1)
                        for (var cj = 0; cj < chart[ci].write.length; cj++) {
                            var w = chart[ci].write[cj];
                            if (w && r && Array.isArray (w) && Array.isArray (r) && w.length === r.length) {
                                restoreVars (vars, oldVars);
                                var ret = {rule: chart[ci].rule, vars: chart[ci].vars, seg: chart[ci].seg, write: [], derivesFrom: chart[ci].derivesFrom};
                                for (var i = 0; i < w.length; i++) { // does each w element match each r element?
                                    var mtch = memoMatch (vars, w[i], r[i], rec, seg);
                                    if (!mtch)
                                        break;
                                    
                                    ret.write.push (mtch.write);
                                }
                                
                                if (i === w.length) // each w element matches each r element
                                    return {a:"z", rule: ret.rule, vars: ret.vars, seg: ret.seg, write: ret.write, derivesFrom: ret.derivesFrom};
                            }
                        }
                }
                
                return false;
            }
            
            var arrayMatch = function (arr1, arr2, vars) {
                if (Array.isArray (arr1) && Array.isArray (arr2)) {
                    if (arr1.length === arr2.length) {
                        for (var i = 0; i < arr1.length; i++)
                            if (!arrayMatch (arr1[i], arr2[i], vars))
                                return false;
                        
                        if (i === arr1.length)
                            return true;
                    }
                    
                } else if (vars && typeof arr2 === 'string'){
                    if (vars[arr2] === null) {
                        vars[arr2] = arr1;
                        return true;
                        
                    } else if (vars[arr2] !== undefined)
                        return arrayMatch (arr1, vars[arr2]);
                    
                    else if (arr1 === arr2)
                        return true;

                } else if (arr1 === arr2) {
                    return true;
                            
                }

                return false;
            }
            
            var getVars = function (vars) {
                if (vars.length > 0) {
                    var v = [];
                    for (var i = 0; i < vars.length; i++)
                        v[vars[i]] = null;
                    
                    return v;
                } else
                    return null;
            }
            
            var saveVars = function (vars) {
                var v = [];
                for (var i in vars)
                    v[i] = vars[i];
                
                return v;
            }
            
            var restoreVars = function (vars, oldVars) {
                for (var i in vars)
                    vars[i] = oldVars[i];
            }
            
            var substVars = function (vars, arr) {
                if (!arr)
                    return null;
                
                else if (!vars)
                    return arr;
                    
                else {
                    var ret;
                    if (Array.isArray (arr)) {
                        ret = [];
                        for (var i = 0; i < arr.length; i++)
                            ret.push (substVars (vars, arr[i]));
                    
                    } else if (vars[arr])
                        ret = vars[arr];
                    
                    else
                        ret = arr;
                    
                    return ret;
                }
            }
            
            var isRec = function (rec, check) {
                var r0 = rec;
                while (r0) {
                    if (/*r0 !== rec &&*/ arrayMatch (r0[0], check))
                        return true;

                    r0 = r0[1];
                }
            }

            var memo = [];
            var ret = null;
            if (rules[0] === "RSYS") {
                if (phase === "FWD")
                    var rules = getRules (rules[1], "FWD", "ITYPE");
                    
                else if (phase === "BWD")
                    var rules = getRules (rules[2], "BWD", "CHAIN").concat (getRules (rules[3], "BWD", "OTYPE"));
                    
                var ret = memoMatch ([], undefined, input, null, phase === "FWD" ? "ITYPE" : "OTYPE");
                if (phase === "BWD")
                    while ((ret.seg === "CHAIN"))
                        ret = ret.derivesFrom;

            } else if (rules[0] === "RULE" || rules[0] === "MATCH") {
                var rules = getRules (["SINGLE_RULE", rules], "FWD", "SINGLE_RULE");
                var vars = getVars(rules[0].vars);
                if (arrayMatch (input, rules[0].rules[0].read[0][0], vars))
                    var ret = {write: substVars (vars, rules[0].rules[0].write[0][0])};
                
                else
                    var ret = false;
            }

            return (ret ? {output: ret.write, rules: rules} : {err: {indexes: [0]}});
        }
        
        return {
            parse: parse,
            rewrite: rewrite
        }
    }) ()
);
