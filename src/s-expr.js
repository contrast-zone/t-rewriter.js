// s-expr-parser.js
// (c) contrast zone, 2023
// MIT License

var Parser = (
    function (obj) {
        return {
            parse: obj.parse,
        };
    }
) (
    (function () {
        "use strict";
        
        var parse = function (text) {
            var ret;
            
            ret = parseSExpr (text, 0);

            if (ret.err) {
                return ret;
            }
            else if (ret.pos === text.length) {
                return ret.arr;
            }
            else {
                return {err: "Expected end of file", pos: ret.pos};
            }
        }
        
        var skipWhitespace = function (text, i) {
            do {
                var pos = i;
                
                while (i < text.length && " \t\n\r".indexOf(text.charAt(i)) > -1) {
                    i++;
                }

                if (text.substr(i, 2) == "//") {
                    for (var j = i + 2; j < text.length && text.charAt(j) !== "\n"; j++);
                    if (j < text.length) {
                        i = j + 1;
                    }
                    else {
                        i = j;
                    }
                }
                else if (text.substr(i, 2) == "/*") {
                    for (var j = i + 2; j < text.length && text.substr(j, 2) !== "*/"; j++);
                    if (j < text.length) {
                        i = j + 2;
                    }
                }
                
            }
            while (i > pos);
            
            return i;
        }
        
        var parseSExpr = function (text, pos) {
            var lastToken = pos;
            var arr = [];
            var i = skipWhitespace (text, pos);
                        
            if (text.substr (i, 2) === "/*") {
                return {err: "unterminated comment", pos: i};
            }
            else if (text.charAt(i) === "(") {
                i++;
            }
            else {
                return {err: "expected '('", pos: i};
            }
            
            do {
                i = skipWhitespace (text, i);
                if (text.substr (i, 2) === "/*") {
                    return {err: "unterminated comment", pos: i};
                }
                
                if (text.substr (i, 2) === "*/") {
                    return {err: "unexpected end of multiline comment", pos: i};
                }
                
                lastToken = i;
                if (text.charAt (i) === "(") {
                    var ret = parseSExpr (text, i);
                    
                    if (ret.err) {
                        return ret;
                    }
                    
                    arr.push (ret.arr);
                    i = ret.pos;
                    
                }
                else if (text.charAt (i) === '"') {
                    do {
                        if (text.charAt (i) === "\\") {
                            i += 2;
                        }
                        else {
                            i++;
                        }
                    }
                    while ('"\n'.indexOf (text.charAt (i)) === -1 && i < text.length);
                    
                    if (text.charAt (i) === '"') {
                        try {
                            i++;
                            arr.push (JSON.parse(text.substring (lastToken, i)));
                            
                        }
                        catch {
                            return {err: "bad escaped character in string", pos: lastToken}
                        }
                        
                    }
                    else {
                        return {err: "unterminated string", pos: lastToken};
                    }
                }
                else {
                    while ('"() \t\n\r'.indexOf (text.charAt (i)) === -1 && text.substr(i, 2) !== "//" && text.substr(i, 2) !== "/*" && i < text.length) {
                        i++;
                    }
                    
                    if (i > lastToken) {
                        arr.push (text.substring (lastToken, i));
                    }
                }
            }
            while (i > lastToken);
            
            if (text.charAt (i) === ")") {
                i = skipWhitespace (text, i + 1);
                if (text.substr (i, 2) === "/*") {
                    return {err: "unterminated comment", pos: i};
                }
                else {
                    return {pos: i, arr: arr};
                }
            }
            else {
                return {err: "expected ')'", pos: i};
            }
        }
                
        return {
            parse: parse,
        }
    }) ()
);

