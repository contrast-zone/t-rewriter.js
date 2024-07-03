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
        }
    }
    
    var ww, hh;
    var rndid = Math.floor (Math.random () * 32767);
    var ed = document.getElementById(node);

    ed.innerHTML = 
    `
    <div id="container${rndid}" style="position: relative; width: inherit; height: inherit; overflow: auto;">
      <textarea class="cls${rndid}" id="input${rndid}" spellcheck="false" wrap="off" style="z-index: 0; width: inherit; height: inherit; border-style: none; border-radius: 0; outline: none; resize: none; box-sizing: border-box; display: block; background-color: ${options.colorTextBack}; color: ${options.colorText}; caret-color: ${options.colorCaret}; font: ${options.font}; margin: 0; padding:5px; position: absolute; top: 0; left: 0;">
      </textarea>
    </div>
    `

    var input = document.getElementById(`input${rndid}`);
    var container = document.getElementById(`container${rndid}`);
    
    input.oncontextmenu = function (e) {
        return false;
    };

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
    
    function handleScroll () {
    }
    
    function handleInput () {
    }

    var lastKeyType;
    var undoStack;
    var redoStack;
    
    input.onmousedown = function(e) {
        lastKeyType = "nav";
    }
    
    function undo () {
        if (undoStack.length > 0) {
            var el = undoStack.pop ();
            redoStack.push ({val: input.value, selStart: el.selStart, selEnd: el.selEnd});

            input.value = el.val;
            input.selectionStart = el.selStart;
            input.selectionEnd = el.selStart;
            input.blur();
            input.focus();

            hilightAll ();
        }
    }
    
    function redo () {
        if (redoStack.length > 0) {
            var el = redoStack.pop ()
            undoStack.push ({val: input.value, selStart: el.selStart, selEnd: el.selEnd});

            input.value = el.val;
            input.selectionStart = el.selEnd + 1;
            input.selectionEnd = el.selEnd + 1;
            input.blur();
            input.focus();
            input.selectionStart = el.selStart;
            input.selectionEnd = el.selEnd + 1;

            hilightAll ();
        }
    }
    
    input.onpaste = function (e) {
        undoStack[undoStack.length - 1].selEnd = input.selectionStart + e.clipboardData.getData("text/plain").length - 1;
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
        
        if (e.key !== "Shift" && e.key !== "Control" && e.key !== "Meta") {
            var keyType;
            if (
                e.key === "ArrowUp" ||
                e.key === "ArrowDown" ||
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight" ||
                e.key === "Home" ||
                e.key === "End" ||
                e.key === "PageUp" ||
                e.key === "PageDown" ||
                (e.ctrlKey && e.key.toLowerCase () === "z") ||
                (e.ctrlKey && e.key.toLowerCase () === "c")
            ) {
                keyType = "nav";
            }
            else {
                keyType = "edit";
            }
            
            if (
                (lastKeyType === "nav" && keyType === "edit") ||
                ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase () === "x" || e.key.toLowerCase () === "v")) ||
                (e.shiftKey && e.key === "Insert")
            ) {
                redoStack = [];
                undoStack.push ({val: input.value, selStart: input.selectionStart, selEnd: input.selectionStart});
                if (undoStack.length > 500) {
                    undoStack.shift ();
                }
                if (
                    ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase () === "x" || e.key.toLowerCase () === "v")) ||
                    (e.shiftKey && e.key === "Insert")
                ) {
                    keyType = "nav";
                }
            }
            else if (keyType === "edit") {
                undoStack[undoStack.length - 1].selEnd = input.selectionEnd;
            }
            
            lastKeyType = keyType;
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

                    if (undoStack.length > 0)
                        undoStack[undoStack.length - 1].selEnd = input.selectionEnd - 1;
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

                    if (undoStack.length > 0)
                        undoStack[undoStack.length - 1].selEnd = input.selectionEnd - 1;
                }
            }
        }
        else if (e.key === "Home") {
            if (e.ctrlKey) {
                input.selectionStart = 0;
                input.selectionEnd = 0;
                input.blur();
                input.focus();
            }
            else {
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
            }
        } else if (e.key === "End") {
            if (e.ctrlKey) {
                input.selectionStart = input.value.length;
                input.selectionEnd = input.value.length;
                input.blur();
                input.focus();
            }
            else {
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
        else if (e.key.toLowerCase () === "z" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault ()
            if (e.shiftKey) {
                redo ();
            }
            else {
                undo ();
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
    }, 0);
            
    input.value = "";
    undoStack = [];
    redoStack = [];
    lastKeyType = "nav";

    return {
        getValue: function () {
            return input.value;
        },
        setValue: function (value) {
            input.value = value;
            undoStack = [];
            redoStack = [];
            lastKeyType = "nav";
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

