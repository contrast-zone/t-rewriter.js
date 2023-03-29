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
                    if (rule[0] === "FORE" || rule[0] === "BACK") {
                        var r = {read: [], write: []};
                        for (var j = 1; j < rule[1].length; j++) {
                            var e = [rule[1][j]]
                            if (phase === "FORE")
                                r.read.push (e);
                                
                            else if (phase === "BACK")
                                r.write.push (e);
                        }
                        
                        for (var j = 1; j < rule[2].length; j++) {
                            var e = [rule[2][j]];
                            if (phase === "FORE")
                                r.write.push (e);
                            
                            else if (phase === "BACK")
                                r.read.push (e);
                        }
                        
                        rules.push ({segment: segment, rules: [r]});
                        
                    } else if (rule[0] === "CON" || rule[0] === "DIS") {
                        var r = {read: [], write: []};
                        for (var j = 1; j < rule.length; j++)
                            r.write.push ([rule[j]]);
                            
                        rules.push ({segment: segment, rules: [r]});
                    }
                }
                
                return rules;
            }
            
            var makeMemoChart = function (write, rec) {
                var chart = [];
                chart.push ({write: [write], derivesFrom: null});
                for (var ci = 0; ci < chart.length; ci++) {
                    for (var cj = 0; cj < chart[ci].write.length; cj++) {
                        var w = chart[ci].write[cj];
                        for (var i = 0; i < rules.length; i++) {
                            if (rules[i].rules[0].read.length === 0) {
                                var cond = memoMatch (w, undefined, [w, rec]);
                            
                            } else {
                                for (var el = 0; el < rules[i].rules[0].read.length; el++) {
                                    var cond = memoMatch (w, rules[i].rules[0].read[el][0], [w, rec]);
                                    if (!cond)
                                        break;
                                }
                            }

                            if (cond) {
                                var wa = [];
                                for (var j = 0; j < chart[ci].write.length; j++)
                                    if (cj !== j)
                                        wa.push (chart[ci].write[j])

                                for (var j = 0; j < rules[i].rules[0].write.length; j++) {
                                    for (var k = 0; k < wa.length; k++)
                                        if (arrayMatch (wa[k], rules[i].rules[0].write[j][0]))
                                            break;
                                    
                                    if (k === wa.length)
                                        wa.push (rules[i].rules[0].write[j][0]);
                                }
                                
                                for (var j = 0; j < chart.length; j++) {
                                    if (wa.length === chart[j].write.length) {
                                        var elCount = 0;
                                        for (var el1 = 0; el1 < wa.length; el1++) {
                                            for (var el2 = 0; el2 < chart[j].write.length; el2++)
                                                if (arrayMatch (wa[el1], chart[j].write[el2]))
                                                    break;
                                            
                                            if (el2 < chart[j].write.length)
                                                elCount++;
                                        }
                                        
                                        if (elCount === wa.length)
                                            break;
                                    }
                                }
                                        
                                //if (j === chart.length)
                                //    chart.push ({write: wa, derivesFrom: [cond, chart[ci].derivesFrom]});
                                if (j === chart.length) {
                                    var tmpcond = cond;
                                    while (tmpcond[1])
                                        tmpcond = tmpcond[1];
                                    
                                    tmpcond[1] = chart[ci].derivesFrom;
                                    chart.push ({write: wa, derivesFrom: cond});
                                }
                            }
                        }
                    }
                }
                
                return chart;
            }
            
            var getMemoChart = function (write, rec) {
                for (var i = 0; i < memo.length; i++)
                    if (arrayMatch (memo[i].atom, write))
                        break;
                
                if (i === memo.length) {
                    var mc = makeMemoChart (write, rec);
                    memo.push ({atom: write, chart: mc});
                    
                } else
                    var mc = memo[i].chart;
                
                return mc;
            }
            
            var memoMatch = function (write, read, rec) {
                if (arrayMatch (write, read))
                    //return [write, null];
                    return [write];
                
                if (isRec (rec, write))
                    return false;
                
                var mc = getMemoChart (write, rec);
                for (var i = 0; i < mc.length; i++)
                    if (mc[i].write.length === 1)
                        for (var j = 0; j < mc[i].write.length; j++)
                            if (arrayMatch (mc[i].write[j], read))
                                return [mc[i].write[j], mc[i].derivesFrom];
                                //return mc[i].write[j];

                var chart = mc;
                var r = read;
                for (var ci = 0; ci < chart.length; ci++) {
                    if (chart[ci].write.length === 1)
                        for (var cj = 0; cj < chart[ci].write.length; cj++) {
                            var w = chart[ci].write[cj];
                            if (w && r && Array.isArray (w) && Array.isArray (r)) {
                                var ret = []
                                for (var i = 0; i < w.length && i < r.length; i++) {
                                    var mtch = memoMatch (w[i], r[i], null);
                                    if (!mtch)
                                        break;
                                    
                                    ret.push (mtch[0]);
                                }
                                
                                if (i === w.length && i === r.length)
                                    //return [ret, null];
                                    return [ret];
                            }
                        }
                }
                
                return false;
            }
            
            var arrayMatch = function (arr1, arr2) {
                if (Array.isArray (arr1) && Array.isArray (arr2)) {
                    if (arr1.length === arr2.length) {
                        for (var i = 0; i < arr1.length; i++)
                            if (!arrayMatch (arr1[i], arr2[i]))
                                return false;
                        
                        if (i === arr1.length)
                            return true;
                    }
                    
                } else if (arr1 === arr2)
                    return true;

                return false;
            }
            
            var isRec = function (rec, check) {
                var r0 = rec;
                while (r0) {
                    if (r0 !== rec && arrayMatch (r0[0], check))
                        return true;

                    r0 = r0[1];
                }
            }
            
            var isChain = function (item) {
                for (var i = 0; i < rules.length; i++)
                    for (var j = 0; j < rules[i].rules[0].write.length; j++)
                        if (rules[i].rules[0].write[j][0] === item && rules[i].segment === "CHAIN")
                            return true;
                
                return false;
            }
            
            if (rules.length === 4) {
                if (phase === "FORE")
                    var rules = getRules (rules[1], "FORE", "READ");
                    
                else if (phase === "BACK")
                    var rules = getRules (rules[2], "BACK", "CHAIN").concat (getRules (rules[3], "BACK", "WRITE"));
                    
            } else
                return {output: ["incorrect number of segments"], rules: []};
            
            var memo = [];
            var ret = memoMatch (undefined, input, null);
            if (phase === "BACK") {
                while (isChain (ret[0]))
                    ret = ret[1];
            }
            return (ret ? {output: ret[0], rules: rules} : {err: {indexes: [0]}});
            //return (ret ? {output: ret, rules: rules} : {err: {indexes: [0]}});
        }
        
        return {
            parse: parse,
            rewrite: rewrite
        }
    }) ()
);

