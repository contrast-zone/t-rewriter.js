// exp-log
// (c) contrast zone, 2021
// MIT License

var parser = (function () {
    "use strict";

    var bootstrap = [
        //[[['.', 'add', '.']], [['start']]],
        //[[['add', '.', '"+"', '.', 'atom']], [['add']]],
        //[[['atom']], [['add']]],
        //[[["/[A-Za-z][A-Za-z0-9]*/"]], [['atom']]], //identifier
        //[[["/((\\s+)|(\\/\\/((.*\\n)|(.*$)))|(\\/\\*[\\S\\s]*?\\*\\/))*/"]], [['.']]] //opt space or comments

        [[['.', 'ruleset', '.']], [['start']]],
        //[[['expression']], [['start']]],

        //[[['constant', 'expression']], [['expression']]],
        //[[['constant']], [['expression']]],

        //[[['computed', 'expression']], [['expression']]],
        //[[['computed']], [['expression']]],

        //[[["/((\\\\(<<|>>|::|\\\\))|((?!(<<|>>|::|\\\\\\\\))[\\S\\s]))*/"]], [['constant']]],

        //[[['"<<"', '.', 'expression', '.', '">>"', '.', '"::"', '.', '"<<"', '.', 'ruleset', '.', '">>"']], [['computed']]],
        
        [[['logic', '.', '"<-"', '.', 'ruleset']], [['ruleset']]],
        [[['logic']], [['ruleset']]],

        [[['eq']], [['logic']]],
        
        [[['impl', '.', '"<->"', '.', 'eq']], [['eq']]],
        [[['impl']], [['eq']]],
        
        [[['or', '.', '"->"', '.', 'impl']], [['impl']]],
        [[['or']], [['impl']]],
        
        [[['and', '.', '"\\/"', '.', 'or']], [['or']]],
        [[['and']], [['or']]],
        
        [[['seq', '.', '"/\\"', '.', 'and']], [['and']]],
        [[['seq']], [['and']]],

        [[['primary', '.', '"_"', '.', 'seq']], [['seq']]],
        [[['primary', '.', 'seq']], [['seq']]],
        [[['primary']], [['seq']]],

        [[['"("', '.', 'ruleset', '.', '")"']], [['primary']]],
        [[['atom']], [['primary']]],

        //[[['"Goal"']], [['atom']]], //the goal atom
        [[['"<"', "/[A-Za-z~][A-Za-z0-9~]*/", '">"']], [['atom']]], //equivalent identifier
        [[["/[A-Za-z~][A-Za-z0-9~]*/"]], [['atom']]], //identifier
//        [[["/\'([^\'\\\\\\n]|(\\\\.))*\'i?/"]], [['atom']]], //regexp
        [[["/\\/(?!\\*)(?!\\/)(?!\\\\)([^\\n\\/\\\\]|(\\\\.))*\\/i?/"]], [['atom']]], //regexp
//        [[["/\\/((?![*+?])(?:[^\\r\\n\\[/\\\\]|\\\\.|\\[(?:[^\\r\\n\\]\\\\]|\\\\.)*\\])+)\\/i?/"]], [['atom']]], //regexp
        [[["/\"([^\"\\\\\\n]|(\\\\.))*\"/"]], [['atom']]], //string        

        [[["/((\\s+)|(\\/\\/((.*\\n)|(.*$)))|(\\/\\*[\\S\\s]*?\\*\\/))*/"]], [['.']]] //opt space or comments
    ];

    var parseString = function (text, pos, strMatch) {
        if (text.substring (pos, pos + strMatch.length) === strMatch)
            return pos + strMatch.length;
        
        else
            return -1;
    };

    var parseRegExp = function (text, pos, regexp) {
        var patt = new RegExp("^(" + regexp + ")", "");
        var txt = patt.exec(text.substr(pos));

        if (txt)
            return pos + txt[0].length;
            
        else
            return -1;
    };

    var parse = function (text) {
        var chart = [], right;

        function findItem (array, sequence, index) {
            var i, j;
            if (array)
                for (i = 0; i < array.length; i++)
                    if (array[i].sequence === sequence && array[i].index === index)
                        return array[i];

            return null;
        }
        
        function parse (start) {
            function getTerminal(offset, term) {
                if (typeof term === 'string' || term instanceof String) {
                    var type = term.substring(0, 1);
                    var trimmed = term.substring(1, term.length - 1);
                    if (type === '"')
                        return parseString (text, offset, trimmed);
                        
                    else if (type === '/')
                        return parseRegExp (text, offset, trimmed);
                        
                }

                return -1;
            }

            function mergeItem (offset, sequence, index, parent, prev) {
                var prevItem, item, i, j, x, y, z, inheritors, inherited;

                item = findItem (chart[offset], sequence, index);
                if (!item) {
                    item = {offset: offset, sequence: sequence, index: index, inherited: [], inheritors: [], parents: [], previous: []};
                    if (!chart[offset]) chart[offset] = [];
                    chart[offset].push (item);
                }
                
                if (prev) {
                    prevItem = findItem (item.previous, prev);
                    if (!prevItem)
                        item.previous.push(prev);
                }
                
                if (parent && !findItem (item.parents, parent.sequence, parent.index)) {
                    item.parents.push (parent);
                    inherited = [parent].concat (parent.inherited);
                    for (i = 0; i < inherited.length; i++) {
                        x = inherited[i];
                        inheritors = [item].concat (item.inheritors);
                        for (j = 0; j < inheritors.length; j++) {
                            y = inheritors[j];
                            if (y.index + 1 === y.sequence.length)
                                if (!findItem (y.inherited, x.sequence, x.index)) {
                                    x.inheritors.push (y);
                                    y.inherited.push (x);
                                }
                                
                            if (x.index + 1 < x.sequence.length) {
                                var advance = getTerminal (offset, y.sequence);
                                if (advance > -1) {
                                    right = right > advance? right: advance;
                                    item.end = advance;
                                    for (z = 0; z < x.parents.length; z++)
                                        mergeItem (advance, x.sequence, x.index + 1, x.parents[z], item);
                                }
                            }
                        }
                    }
                }
            }

            function parse (start) {
                var i, j, k, column, item;

                if (!chart[0]) chart[0] = [];
                mergeItem (0, start, 0, {offset: 0, sequence: [], index: -1, inherited: [], inheritors: [], parents: [], previous: []}, null);
                for (i = 0; i < chart.length; i++)
                    if (chart[i]) {
                        column = chart[i];
                        for (j = 0; j < column.length; j++) {
                            item = column[j];
                            if (Array.isArray (item.sequence))
                                if (getTerminal (i, item.sequence[item.index]) > -1)
                                    mergeItem (i, item.sequence[item.index], 0, item, null);

                                else
                                    for (k = 0; k < bootstrap.length; k++)
                                        if (item.sequence[item.index] === bootstrap[k][1][0][0])
                                            mergeItem (i, bootstrap[k][0][0], 0, item, null);
                        }
                    }
            }
            
            return parse (start)
        }

        function makeAST (eof) {
            function isString (str) {
                return (typeof str === 'string' || str instanceof String);
            }
            
            function returnItem (chItem, item) {
                chItem.index = item.index;
                return [item, chItem, chItem];
            }
            
            function isParent (item, parent, rec) {
                var i;

                for (i = 0; i < rec.length; i++)
                    if (rec[i] === item)
                        return false;
                
                rec.push(item);
                
                if (item.sequence === parent.sequence && item.index === parent.index - 1)
                    return true;
                
                for (i = 0; i < item.parents.length; i++)
                    if (isParent (item.parents[i], parent, rec))
                        return true;
            }
            
            function doParents (item, parents, stitch, seqItems) {
                var i, ret, chItem, tmpItem;
                
                for (i = 0; i < parents.length; i++)
                    if (parents[i][0] === item)
                        break;
                
                if (i === parents.length) {
                    chItem = {text: isString(item.sequence)? text.substring(item.offset, item.end): "", /*offset: item.offset,*/ index: item.index, sequence: item.sequence, childSequence: []};
                    parents.push([item, chItem, chItem]);
                    if (item.index === 0) {
                        if (parents.length > 1 && item.sequence.length > 1 && !isString(item.sequence)) {
                            if(item.sequence === seqItems[seqItems.length - 1].sequence && item.index === seqItems[seqItems.length - 1].index - 1)
                                return returnItem (seqItems.pop (), item);
                                
                        } else
                            for (i = 0; i < item.parents.length; i++)
                                if (item.parents[i].index === -1)
                                    return [item, chItem, null];
                                    
                                else {
                                    ret = doParents (item.parents[i], parents, stitch, seqItems);
                                    parents.pop ();
                                    if (ret) {
                                        tmpItem = (parents.length === 1? stitch: chItem);
                                        ret[2].childSequence[ret[2].index] = tmpItem;
                                        return [ret[0], ret[1], tmpItem];
                                    }
                                }
                    } else {
                        if (item.index < item.sequence.length - 1 && !isString(item.sequence)) {
                            if(item.sequence === seqItems[seqItems.length - 1].sequence && item.index === seqItems[seqItems.length - 1].index - 1)
                                if (item.offset === 0 || item.previous.length > 0)
                                    return returnItem (seqItems[seqItems.length - 1], item);

                        } else
                            if (isParent (item, seqItems[seqItems.length - 1], []))
                                return returnItem (chItem, item); //maybe without item.index
                    }
                } else {
                    parents.push([item, null, null]);
                    return returnItem (seqItems.pop (), item);
                }
            }

            function makeAST (eof) {
                var ret, fst, item = eof, seqItem = null, seqItems = [];

                do {
                    seqItem = {text: isString (item.sequence)?text.substring(item.offset, item.end):"", /*offset: item.offset,*/ index: item.index, sequence: item.sequence, childSequence: []}

                    fst = true;
                    while (item.index === 0 && item.sequence !== eof.sequence) {
                        if (fst) fst = false;
                        ret = doParents (item, [], fst? null: seqItem, seqItems);
                        item = ret[0];
                        seqItem = ret[1];
                    }

                    if (item.index > 0 && (!isString (item.sequence) && item.index === item.sequence.length - 1))
                        seqItems.push (seqItem);

                    item = item.previous[0];
                            
                } while (item);
                
                return seqItem;
            }
            
            return makeAST (eof);
        }

        function getCoords (offset, text) {
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

        right = 0;
        var start = ['start', '__EOF'];
        parse (start);
        var eof = findItem (chart[text.length], start, 1);
        var ast = [];
        if (eof) ast = makeAST (eof);
        var coords = getCoords (right, text);
        return {success: eof, offset: right, row: coords.row, column: coords.column, forest: ast/*chart*/};
    }
    
    return {parse: parse};
}) ();
