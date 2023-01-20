var edit = function (node, options) {
    "use strict";
    if (!options)
        options = {
            font: "9pt monospace",
            tabWidth: 4,
            colorText: "rgb(208,208,208)",
            colorTextBack: "black",
            colorSelection: "white",
            colorSelectionBack: "gray",
            colorKeyword: "rgb(104,104,104)",
            colorKeywordBack: "transparent",
            colorBracketMatch: "white",
            colorBracketMatchBack: "rgb(75,75,75)",
            colorStringAndComment: "rgb(104,104,104)",
            keywords: ["\\bRULE\\b|\\bREWRITE\\b|\\bREAD\\b|\\bWRITE\\b|\\bMATCH\\b|\\bVAR\\b"],
            stringsAndComments: "(\"([^\"\\\\\\n]|(\\\\.))*((\")|(\\n)|($)))|(\\/\\/((.*\\n)|(.*$)))|(\\/\\*[\\S\\s]*?((\\*\\/)|$))"
        }

    var ww, hh;
    var rndid = Math.round (Math.random () * 32768);
    var ed = document.getElementById(node);

    ed.innerHTML = 

    `
    <div id="container${rndid}" style="position: relative; width: inherit; height: inherit; overflow: auto;">
      <div id="backdrop${rndid}" style = "z-index: 1; width: inherit; height: inherit; overflow: hidden;">
        <div id="hilights${rndid}" style="wrap: none; font: ${options.font}; white-space: pre; color: ${options.colorText}; background-color: ${options.colorTextBack}; width: inherit; height: inherit; overflow: hidden; margin: 0; padding:5px;">
        </div>
      </div>
      <textarea class="cls${rndid}" id="input${rndid}" spellcheck="false" wrap="off" style="z-index: 0; width: inherit; height: inherit; border-style: none; border-radius: 0; outline: none; resize: none; box-sizing: border-box; display: block; background-color: transparent; color: transparent; caret-color: white; font: ${options.font}; margin: 0; padding:5px; position: absolute; top: 0; left: 0;">
      </textarea>
    </div>
    `

    var input = document.getElementById(`input${rndid}`);
    var hilights = document.getElementById(`hilights${rndid}`);
    var backdrop = document.getElementById(`backdrop${rndid}`);
    var container = document.getElementById(`container${rndid}`);
    
    var style=document.createElement('style');
    style.innerHTML = `
        .cls${rndid}::selection {
            background-color: var(--selbackcolor);
            color: var(--selcolor);
        }
    ` 
    document.head.appendChild(style);
    input.style.setProperty('--selbackcolor', options.colorSelectionBack)
    input.style.setProperty('--selcolor', options.colorSelection)
    
    container.style.width = "inherit";
    container.style.height = "inherit";
    
    function hilightAll() {
        var text = input.value;

        var t = prepareBraces (text, "(", ")");
        if (t.found) {
            text = t.text;
        }
        /* else {
            t = prepareBraces (text, "[", "]");
            if (t.found) {
                text = t.text;
            } else {
                t = prepareBraces (text, "{", "}");
                if (t.found) {
                    text = t.text;
                }
            }
        }
        */
        
        text = text
        .replaceAll(/&/g, '&amp;')
        .replaceAll(/</g, '&lt;')
        .replaceAll(/>/g, '&gt;');

        text = hilightContents (text);

        if (t.found) {
            text = hilightBraces (text, "(", ")");
            //text = hilightBraces (text, "[", "]");
            //text = hilightBraces (text, "{", "}");
        }
        
        // scroll fix
        text = text
        .replace(/\n$/g, '<br/>')
        .replace(/\n/g, '     <br/>');

        text += "     <br/><br/><br/><br/><br/> ";

        hilights.innerHTML = text;
        
        handleScroll ();
    }
    
    function hilightContents (text) {
        var reg = new RegExp(options.stringsAndComments, "g");
        var result;
        var text1 = "";
        var pos1 = 0;
        while((result = reg.exec(text)) !== null) {
            text1 += hilightKeywords (text.substring(pos1, result.index));
            text1 += `<span style="color:${options.colorStringAndComment}">` + result[0] + '</span>';
            pos1 = result.index + result[0].length;
        }
        text1 += hilightKeywords (text.substring(pos1, text.length));
        
        return text1;
    }

    function hilightKeywords (text) {
        for (var i = 0; i < options.keywords.length; i++) {
            var reg = new RegExp(options.keywords[i], "g");
            var result;
            var text1 = "";
            var pos1 = 0;
            while((result = reg.exec(text)) !== null) {
                text1 += text.substring(pos1, result.index);
                text1 += `<span style="color: ${options.colorKeyword}; background-color: ${options.colorKeywordBack}; font-weight: bold;">${result[0]}</span>`;
                pos1 = result.index + result[0].length;
            }
            text1 += text.substring(pos1, text.length);
            text = text1;
        }
        
        return text1;
    }
    
    function prepareBraces (text, open, close) {
        var st = input.selectionStart;
        var en = input.selectionEnd;
        var found, i1, i2;
        
        if (st === en) {
            if (st === text.length || ("({[".indexOf (text.substr(st, 1)) === -1 && "}])".indexOf (text.substr(st, 1)) === -1))
                st--;
              
            if (text.substr(st, 1) === open) {
                var i = st, nb = 0;
                do {
                    if (text.substr(i, 1) == open)
                        nb++;
                    else if (text.substr(i, 1) == close)
                        nb--;
                
                    i++;
                } while (i < text.length && nb !== 0);

                if (nb === 0) {
                    found = true;
                    i1 = st;
                    i2 = i - 1;
                }
                
            } else if (text.substr(st, 1) === close) {
                var i = st, nb = 0;
                do {
                    if (text.substr(i, 1) == open)
                        nb--;
                    else if (text.substr(i, 1) == close)
                        nb++;
                  
                    i--;
                } while (i > -1 && nb !== 0);
              
                if (nb === 0) {
                    found = true;
                    i1 = i + 1;
                    i2 = st;
                }
            }
        }
        

        if (found) {
            var p0 = text.substring(0, i1);
            var p1 = text.substring(i1 + 1, i2);
            var p2 = text.substring(i2 + 1, text.length)
            text = p0 + `${open}\0x0000 ` + p1 + ` \0x0000${close}` + p2;
        }
        
        return {text: text, found: found};
    }
    
    function hilightBraces (text, open, close) {
        return text
        .replaceAll(`${open}\0x0000 `, `<span style="color: ${options.colorBracketMatch}; background-color: ${options.colorBracketMatchBack};">${open}</span>`)
        .replaceAll(` \0x0000${close}`, `<span style="color: ${options.colorBracketMatch}; background-color: ${options.colorBracketMatchBack};">${close}</span>`);
    }

    function handleScroll () {
        hilights.scrollTop = input.scrollTop;
        hilights.scrollLeft = input.scrollLeft;
    }
    
    function handleInput () {
        hilightAll ();
    }

    function handleKeyPress (e) {
        function tabRight (sel) {
            var c = sel;
            var i = c;
            while (i >= -1) {
                i--;
                if (input.value.substr (i, 1) === "\n" || i === -1) {
                    i++
                    var n = options.tabWidth - ((c - i) % options.tabWidth);

                    document.execCommand("insertText", false, " ".repeat (n));

                    for (i = c; i < input.value.length; i++)
                        if (input.value.charAt(i) === "\n")
                            return i + 1;
                            
                    return input.value.length;
                }
            }
        }
        
        function tabLeft (sel) {
            var c = sel;
            var i = c;
            while (i >= -1) {
                i--;
                if (input.value.substr (i, 1) === "\n" || i === -1) {
                    i++;

                    input.selectionStart = i;

                    for (var j = 0; j < options.tabWidth && i + j < input.value.length; j++)
                        if (" \t\v".indexOf (input.value.substr (i + j, 1)) === -1)
                            break;
                            
                    if (j > 0) {
                        input.selectionEnd = i + j;

                        document.execCommand("delete");
                    }
                    
                    input.selectionStart = (c - j > i ? c - j: i);
                    input.selectionEnd = input.selectionStart;
                    
                    for (i = c; i < input.value.length; i++)
                        if (input.value.charAt(i) === "\n")
                            return i + 1;
                            
                    return input.value.length;
                }
            }
        }
        
        if (e.key === "Enter") {
            e.preventDefault ();
            
            var c = input.selectionStart;
            var i = c;
            while (i >= 0) {
                i--;
                if (input.value.substr (i, 1) === "\n" || i === -1) {
                    var pre = "";
                    var j = i + 1;
                    while (j < c && j < input.value.length && " \t\v".indexOf (input.value.substr (j, 1)) > -1) {
                        pre += input.value.substr (j, 1);
                        j++;
                    }
                            
                    document.execCommand("insertText", false, '\n' + pre);
                    input.blur ();
                    input.focus ();

                    return;
                }
            }
            
        } else if (e.key === "Tab") {
            e.preventDefault ();
            
            if (input.selectionStart == input.selectionEnd) {
                if (e.shiftKey) {
                    tabLeft (input.selectionStart);
                    
                } else {
                    tabRight (input.selectionStart);
                    
                }
            } else {
                var lineStarts = [];
                
                for (i = input.selectionStart - 1; i >= -1; i--)
                    if (input.value.charAt(i) === "\n") {
                        lineStarts.push (i + 1);
                        break;
                    }
                    
                if (i === -1)
                    lineStarts.push (0);
                    
                for (i = input.selectionStart; i < input.selectionEnd - 1; i++)
                    if (input.value.charAt(i) === "\n")
                        lineStarts.push (i + 1);
                
                for (i = input.selectionEnd - 1; i < input.value.length; i++)
                    if (input.value.charAt(i) === "\n") {
                        lineStarts.push (i + 1);
                        break;
                    }
                
                if (i === input.value.length) {
                    var farEnd = true;
                    lineStarts.push (i);
                }

                if (e.shiftKey) {
                    var ins = "";
                    for (var i = 0; i < lineStarts.length - 1; i++) {
                        input.selectionStart = lineStarts[i];
                        input.selectionEnd = lineStarts[i + 1];
                        
                        for (var j = 0; j < options.tabWidth && lineStarts[i] + j < input.value.length; j++)
                            if (" \t\v".indexOf (input.value.substr (lineStarts[i] + j, 1)) === -1)
                                break;
                                
                        ins += input.value.substring (input.selectionStart + j, input.selectionEnd)
                    }

                    input.selectionStart = lineStarts[0];
                    input.selectionEnd = lineStarts[lineStarts.length - 1];

                    document.execCommand("insertText", false, ins);
                    
                    input.selectionStart = lineStarts[0];
                    input.selectionEnd = lineStarts[0] + ins.length;
                
                } else {
                    var ins = "";
                    for (var i = 0; i < lineStarts.length - 1; i++) {
                        input.selectionStart = lineStarts[i];
                        input.selectionEnd = lineStarts[i + 1];
                        ins += " ".repeat (options.tabWidth) + input.value.substring (input.selectionStart, input.selectionEnd)
                    }

                    input.selectionStart = lineStarts[0];
                    input.selectionEnd = lineStarts[lineStarts.length - 1];

                    document.execCommand("insertText", false, ins);
                    
                    input.selectionStart = lineStarts[0];
                    input.selectionEnd = lineStarts[0] + ins.length;
                }
            }
        }
    }

    function handleResize () {
        
        container.style.width = "0px";
        container.style.height = "0px";
        
        setTimeout (function () {
            hh = ed.clientHeight;
            ww = ed.clientWidth;

            container.style.height = hh + "px";
            container.style.width = ww + "px";
        }, 0);
        
    }
    
    function handleSelectionChange () {
        const activeElement = document.activeElement
        if (activeElement && activeElement.id === `input${rndid}`) {
            hilightAll ();
        }
    }
    
    document.addEventListener('selectionchange', handleSelectionChange);

    input.addEventListener('input', handleInput);

    input.addEventListener('keydown', handleKeyPress);

    input.addEventListener('scroll', handleScroll);

    ed.addEventListener('resize', handleResize);
    window.addEventListener('resize', handleResize);

    setTimeout (function () {
        handleResize();
        hilightAll ();
    }, 0);
            
    input.value = "";

    return {
        getValue: function () {
            return input.value;
        },
        setValue: function (value) {
            input.value = value;
            hilightAll ();
        },
        getSelectionStart () {
            return input.selectionStart;
        },
        getSelectionEnd () {
            return input.selectionEnd;
        },
        setSelectionStart (v) {
            input.selectionStart = v;
        },
        setSelectionEnd (v) {
            input.selectionEnd = v;
        },
        setFocus: function () {
            input.focus ();
        }
    }
}

