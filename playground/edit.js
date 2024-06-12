var edit = function (node, options) {
    "use strict";
    if (!options) {
        var options = {
            font: "8pt monospace",
            tabWidth: 4,
            colorCaret: "rgb(208,208,208)",
            colorText: "rgb(208,208,208)",
            colorTextBack: "rgb(48,48,48)",
            colorSelection: "rgb(48,48,48)",
            colorSelectionBack: "rgb(208,208,208)",
            keywords: ["\\b(CHAIN|RULE|READ|WRITE|MATCH|VAR)\\b"],
            stringsAndComments: "(\"([^\"\\\\\\n]|(\\\\.))*((\")|(\\n)|($)))|(\\/\\/((.*\\n)|(.*$)))|(\\/\\*[\\S\\s]*?((\\*\\/)|$))"
        }
    }
    
    var ww, hh;
    var rndid = Math.floor (Math.random () * 32767);
    var ed = document.getElementById(node);

    ed.innerHTML = 
    `
    <div id="container${rndid}" style="position: relative; width: inherit; height: inherit; overflow: auto;">
      <div id="backdrop${rndid}" style = "z-index: 1; width: inherit; height: inherit; overflow: hidden;">
        <div id="hilights${rndid}" style="wrap: none; font: ${options.font}; white-space: pre; color: ${options.colorText}; background-color: ${options.colorTextBack}; width: inherit; height: inherit; overflow: hidden; margin: 0; padding:5px;">
        </div>
      </div>
      <textarea class="cls${rndid}" id="input${rndid}" spellcheck="false" wrap="off" style="z-index: 0; width: inherit; height: inherit; border-style: none; border-radius: 0; outline: none; resize: none; box-sizing: border-box; display: block; background-color: transparent; color: transparent; caret-color: ${options.colorCaret}; font: ${options.font}; margin: 0; padding:5px; position: absolute; top: 0; left: 0;">
      </textarea>
    </div>
    `

    var input = document.getElementById(`input${rndid}`);
    var hilights = document.getElementById(`hilights${rndid}`);
    var backdrop = document.getElementById(`backdrop${rndid}`);
    var container = document.getElementById(`container${rndid}`);
    
    var style=document.createElement('style');
    style.innerHTML =
    `
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
        
        text = text
        .replaceAll(/&/g, '&amp;')
        .replaceAll(/</g, '&lt;')
        .replaceAll(/>/g, '&gt;');

        text = hilightContents (text);

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
        return hilightKeywords (text).replaceAll (reg, (str) => `<i>${str.replaceAll (/<b>|<\/b>/ig, "")}</i>`);
        
    }

    function hilightKeywords (text) {
        var reg = new RegExp(options.keywords, "g");
        return text.replaceAll (reg, (str) => `<b>${str}</b>`);
    }
    
    function handleScroll () {
        hilights.scrollTop = input.scrollTop;
        hilights.scrollLeft = input.scrollLeft;
    }
    
    function handleInput () {
        window.requestAnimationFrame(() => {hilightAll ()})
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
        }
        else if (e.key === "Tab") {
            e.preventDefault ();
            
            if (input.selectionStart == input.selectionEnd) {
                if (e.shiftKey) {
                    tabLeft (input.selectionStart);
                }
                else {
                    tabRight (input.selectionStart);
                }
            }
            else {
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
                }
                else {
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
        else if (e.key === "Home") {
            if (input.selectionStart === 0 || input.value.charAt (input.selectionStart - 1) === "\n") {
                e.preventDefault ();
                var i = input.selectionStart;
                while (i < input.value.length && " \t\v".indexOf (input.value.charAt (i)) > -1) {
                    i++
                }
                
                if (!e.shiftKey) {
                    input.selectionStart = i;
                    input.selectionEnd = i;
                }
                else {
                    input.selectionStart = i;
                }
            }
            else {
                /*
                e.preventDefault ();

                var i = input.selectionStart;
                while (i >= 0 && "\n".indexOf (input.value.charAt (i - 1)) === -1) {
                    i--
                }

                if (!e.shiftKey) {
                    input.selectionStart = i;
                    input.selectionEnd = i;
                
                } else {
                    input.selectionStart = i;
                }
                */
            }
        } else if (e.key === "End") {
            if (input.selectionEnd === input.value.length || input.value.charAt (input.selectionEnd) === "\n") {
                e.preventDefault ();
                var i = input.selectionEnd;
                while (i >= 0 && " \t\v".indexOf (input.value.charAt (i - 1)) > -1) {
                    i--
                }
                
                if (!e.shiftKey) {
                    input.selectionStart = i;
                    input.selectionEnd = i;
                }
                else {
                    input.selectionEnd = i;
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

