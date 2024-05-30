// s-expr.js
// (c) contrast zone, 2024
// MIT License

var SExpr = (
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
            
            ret = parseList (text, 0);

            if (ret.err === "expected '('") {
                ret = parseAtom (text, 0);
                if (!ret.val && !ret.err) {
                    ret = {pos: ret.pos, err: "expected content"};
                }
            }
            
            if (ret.err) {
                return ret;
            }
            else if (ret.pos === text.length) {
                return ret.val;
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
        
        var parseAtom = function (text, pos) {
            var i, lastToken, ret;
            
            i = skipWhitespace (text, pos);
            
            if (text.substr (i, 2) === "/*") {
                return {err: "unterminated comment", pos: i};
            } else if (text.substr (i, 2) === "*/") {
                return {err: "unexpected end of multiline comment", pos: i};
            }
            
            lastToken = i;
            if (text.charAt (i) === '"') {
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
                        ret = JSON.parse(text.substring (lastToken, i));
                        
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
                while ('"()[]{} \t\n\r'.indexOf (text.charAt (i)) === -1 && text.substr(i, 2) !== "//" && text.substr(i, 2) !== "/*" && i < text.length) {
                    i++;
                }
                
                if (i > lastToken) {
                    ret = text.substring (lastToken, i);
                }
            }
            
            i = skipWhitespace (text, i);
            if (text.substr (i, 2) === "/*") {
                return {err: "unterminated comment", pos: i};
            } else if (text.substr (i, 2) === "*/") {
                return {err: "unexpected end of multiline comment", pos: i};
            }
            else {
                return {pos: i, val: ret};
            }
        }
        
        var parseList = function (text, pos) {
            var lastToken;
            var listType;
            var arr = [];
            var i = skipWhitespace (text, pos);
            
            if (pos === text.length) {
                return {err: "unexpected end of file", pos: pos};
            }
            else if (text.substr (i, 2) === "/*") {
                return {err: "unterminated comment", pos: i};
            }
            else if (text.substr (i, 2) === "*/") {
                return {err: "unexpected end of multiline comment", pos: i};
            }
            else if ('([{'.indexOf (text.charAt (i)) > -1) {
                listType = '([{'.indexOf (text.charAt (i));
                arr.push (text.charAt (i));
                i++;
            }
            else {
                return {pos: i, err: "expected one of the following: '(', `[`, `{`"};
            }
            
            do {
                lastToken = i;

                var ret1 = parseList (text, i);
                if (ret1.err && ret1.err.substr(0, "expected".length) === "expected") {
                    var ret2 = parseAtom (text, i);
                    if (ret2.err) {
                        return ret2;
                    }
                    
                    if (ret2.val) {
                        arr.push (ret2.val);
                    }
                    
                    i = ret2.pos;
                }
                else if (ret1.err){
                    return ret1;
                }
                else {
                    arr.push (ret1.val);
                    i = ret1.pos;
                }
            }
            while (i > lastToken);
            
            if (')]}'.indexOf (text.charAt (i)) === listType) {
                arr.push (')]}'.charAt (listType));
                i = skipWhitespace (text, i + 1);
                if (text.substr (i, 2) === "/*") {
                    return {err: "unterminated comment", pos: i};
                } else if (text.substr (i, 2) === "*/") {
                    return {err: "unexpected end of multiline comment", pos: i};
                }
                else {
                    return {pos: i, val: arr};
                }
            }
            else {
                return {err: "unterminated parenthesis, expected '" + ')]}'.charAt (listType) + "'", pos: i};
            }
        }
                
        return {
            parse: parse,
        }
    }) ()
);

