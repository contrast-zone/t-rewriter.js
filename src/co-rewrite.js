// co-rewrite.js
// (c) contrast zone, 2023
// MIT License

var coRewrite = (
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
        
        var rewrite = function (rules, input, segment) {
            var getRules = function (arr) {
                var rules = [];
                
                if (arr[0] === "READ" || arr[0] === "CHAIN" || arr[0] === "WRITE")
                    for(var i = 1; i < arr.length; i++) {
                        var rule = arr[i]
                        if (rule[0] === "RULE" || rule[0] === "EQUAL") {
                            var r = {read: [], write: [], segment: null};
                            for (var j = 1; j < rule[1].length; j++)
                                if (rule[1][0] === "READ")
                                    r.read.push (rule[1][j]);
                                
                                else if (rule[1][0] === "WRITE")
                                    r.write.push (rule[1][j]);
                                
                                else
                                    r.write.push (rule[1][j]);
                                
                            for (var j = 1; j < rule[2].length; j++)
                                if (rule[2][0] === "WRITE")
                                    r.write.push (rule[2][j]);
                                
                                else if (rule[2][0] === "READ")
                                    r.read.push (rule[2][j]);
                                
                                else
                                    r.read.push (rule[2][j]);
                                
                            rules.push ({segment: arr[0], rules: [r]});
                            
                        } else if (arr[0] === "READ" || arr[0] === "WRITE")
                            rules.push ({segment: arr[0], rules: [{read: [], write: [rule]}]});
                    }
                
                return rules;
            }
            
            var makeMemoChart = function (write, rec) {
                var chart = [];
                chart.push ({write: write, derivesFrom: undefined});
                for (var ci = 0; ci < chart.length; ci++) {
                    var w = chart[ci].write;
                    for (var i = 0; i < rules.length; i++) {
                        if (rules[i].rules[0].read.length === 0) {
                            var cond = matchIn (w, undefined, [w, rec]);
                        
                        } else {
                            for (var el = 0; el < rules[i].rules[0].read.length; el++) {
                                var cond = matchIn (w, rules[i].rules[0].read[el], [w, rec]);
                                if (!cond)
                                    break;
                            }
                        }

                        if (cond) {
                            for (var j = 0; j < rules[i].rules[0].write.length; j++) {
                                for (var k = 0; k < chart.length; k++)
                                    if (chart[k].write === rules[i].rules[0].write[j])
                                        break;
                                
                                if (k === chart.length)
                                    chart.push ({write: rules[i].rules[0].write[j], derivesFrom: cond});
                            }
                        }
                    }
                }
                            
                return chart;
            }
            
            var getMemo = function (write, rec) {
                for (var i = 0; i < memo.length; i++) {
                    if (memo[i][0] === write)
                        break;
                }
                
                if (i === memo.length) {
                    var mc = makeMemoChart (write, rec);
                    memo.push ([write, mc]);
                    
                } else
                    var mc = memo[i][1];
                
                return mc;
            }
            
            var matchIn = function (write, read, rec) {
                if (arrayMatch (write, read))
                    return [write, null];
                
                if (isRec (rec, write))
                    return false;
                
                var mc = getMemo (write, rec);
                for (var i = 0; i < mc.length; i++)
                    if (arrayMatch (mc[i].write, read)) {
                        var tmp = [mc[i].write, mc[i].derivesFrom];
                        while (isChain (tmp[0]))
                            tmp = tmp[1];
                        
                        return tmp;
                    }

                var chart = mc;
                var r = read;
                for (var ci = 0; ci < chart.length; ci++) {
                    var w = chart[ci].write;
                    if (Array.isArray (w) && Array.isArray (r)) {
                        var ret = []
                        for (var j = 0; j < w.length && j < r.length; j++) {
                            var mtch = matchIn (w[j], r[j], null);
                            if (!mtch)
                                break;
                            
                            ret.push (mtch[0]);
                        }
                        
                        if (j === w.length && j === r.length)
                            return [ret, null];
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
            
            var isChain = function (item) {
                fst: for (var i = 0; i < rules.length; i++)
                    for (var j = 0; j < rules[i].rules[0].write.length; j++)
                        if (rules[i].rules[0].write[j] === item && rules[i].segment === "CHAIN")
                            break fst;
                
                return i < rules.length;
            }
            
            var isRec = function (rec, check) {
                var r0 = rec;
                while (r0) {
                    if (r0 !== rec && arrayMatch (r0[0], check))
                        return true;

                    r0 = r0[1];
                }
            }
            
            var getChainRules = function (rules) {
                var newRules = [];
                for (var i = 0; i < rules.length; i++) {
                    var rule = rules[i].rules[0];
                    for (var j = 0; j < rule.write.length; j++)
                        newRules.push ({segment: rules[i].segment, rules: [{read: rule.read, write: [rule.write[j]]}]});
                }
                
                return newRules;
            }
            
            if (segment === "READ") {
                var rules = getRules (rules[1]);
                
            } else if (segment === "WRITE") {
                if (rules[2][0] === "CHAIN")
                    var rules = getChainRules (getRules (rules[2])).concat (getRules (rules[3]));
                
                else if (rules[2][0] === "WRITE")
                    return {output: ["unable to find chain segment"], rules: getRules (rules[2])};
            
            } else
                var rules = [];
                
            var memo = [];
            var ret = matchIn (undefined, input, null)[0];
            return (ret ? {output: ret, rules: rules} : {err: {indexes: [0]}});
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
