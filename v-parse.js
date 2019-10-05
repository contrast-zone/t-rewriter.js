// V-Parse, (c) 2019

var parser = {
    parseConstant: function (text, pos, strMatch) {
        "use strict";
            
        if (text.substring (pos, pos + strMatch.length) === strMatch) {
            return pos + strMatch.length;
        } else {
            return -1;
        }
    },

    parseRegExp: function (text, pos, regexp) {
        "use strict";

        var patt = new RegExp("^(" + regexp + ")", "");
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
            var i;
            if (array)
                for (i = 0; i < array.length; i++)
                    if (array[i].sequence === sequence && array[i].index === index)
                        return array[i];

            return null;
        }
        
        function mergeItem (offset, sequence, index, parent) {
            var item, i, j, x, y, z, inheritors, inherited;

            item = findItem (chart[offset], sequence, index);
            if (!item) {
                item = {offset: offset, sequence: sequence, index: index, inherited: [], inheritors: [], parents: []};
                if (!chart[offset]) chart[offset] = [];
                chart[offset].push (item);
            }
            
            if (parent && !findItem (item.parents, parent.sequence, parent.index)) {
                item.parents.push (parent);
                inherited = [parent].concat (parent.inherited);
                for (i = 0; i < inherited.length; i++) {
                    x = inherited[i];
                    if (x.index + 2 < x.sequence.length) {
                        inheritors = [item].concat (item.inheritors);
                        for (j = 0; j < inheritors.length; j++) {
                            y = inheritors[j];
                            if (isTerminal (y.sequence) || y.index + 2 === y.sequence.length) {
                                if (!findItem (y.inherited, x.sequence, x.index)) {
                                    x.inheritors.push (y);
                                    y.inherited.push (x);
                                    
                                    var re;
                                    if (isTerminal (y.sequence)) {
                                        if (Array.isArray(y.sequence))
                                            re = parser.parseRegExp (text, offset, y.sequence[1]);
                                        else
                                            re = parser.parseConstant (text, offset, y.sequence);

                                            
                                        if (re > right)
                                            right = re;
                                            
                                        if (re > -1) {
                                            y.successTo = re;
                                            for (z = 0; z < x.parents.length; z++)
                                                mergeItem (re, x.sequence, x.index + 1, x.parents[z]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        function mergeProductions (offset, production, parent) {
            var i;
            
            if (isTerminal (production))
                mergeItem (offset, production, 0, parent);
                
            else
                for (i = 1; i < grammar[1].length; i++)
                    if (production === grammar[1][i][2])
                        mergeItem (offset, grammar[1][i][1], 0, parent);

        }
        
        function isTerminal (x) {
            var i;
            
            if (typeof x === 'string' || x instanceof String) {
                for (i = 0; i < grammar[1].length; i++)
                    if (x === grammar[1][i][2])
                        return false;

                return true;
                        
            } else if (Array.isArray (x) && x[0] === "r")
                return true;
            
            else
                return false;
            
        }

        function parse () {
            var i, j, column, item;

            if (!chart[0]) chart[0] = [];
            mergeItem (0, grammar[0], 0, null);
            for (i = 0; i < chart.length; i++) {
                if (chart[i]) {
                    column = chart[i];
                    for (j = 0; j < column.length; j++) {
                        item = column[j];
                        if (!isTerminal (item.sequence))
                            mergeProductions (i, item.sequence[item.index + 1], item)
                    }
                }
            }
        }

        function getErrCoords (offset, text) {
            "use strict";
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
        var coords = getErrCoords (right, text);
        return {offset: right, row: coords.row, column: coords.column, description: "", forest: chart};
    }
};
