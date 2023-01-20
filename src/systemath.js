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
            
            var match = function (write, read, offset, rec) {
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
                
                var compareErr = function (err1, err2) {
                    if (err2.length === 0)
                        return true;
                        
                    for (var i = 0; i < err1.length; i++) {
                        if (err1[i] < err2[i])
                            return false;
                            
                        else if (err1[i] > err2[i])
                            return true;
                    }
                    
                    return false;
                }
                
                var maxerr = {err: {indexes: []}};
                
                if (!offset)
                    offset = 0;
                
                if (isRec (rec))
                    return maxerr;
                
                if (Array.isArray (write) && Array.isArray (read)) {
                    for (var i = 0; i < write.length, i < read.length; i++) {
                        var err = match (write[i], read[i], offset + i + 1, [offset + i + 1, write[i], rec]);
                        if (err.err)
                            return {err: {indexes: [i].concat (err.err.indexes)}};
                    }
                    
                    if (write.length !== read.length)
                        return {err: {indexes: [Math.min(write.length, read.length)]}};

                    return read;
                    
                } else if (write === read)
                    return read;
                
                for (var i = 0; i < rules.length; i++) {
                    var r = rules[i].rules[0].read[0];
                    if (write === r)
                        for (var j = 0; j < rules[i].rules[0].write.length; j++) {
                            var w = rules[i].rules[0].write[j];
                            var err = match (w, read, offset, [offset, w, rec]);
                            if (!err.err)
                                return read;
                            
                            if (compareErr (err.err.indexes, maxerr.err.indexes))
                                maxerr = err;
                        }
                }

                return maxerr;
            }
            
            rules = getRules (rules)

            return match (undefined, input);
        }
        
        return {
            parse: doParse,
            rewrite: rewrite
        }
    }) ()
);
