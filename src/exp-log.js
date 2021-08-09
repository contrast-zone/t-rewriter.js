// exp-log
// (c) contrast zone, 2021
// MIT License

var parser = (function () {
    "use strict";

    var getParseTree = function (rules, text) {
        var chart = [], right;

        function isString (str) {
            return (typeof str === 'string' || str instanceof String);
        }
        
        function isTerminal (term) {
            return (isString (term) && '"/'.indexOf (term.substring (0, 1)) > -1);
        }
        
        function findItem (array, sequence, index) {
            var i, j;
            if (array)
                for (i = 0; i < array.length; i++)
                    if (array[i].sequence === sequence && array[i].index === index)
                        return array[i];

            return null;
        }
        
        function parse (start) {
            function parseString (text, pos, strMatch) {
                if (text.substring (pos, pos + strMatch.length) === strMatch)
                    return pos + strMatch.length;
                
                else
                    return -1;
            };

            function parseRegExp (text, pos, regexp) {
                var patt = new RegExp("^(" + regexp + ")", "");
                var txt = patt.exec(text.substr(pos));

                if (txt)
                    return pos + txt[0].length;
                    
                else
                    return -1;
            };
            
            function getTerminal(offset, term) {
                if (isTerminal (term)) {
                    var type = term.substring(0, 1);
                    var trimmed = term.substring(1, term.length - 1);
                    if (type === '"')
                        return parseString (text, offset, trimmed);
                        
                    else if (type === '/')
                        return parseRegExp (text, offset, trimmed);
                        
                }

                return -1;
            }

            function advanceTerminal(offset, item, next, parents) {
                var end = getTerminal (offset, item.sequence[item.index]);
                if (end > -1) {
                    right = Math.max (right, end);
                    item.endOffset = end;
                    for (var i = 0; i < parents.length; i++)
                        mergeItem (end, next.sequence, next.index + 1, parents[i], item);
                }
            }

            function mergeItem (offset, sequence, index, parent, prev) {
                var prevItem, item, i, j, x, y, z, inheritors, inherited, advance;

                item = findItem (chart[offset], sequence, index);
                if (!item) {
                    item = {offset: offset, sequence: sequence, index: index, inherited: [], inheritors: [], parents: [], previous: []};
                    if (!chart[offset]) chart[offset] = [];
                    chart[offset].push (item);
                }
                
                if (prev && item.previous.indexOf(prev) === -1)
                    item.previous.push(prev);
                
                if (parent && !findItem (item.parents, parent.sequence, parent.index)) {
                    item.parents.push (parent);
                    inherited = [parent].concat (parent.inherited);
                    for (i = 0; i < inherited.length; i++) {
                        x = inherited[i];
                        inheritors = [item].concat (item.inheritors);
                        for (j = 0; j < inheritors.length; j++) {
                            y = inheritors[j];
                            if (y.index + 1 === y.sequence.length) {
                                if (!findItem (y.inherited, x.sequence, x.index)) {
                                    x.inheritors.push (y);
                                    y.inherited.push (x);
                                }
                                
                                if (x.index + 1 < x.sequence.length)
                                    advanceTerminal (offset, y, x, x.parents);
                            }
                        }
                    }
                    
                    if (item.index + 1 < item.sequence.length)
                        advanceTerminal (offset, item, item, [parent]);
                }
            }
            
            function parse (start) {
                var i, j, k, column, item;

                mergeItem (0, start, 1, {offset: 0, sequence: [], index: -1, inherited: [], inheritors: [], parents: [], previous: []}, null);
                for (i = 0; i < chart.length; i++) {
                    if (chart[i]) {
                        column = chart[i];
                        for (j = 0; j < column.length; j++) {
                            item = column[j];
                            for (k = 1; k < rules.length; k++) {
                                if (item.sequence[item.index] === rules[k][2][1][1])
                                    mergeItem (i, rules[k][1][1], 1, item, null);
                            }
                        }
                    }
                }
            }

            return parse (start)
        }

        function makeParseTree (eof) {
            function isParent (item, parent, rec, fst) {
                var i;

                for (i = 0; i < rec.length; i++)
                    if (rec[i] === item)
                        return false;
                
                rec.push(item);
                
                if (item.sequence === parent.sequence && item.index === parent.index - 1)
                    return true;
                
                if (!fst || item.index === item.sequence.length - 1)
                    for (i = 0; i < item.parents.length; i++)
                        if (isParent (item.parents[i], parent, rec, true))
                            return true;
            }
            
            function makeParseTree (eof) {
                var item, reachParent, parents, treeItem, childTreeItem;
                
                item = eof;
                parents = [{sequence: eof.sequence, index: 2, children: []}];
                while (parents.length > 0) {
                    if (item.index > 1) {
                        reachParent = item;

                        var i1 = item;
                        for (var p = 0; p < i1.previous.length; p++)
                            if (isParent (i1.previous[p], reachParent, [], true)) {
                                item = i1.previous[p];
                                break;
                            }
                        
                        if (p === i1.previous.length)
                            return "previous error";

                        childTreeItem = text.substring (item.offset, item.endOffset);
                        parents[parents.length - 1].index--;
                    
                    } else {
                        if (item.sequence === reachParent.sequence && item.index === reachParent.index - 1)
                            reachParent = {sequence: parents[parents.length - 1].sequence, index: parents[parents.length - 1].index + 1};

                        var i1 = item;
                        for (var p = 0; p < i1.parents.length; p++)
                            if (isParent (i1.parents[p], reachParent, [], true)) {
                                item = i1.parents[p];
                                break;
                            }

                        if (p === i1.parents.length)
                            return "parent error";

                        childTreeItem = treeItem;
                    }

                    if (item.index === item.sequence.length - 1)
                        parents.push ({sequence: item.sequence, index: item.index, children: []});
                    
                    treeItem = parents[parents.length - 1];
                    treeItem.children[treeItem.index - 1] = childTreeItem;
                    
                    if (treeItem.index === 1)
                        parents.pop ();

                }

                return treeItem;
            }

            function deleteInternals (pt) {
                var i, stack = [], curItem;
                
                stack.push (pt);
                while (stack.length > 0) {
                    curItem = stack.pop ();
                    if (curItem.index === 0)
                        delete curItem.index;
                        
                    if (curItem.children && curItem.children.length > 0)
                        for (i = 0; i < curItem.children.length; i++)
                            stack.push (curItem.children[i]);
                }
                
                pt.sequence.pop ();
                
                return pt;
            }
            
            return deleteInternals (makeParseTree (eof));
        }

        function toSExpression (pt) {
            var i, stack = [], curItem, ret = [];
            
            stack.push ({pt: pt, ret: ret, par: null, ndx: -1});
            while (stack.length > 0) {
                curItem = stack.pop ();
                if (typeof curItem.pt === "string")
                    curItem.par.ret[curItem.ndx] = curItem.pt;
                
                else
                    if (curItem.pt.children.length === 1)
                        stack.push ({pt: curItem.pt.children[0], ret: curItem.ret, par: curItem.par, ndx: curItem.ndx});
                        
                    else
                        for (i = 0; i < curItem.pt.children.length; i++) {
                            curItem.ret.push ([]);
                            stack.push ({pt: curItem.pt.children[i], ret: curItem.ret[curItem.ret.length - 1], par: curItem, ndx: i});
                        }
            }
            
            return ret;
        }

        function errors () {
            function getCoords (text, offset) {
                var i, ch, row = 1, col = 1;
                if (text.length > 0)
                    for (i = 0; i < offset; i += 1) {
                        ch = text.charCodeAt(i);
                        if (ch === 13 || ch === 10) {
                            if (ch === 13 && text.charCodeAt (i + 1) === 10)
                                i += 1;

                            row += 1;
                            col = 1;
                            
                        } else
                          col += 1;
                    }
                
                return {row: row, column: col};
            }
            
            function getExpected (chart) {
                var i, str, end = chart[chart.length - 1], __eof= false, ret = [];
                
                for (i = 0; i < end.length; i++) {
                    if (Array.isArray (end[i].sequence)) {
                        str = end[i].sequence[end[i].index];
                        if (str === '__EOF')
                            __eof = true;
                            
                        else if(isString(str) && (str.substr(0, 1) == '"' || str.substr(0, 1) == '/'))
                            if (ret.indexOf (str) === -1)
                                ret.push (str)
                    }
                }
                
                if (__eof)
                    ret.push ("end of file");
                    
                return ret;
            }
            
            return {getCoords: getCoords, getExpected: getExpected}
        }

        right = 0;
        var start = ["sequence", 'goal', '__EOF'];
        parse (start);
        var eof = findItem (chart[text.length], start, 2);
        if (eof) {
            var pt = makeParseTree (eof);
            return {success: true, parseTree: pt, sexpr: toSExpression (pt)};
            
        } else {
            var coords = errors().getCoords (text, right);
            var expected = errors().getExpected(chart);
            return {success: false, offset: right, row: coords.row, column: coords.column, expected: expected, chart: chart};
        }
    }
    
    return {/*getParseRules: getParseRules,*/ getParseTree: getParseTree};
}) ();

