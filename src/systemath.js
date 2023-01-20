// systemath.js
// (c) contrast zone, 2023
// MIT License

var systemath = (
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
            var rules;
            
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
            
            var apply = function (write, read, rec, offset) {
                var isRec = function (rec, offset, check) {
                    var r0 = rec;
                    while (r0){
                        if (r0[0] === offset && r0[1] === check)
                            return true;
                        
                        if (isRec (r0[2], r0[0], r0[1]))
                            return true;
                        
                        r0 = r0[2];
                    }
                }
                
                if (!offset)
                    offset = 0;
                
                if (isRec (rec))
                    return false;
                
                if (match (write, read))
                    return read;
                
                else {
                    for (var i = 0; i < rules.length; i++) {
                        var r = rules[i].rules[0].read[0];
                        if (match (write, r)) {
                            for (var j = 0; j < rules[i].rules[0].write.length; j++) {
                                var w = rules[i].rules[0].write[j];
                                if (apply (w, read, [offset, w, rec], offset))
                                    return read;
                                
                                if (w.length > 1 && w.length === read.length) {
                                    for (var k = 0; k < w.length; k++)
                                        if (!apply (w[k], read[k], [offset + k + 1, w[k], rec], offset + k + 1))
                                            break;
                                    
                                    if (k === w.length)
                                        return read;
                                }
                            }
                        }
                    }

                    return false;
                }
            }
            
            var match = function (write, read) {
                if (Array.isArray (write) && Array.isArray (read) && write.length === read.length) {
                    for (var i = 0; i < write.length; i++)
                        if (!match (write[i], read [i]))
                            return false;
                    
                    return true;
                } else {
                    return write === read;
                }
            }
            
            rules = getRules (rules)

            return apply (undefined, input);
        }
        
        return {
            parse: doParse,
            rewrite: rewrite
        }
    }) ()
);
