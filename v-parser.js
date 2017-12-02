// Ahead Network Parser
//
// (c) Esperas, 2017

var parser = {
    parseConstant: function (text, pos, constant) {
        "use strict";
        if (text.substring (pos, pos + constant.length) === constant) {
            return pos + constant.length;
        } else {
            return -1;
        }
    },

    parseRegExp: function (text, pos, patt) {
        "use strict";
        var txt = patt.exec(text.substr(pos));

        if (txt) {
            return pos + txt[0].length;
        } else {
            return -1;
        }
    },

    parseCFG: function (grammar, text) {
        "use strict";
        var chart = [], right;

        function findItem (array, sequence, index) {
            "use strict";
            var i;
            if (array)
                for (i = 0; i < array.length; i++)
                    if (array[i].sequence === sequence && array[i].index === index)
                        return array[i];

            return null;
        }

        function mergeItem (offset, sequence, index, parent) {
            "use strict"
            var item, i, j, k, x, y, inheritors, inheritable;

            item = findItem (chart[offset], sequence, index);
            if (!item) {
                item = {sequence: sequence, index: index, inheritable: [], inheritors: [], bringOver: []};
                if (!chart[offset]) chart[offset] = [];
                chart[offset].push (item);
            }

            if (item.sequence[item.index].script) {
                if (item.rightExtent === undefined) {
                    item.rightExtent = item.sequence[item.index].script (text, offset);
                    if (item.rightExtent > right)
                        right = item.rightExtent;
                }
            }

            inheritors = [item].concat (item.inheritors);
            if (index + 1 === sequence.length) {
                if (parent)
                    inheritable = [parent].concat (parent.inheritable);
                else
                    inheritable = [];

            } else {
                inheritable = [item];
                if (parent)
                    if (item.bringOver.indexOf (parent) === -1)
                        item.bringOver.push (parent);
            }
            
            for (i = 0; i < inheritable.length; i++) {
                x = inheritable[i];
                for (j = 0; j < inheritors.length; j++) {
                    y = inheritors[j];
                    x.inheritors.push (y);
                    if (!findItem (y.inheritable, x.sequence, x.index)) {
                        y.inheritable.push (x);
                        if (x.index + 1 < x.sequence.length && y.sequence[y.index].script && y.rightExtent > -1) {
                            for (k = 0; k < x.bringOver.length; k++)
                                mergeItem (y.rightExtent, x.sequence, x.index + 1, x.bringOver[k]);
                        }
                    }
                }
            }
        }

        function parse (grammar) {
            "use strict";
            var i, j, m, column, item;

            if (!chart[0]) chart[0] = [];
            mergeItem (0, grammar.getSequence, 0, null);
            for (i = 0; i < chart.length; i++) {
                if (chart[i]) {
                    column = chart[i];
                    for (j = 0; j < column.length; j++) {
                        item = column[j];
                        if (item.sequence[item.index].alternation) {
                            for (m = 0; m < item.sequence[item.index].alternation.length; m++)
                                mergeItem (i, item.sequence[item.index].alternation[m].getSequence, 0, item);
                                        
                        } else if (item.sequence[item.index].sequence) {
                            mergeItem (i, item.sequence[item.index].sequence, 0, item);

                        } else if (item.sequence[item.index].subtype) {
                            mergeItem (i, item.sequence[item.index].subtype.getSequence, 0, item);

                        } else if (item.sequence[item.index].reference) {
                            for (m = 0; m < item.sequence[item.index].reference.length; m++)
                                mergeItem (i, item.sequence[item.index].reference[m].getSequence, 0, item);

                        } else if (item.sequence[item.index].script) {
                            mergeItem (i, item.sequence[item.index].getSequence, 0, item);

                        }
                    }
                }
            }
        }

        function makeExtents () {
            "use strict"
            var i, j, column, item, rule;
            for (i = 0; i < chart.length; i++) {
                if (chart[i]) {
                    column = chart[i];
                    for (j = 0; j < column.length; j++) {
                        item = column[j];
                        rule = item.sequence[item.index];
                        if (rule.script && item.rightExtent > -1) {
                            if (!rule.extents) rule.extents = [];
                            if (!rule.extents[i]) rule.extents[i] = [];
                            if (rule.extents[i].indexOf (item.rightExtent) === -1) rule.extents[i].push (item.rightExtent);
                        }
                    }
                }
            }
        }
        var deb = "";            

        grammar = parser.utils.cloneObject (grammar);
        parser.utils.fixNodes (grammar);
        right = 0;
        parse (grammar);
        makeExtents ();

        var coords = parser.utils.getErrCoords(right, text);
        return {offset: right, row: coords.row, column: coords.column, description: "", forest: grammar};
    },

    utils: {
        cloneObject: function (obj) {
            "use strict";
            var clone;
            if (Array.isArray (obj))
                clone = [];
            else
                clone = {};
                
            for (var i in obj) {
                if ((typeof (obj[i])==="object" || Array.isArray (obj[i])) && obj[i] !== null) {
                    clone[i] = parser.utils.cloneObject (obj[i]);
                } else
                    clone[i] = obj[i];
            }
            return clone;
        },

        getErrCoords: function (offset, text) {
            "use strict";
            var i, ch, row = 1, col = 0, foundCol = false;
            if (offset === 0 && text.length === 0) {
                return {row: 1, column: 1};
            } else {
                for (i = offset; i >= 0; i -= 1) {
                    ch = text.charCodeAt(i);
                    if (ch === 13 || ch === 10) {
                        if (ch === 10 && i > 0) {
                            if (text.charCodeAt(i - 1) === 13) {
                                i -= 1;
                            }
                        }
                        if (col !== 0) {
                            row += 1;
                            foundCol = true;
                        }
                    }
                    if (!foundCol)
                        col += 1;
                }
                return {row: row, column: col};
            }
        },

        fixNodes: function (root) {
            "use strict";
            var stack = [], ptr, node, i, j, k;

            function getChildren (node, name, nodestack, ptr) {
                "use strict";
                var stack = [], ret = [], i, inParent;
                
                stack.push (node);
                while (stack.length > 0) {
                    if (!stack[stack.length - 1])
                        i=i;
                    node = stack.pop ();
                    if (node.type) {
                        if (node.type.exp && node.type.exp === name)
                            ret.push (node);

                        stack.push (node.subtype);
                        
                    } else if (node.sequence) {
                        for (i = node.sequence.length - 1; i >= 0; i--)
                            stack.push (node.sequence[i]);
                        
                    } else if (node.alternation) {
                        for (i = node.alternation.length - 1; i >= 0; i--)
                            stack.push (node.alternation[i]);

                    } else if (node.parent) {
                        inParent = false;
                        for (i = ptr; i >= 0; i--)
                            if (nodestack[i] === node) {
                                stack.push (node.parent);
                                inParent = true;
                            }

                        if (!inParent) {
                            if (!node.reference)
                                parser.utils.fixNodes (node);

                            for (i = 0; i < node.reference.length; i++)
                                stack.push (node.reference[i].subtype);
                        }
                    }
                }

                return ret;
            }

            stack.push (root);
            ptr = 0;
            while (ptr < stack.length) {
                node = stack[ptr++];
 
                if (node.type) {
                    stack.push (node.subtype);
                    
                } else if (node.sequence) {
                    for (i = node.sequence.length - 1; i >= 0; i--)
                        stack.push (node.sequence[i]);
                        
                } else if (node.alternation) {
                    node.getSequence = [node];
                    for (i = node.alternation.length - 1; i >= 0; i--)
                        stack.push (node.alternation[i]);
                    
                } else if (node.exp && (node.exp.charAt(0) === '"' || node.exp.charAt(0) === "'" || node.exp.charAt(0) === "`")) {
                    var strMatch = node.exp.replace(/\\"/mg, '"');
                    var strMatch = node.exp.replace(/\\'/mg, "'");
                    var strMatch = node.exp.replace(/\\`/mg, "`");
                    var strMatch = node.exp.replace(/\\\\/mg, "\\");
                    strMatch = strMatch.substring(1, strMatch.length - 1);
                    node.script = function (strMatch) {
                        return function (pText, leftExtent) {
                            return parser.parseConstant (pText, leftExtent, strMatch);
                        }
                    } (strMatch);
                        
                } else if (node.exp && node.exp.charAt(0) === '/') {
                    var ch;
                    var oldch = null;
                    var p1 = 1;
                    while (p1 < node.exp.length) {
                        ch = node.exp.charAt(p1);
                        if (oldch !== "\\" && ch === "/") break;
                        if (oldch !== "\\")
                            oldch = ch;
                        else
                            oldch = "";
                        p1 += 1;
                    }
                    var reg = node.exp.substring (1, p1);
                    var mod = node.exp.substr(reg.length + 2);
                    var patt = RegExp("^(" + reg + ")", mod);
                    
                    node.script = function (patt) {
                        return function (pText, leftExtent) {
                            return parser.parseRegExp (pText, leftExtent, patt);
                        }
                    } (patt);
                
                } else if (!node.reference && node.spec || (node.exp && node.exp.indexOf(".") > -1)) {
                    var parents = [];
                    var path;
                    if (node.parent) {
                        path = node.spec.split(".");
                        parents.push (node.parent);
                        stack.push (node.parent);

                    } else {
                        path = node.exp.split(".");
                        if (path[0] === "")
                            parents.push (root);
                        
                        else
                            for (i = stack.length - 1; i >= 0; i--)
                                if (stack[i].type)
                                    if (stack[i].type.exp === path[0])
                                        parents.push (stack[i]);
                        
                        path.shift()
                    }
                    
                    var range = parents;
                    for (i = 0; i < path.length; i++) {
                        parents = range;
                        range = [];
                        for (j = 0; j < parents.length; j++) {
                            var children = getChildren (parents[j], path[i], stack, ptr - 1);
                            for (k = 0; k < children.length; k++)
                                range.push (children[k]);
                        }
                    }

                    node.reference = range;

                    if (range.length === 0)
                        throw "V-parser processing error - symbol not found: " + path.join(".");

                } else if (!node.reference) {
                    throw "V-parser processing error - invalid node type: " + node;
                }

                node.getSequence = [node];
            }
        }
    }
};