/*
            var invertRules = function (rules) {
                var join = function (rules) {
                    var rules1 = [];
                    for (var i = 0; i < rules.length; i++) {
                        var rule = rules[i].rules[0];
                        for (var j = 0; j < rules1.length; j++) {
                            var rule1 = rules1[j].rules[0];
                            if (equals (rule.read, rule1.read, arrayMatch)) {
                                if (!contains (rule1.write, rule.write, function (a, b) {return equals (a, b, arrayMatch);}))
                                    rule1.write.push (rule.write);
                                    
                                break;
                            }
                        }
                        
                        if (j === rules1.length)
                            rules1.push ({rules: [{read: rule.read, write: [rule.write]}]});
                    }
                    
                    var rules2 = [];
                    for (var i = 0; i < rules1.length; i++) {
                        var rule1 = rules1[i].rules[0];
                        for (var j = 0; j < rules2.length; j++) {
                            var rule2 = rules2[j].rules[0];
                            if (equals (rule1.write, rule2.write, function (a, b) {return equals (a, b, arrayMatch);})) {
                                if (!contains (rule2.read, rule1.read, function (a, b) {return equals (a, b, arrayMatch);}))
                                    rule2.read.push (rule1.read);
                                    
                                break;
                            }
                        }
                        
                        if (j === rules2.length)
                            rules2.push ({rules: [{read: [rule1.read], write: rule1.write}]});
                    }
                    
                    return rules2;
                }

                var equals = function (arr1, arr2, callBack) {
                    for (var i = 0; i < arr1.length; i++) {
                        for (var j = 0; j < arr2.length; j++)
                            if (callBack (arr1[i], arr2[j]))
                                break;
                        
                        if (j === arr2.length)
                            return false;
                    }
                    
                    return (arr1.length === arr2.length);
                }
                
                var contains = function (arr, elem, callBack) {
                    for (var i = 0; i < arr.length; i++)
                        if (callBack (arr[i], elem))
                            break;
                    
                    return (i < arr.length);
                }
                
                var split = function (rules) {
                    var rules1 = [];
                    for (var i = 0; i < rules.length; i++) {
                        var rule = rules[i].rules[0];
                        var read = [], write = [];
                        cartesianProduct (rule.read, function (item) {read.push (item);});
                        cartesianProduct (rule.write, function (item) {write.push (item);});
                        for (var x = 0; x < read.length; x++)
                            for (var y = 0; y < write.length; y++)
                                rules1.push ({rules: [{read: read[x], write: write[y]}]})
                    }
                    
                    return rules1;
                }
                
                var cartesianProduct = function (arr, callBack, rec, item) {
                    if (!rec)
                        rec = 0;
                        
                    if (!item)
                        item = [];
                        
                    if (rec < arr.length) {
                        for (var i = 0; i < arr[rec].length; i++)
                            cartesianProduct (arr, callBack, rec + 1, item.concat ([arr[rec][i]]));
                        
                    } else
                        callBack (item);
                }
                
                return split (join (rules));
            }
            
*/
