// exp-log
// (c) contrast zone, 2021

var parser = (function () {
    "use strict";

    var grammar = [
        [[["/((\\s*)|((\\s*)((\\/\\/((.*\\n)|(.*$)))|(\\/\\*[\\S\\s]*?\\*\\/))(\\s*)))*/"]], [['.']]], //opt space or comments
        
        [[['expression']], [['start']]],

        [[['constant', 'expression']], [['expression']]],
        [[['computed', 'expression']], [['expression']]],
        [[['constant']], [['expression']]],
        [[['computed']], [['expression']]],

        [[['/(\\\\\\\\|(\\\\\\\\)*\\\\(<<|>>|::)|(?!(<<|>>|::))[\\S\\s])*/']], [['constant']]],

        [[['"<<"', '.', 'expression', '.', '">>"', '.', '"::"', '.', '"<<"', '.', 'ruleset', '.', '">>"']], [['computed']]],

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

        [[['"Goal"']], [['atom']]], //the goal atom
        [[['"@"', '/[A-Za-z][A-Za-z0-9]*/']], [['atom']]], //equivalent identifier
        [[['/[A-Za-z][A-Za-z0-9]*/']], [['atom']]], //identifier
        [[["/\\/(?!\\*)(?!\\/)([^\\/\\\\\\n]|(\\\\.))*\\/i?/"]], [['atom']]], //regexp
        [[["/\"([^\"\\\\\\n]|(\\\\.))*\"/"]], [['atom']]] //string
        
    ];

    var parseString = function (text, pos, strMatch) {
        if (text.substring (pos, pos + strMatch.length) === strMatch) {
            return pos + strMatch.length;
        } else {
            return -1;
        }
    };

    var parseRegExp = function (text, pos, regexp) {
        var patt = new RegExp("^(" + regexp + ")", "");
        var txt = patt.exec(text.substr(pos));

        if (txt) {
            return pos + txt[0].length;
        } else {
            return -1;
        }
    };

    var parse = function (text) {
        var chart = [], right;

        function getTerminal(offset, term) {
            if (typeof term === 'string' || term instanceof String) {
                var type = term.substring(0, 1);
                var trimmed = term.substring(1, term.length - 1);
                if (type === '"') {
                    return parseString (text, offset, trimmed);
                    
                } else if (type === '/') {
                    return parseRegExp (text, offset, trimmed);
                    
                }
            }
            return -1;
        }

        function findItem (array, sequence, index) {
            var i, j;
            if (array)
                for (i = 0; i < array.length; i++)
                    if (array[i].sequence === sequence && array[i].index === index)
                        return array[i];


            return null;
        }
        
        function mergeItem (offset, sequence, index, parent) {
            var item, i, j, x, y, inheritors, inherited;

            item = findItem (chart[offset], sequence, index);
            if (!item) {
                item = {offset: offset, sequence: sequence, index: index, inherited: [], inheritors: [], parents: []};
                if (!chart[offset]) chart[offset] = [];
                chart[offset].push (item);
            }
            
            if (parent && !findItem (item.parents, parent.sequence, parent.index)) {
                item.parents.push (parent);
                inherited = [parent].concat (parent.inherited); //parent
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
                            right = Math.max (right, advance);
                            if (advance > -1)
                                for (var z = 0; z < x.parents.length; z++)
                                    mergeItem (advance, x.sequence, x.index + 1, x.parents[z]);
                        }
                    }
                }
            }
        }

        function parse () {
            var i, j, k, column, item;

            if (!chart[0]) chart[0] = [];
            mergeItem (0, ['start', 'EOF'], 0, null);
            for (i = 0; i < chart.length; i++) {
                if (chart[i]) {
                    column = chart[i];
                    for (j = 0; j < column.length; j++) {
                        item = column[j];
                        if (getTerminal (i, item.sequence[item.index]) > -1)
                            mergeItem (i, item.sequence[item.index], 0, item);

                        else {
                            for (k = 0; k < grammar.length; k++) {
                                if (item.sequence[item.index] === grammar[k][1][0][0])
                                    mergeItem (i, grammar[k][0][0], 0, item);
                            }
                        }
                    }
                }
            }
        }

        function getCoords (offset, text) {
            var i, ch, row = 1, col = 0, foundCol = false;
            if (offset === 0 && text.length === 0) {
                return {row: 1, column: 1};
                
            } else {
                for (i = offset; i >= 0; i -= 1) {
                    ch = text.charCodeAt(i);
                    if (ch === 13 || ch === 10) {
                        if (ch === 10 && i > 0) {
                            if (text.charCodeAt (i - 1) === 13) {
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
        }

        right = 0;
        parse ();
        var coords = getCoords (right, text);
        return {offset: right, row: coords.row, column: coords.column, forest: chart};
    }
    
    return {parse: parse};
}) ();
