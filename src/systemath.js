// systemath.js
// (c) contrast zone, 2023
// MIT License

var systemath = (
    function (o) {
        return {
            parse: o.parse,
            rewrite: o.rewrite
        };
    }
) (
    (function () {
        "use strict";
        var startTime, timeout;
        
        var doParse = function (text) {
            var ret;
            
            ret = deepParse (text, 0);

            if (ret.err)
                return ret;
            
            else if (ret.pos === text.length)
                return ret.arr;
            
            else
                return {err: "unexpected characters", pos: ret.pos};
        }
        
        var deepParse = function (text, pos) {
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
                
                lastToken = i;
                if (text.charAt (i) === "(") {
                    var ret = deepParse (text, i);
                    
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
                    while ('"() \t\n\r'.indexOf (text.charAt (i)) === -1 && text.substr(i, 2) !== "//" && i < text.length)
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
        
        var rewrite = function (rules, input) {
            var getRules = function (arr) {
                var rules = [];
                
                for(var i = 1; i < arr[1].length; i++) {
                    var rule = arr[1][i]
                    if (rule[0] === "RULE") {
                        var r = {read: [], write: []};
                        for (var j = 1; j < rule[1].length; j++)
                            r.read.push (rule[1][j]);
                            
                        for (var j = 1; j < rule[2].length; j++)
                            r.write.push (rule[2][j]);
                            
                        rules.push ({rules: [r]});
                        
                    } else
                        rules.push ({rules: [{read: [], write: [rule]}]});
                }
                
                return rules;
            }
            
            var makeMemoChart = function (write) {
                var chart = [];
                chart.push (write);
                for (var cy = 0; cy < chart.length; cy++) {
                    var w = chart[cy];
                    for (var i = 0; i < rules.length; i++) {
                        if (arrayMatch (w, rules[i].rules[0].read[0])) {
                            for (var j = 0; j < rules[i].rules[0].write.length; j++) {
                                var p = rules[i].rules[0].write[j];
                                if (chart.indexOf (p) < 0)
                                    chart.push (p);
                            }
                        }
                    }
                }
                            
                return chart;
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
            
            var matchIn = function (write, read) {                
                if (arrayMatch (write, read)) {
                    return true;
                }
                
                for (var i = 0; i < memo.length; i++) {
                    if (memo[i][0] === write)
                        break;
                }
                
                if (i === memo.length) {
                    var mc = makeMemoChart (write);
                    memo.push ([write, mc]);
                    
                } else {
                    mc = memo[i][1];
                }
                
                for (i = 0; i < mc.length; i++) {
                    if (arrayMatch (mc[i], read)) {
                        return true;
                    }
                }
                
                var chart = mc;
                var r = read;
                chart.push (write);
                for (var cy = 0; cy < chart.length; cy++) {
                    var w = chart[cy];
                    if (Array.isArray (w) && Array.isArray (r)) {
                        for (var j = 0; j < w.length && j < r.length; j++) {
                            if (!matchIn (w[j], r[j]))
                                break;
                        }
                        
                        if (j === w.length && j === r.length)
                            return true;
                    }
                }
                
                return false;
            }
            
            var rules = getRules (rules)
            var memo = [];
            
            return (matchIn (undefined, input) ? input : {err: {indexes: [0]}});
        }
        
        return {
            parse: doParse,
            rewrite: rewrite
        }
    }) ()
);
