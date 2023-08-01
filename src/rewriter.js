// rewriter.js
// (c) contrast zone, 2023
// MIT License

var Rewriter= (
    function (obj) {
        return {
            rewrite: obj.rewrite
        };
    }
) (
    (function () {
        "use strict";
        
        var rewrite = function (rules, input, phase) {
            var ruleIndex = 0;
            var getRules = function (arr, phase, segment) {
                var rules = [];
                for(var i = 1; i < arr.length; i++) {
                    var rule = arr[i]

                    var v = [];
                    if (rule[0] === "MATCH") {
                        for (var j = 1; j < rule[1].length; j++) {
                            v.push (rule[1][j]);
                        }
                        
                        rule = rule[2];
                    }
                    
                    if (rule[0] === "RULE") {
                        var r = {read: [], write: []};
                        for (var j = 1; j < rule[1].length; j++) {
                            if (phase === "FWD") {
                                r.read.push (rule[1][j]);
                            }
                            else if (phase === "BWD") {
                                r.write.push (rule[1][j]);
                            }
                        }
                        
                        for (var j = 1; j < rule[2].length; j++) {
                            if (phase === "FWD") {
                                r.write.push (rule[2][j]);
                            }
                            else if (phase === "BWD") {
                                r.read.push (rule[2][j]);
                            }
                        }
                        
                        rules.push ({index: ruleIndex++, segment: segment, vars: v, rule: r});
                    }
                }
                
                return rules;
            }
            
            var varIndex = 0;
            var prove = function (rules, input) {
                var ret = undefined;
                var chart = [];
                chart.push ({descendRule: -1, write: undefined, input: input, index: 0, phase: "whole", follows: []});
                var level = 0;
                while (chart.length > 0) {
                    var item;
                    item = chart[chart.length - 1];

                    var we = undefined;
                    if (item.writeEx) {
                        if (item.writeEx.val) {
                            we = item.writeEx.val;
                        }
                        else {
                            we = item.writeEx;
                        }
                    }
                    
                    if (
                        (!item.write && !item.input) || item.phase === "parsed" ||
                        (item.write && item.index === item.write.length && item.input.length === item.write.length)
                    ) {
                        chart.pop ();
                        if (!item || readVarsSubst (item.follows, [], [])) {
                            if (!item.subStep && item.parent) {
                                var tmpItem = item.parent;
                                if (tmpItem.phase === "whole" || tmpItem.phase === "parsed") {
                                    if (!(tmpItem.follows && tmpItem.follows[1] && tmpItem.follows[1].branches)) {
                                        tmpItem.follows = [tmpItem.follows, {branches: []}];
                                    }
                                    tmpItem.follows[1].branches.push ({segment: rules[item.ruleIndex].segment, ruleIndex: item.ruleIndex, follows: item.follows});
                                    tmpItem.descendRule = -1;
                                    tmpItem.phase = "parsed";
                                }
                                else {
                                    tmpItem.follows[tmpItem.index] = item.follows;
                                    tmpItem.descendRule = -1;
                                    tmpItem.index++;
                                }
                            }
                            else {
                                level--;
                                if (item.parent) {
                                    var tmpItem = item.parent;
                                    tmpItem.follows = item.follows;
                                    var tmpInput = extractResult (item.follows, undefined);
                                    var tmpRead = rules[item.ruleIndex].rule.read[0];
                                    if (!tmpRead) {
                                        tmpRead = [];
                                    }
                                    
                                    var vi = item.varIndex;
                                    var tmpWriteEx = undefined;
                                    var vars = Ruler.getVars(rules[item.ruleIndex].vars, vi);
                                    if (Ruler.arrayMatch (tmpInput, tmpRead, vars, vi)) {
                                        var tmpWrite = Ruler.substVars (vars, rules[item.ruleIndex].rule.write[0], vi);
                                        if (vars) {
                                            tmpWriteEx = Ruler.substVars (vars, rules[item.ruleIndex].rule.write[0], vi, true);
                                        }
                                    }
                                    else {
                                        var tmpWrite =  ["FAILURE"];
                                    }
                                    
                                    chart.push ({parent: tmpItem, ruleIndex: item.ruleIndex, descendRule: -1, vars: rules[item.ruleIndex].vars, varIndex: vi, write: tmpWrite, writeEx: tmpWriteEx, input: item.tmpInput, index: 0, phase: "whole", follows: item.follows});
                                }
                                else {
                                    //return item.follows; // success
                                    //if (!ret) {
                                        ret = item.follows;
                                        break;
                                    //}
                                }
                            }
                        }
                    }
                    else if (item.phase === "whole") {
                        if (item.descendRule + 1 < rules.length) {
                            item.descendRule++;
                            chart.push ({subStep: true, parent: item, ruleIndex: item.descendRule, descendRule: -1, vars: rules[item.descendRule].vars, varIndex: varIndex, write: item.write, writeEx: item.writeEx, input: rules[item.descendRule].rule.read[0], index: 0, phase: "parts", follows: [], tmpInput: item.input});
                            if (rules[item.descendRule].vars.length > 0) {
                                varIndex++;
                            }
                        } else {
                            item.descendRule = -1;
                            item.index = 0;
                            item.follows = [];
                            item.phase = "parts";
                        }
                    }
                    else if (
                        item.phase === "parts" &&
                        item.write &&
                        item.input && item.index < item.input.length &&
                        item.vars && item.vars.indexOf (item.input[item.index]) > -1
                    ) {
                        item.follows[item.index] = {var: item.input[item.index] + "[" + item.varIndex + "]", val: we ? we[item.index] : item.write[item.index]};
                        item.index++;
                        item.descendRule = -1;
                    }
                    else if (
                        item.phase === "parts" &&
                        item.descendRule + 1 < rules.length && item.write && item.input && item.index < item.input.length &&
                        Array.isArray(item.write[item.index]) && Array.isArray(item.input[item.index])
                    ) {
                        //item.descendRule++;
                        item.descendRule = rules.length;
                        chart.push ({parent: item, ruleIndex: item.descendRule, descendRule: -1, vars: item.vars, varIndex: item.varIndex, write: item.write[item.index], writeEx: we ? we[item.index] : undefined, input: item.input[item.index], index: 0, phase: "whole", follows: []});
                    }
                    else if (
                        item.phase === "parts" &&
                        item.write && item.input && item.index < item.input.length &&
                        item.write[item.index] === item.input[item.index]
                    ) {
                        if (item.writeEx && item.writeEx.var && !item.follows.var) {
                            item.follows = {var: item.writeEx.var, val: []};
                        }
                        else if (item.writeEx && (item.writeEx[item.index] && item.writeEx[item.index].var) && !item.follows.var) {
                            item.follows[item.index] = {var: item.writeEx[item.index].var, val: undefined};
                        }
                        
                        if (item.follows.var) {
                            item.follows.val[item.index] = item.write[item.index];
                        }
                        else if (item.follows[item.index] && item.follows[item.index].var) {
                            item.follows[item.index].val = item.write[item.index];
                        }
                        else {
                            item.follows[item.index] = item.write[item.index];
                        }
                        
                        item.index++;
                        item.descendRule = -1;
                    }
                    else {
                        chart.pop ();
                    }
                }
                
                if (ret) {
                    return ret; // success
                }
                else {
                    return ["FAILURE"]; // failure
                }
            }

            var exactMatch = function (arr1, arr2) {
                while (arr1.var) {
                    arr1 = arr1.val;
                }
                
                while (arr2.var) {
                    arr2 = arr2.val;
                }

                if (arr1 === arr2) {
                    return true;
                }
                else if (Array.isArray (arr1) && Array.isArray (arr2) && arr1.length === arr2.length) {
                    for (var i = 0; i < arr1.length; i++) {
                        if (!exactMatch (arr1[i], arr2[i])) {
                            return false;
                        }
                    }
                    
                    if (i === arr1.length) {
                        return true;
                    }
                }
                else if (arr1.branches && arr2.branches) {
                    return exactMatch (arr1.branches[0].follows, arr2.branches[0].follows);
                }

                return false;
            }
            
            var deeperMatch = function (arr1, arr2) {
                while (arr1.var) {
                    arr1 = arr1.val;
                }
                
                while (arr2.var) {
                    arr2 = arr2.val;
                }

                if (arr1 === arr2) {
                    return true;
                }
                else if (
                    Array.isArray (arr1) && Array.isArray (arr2) &&
                    arr2[0] && arr2[1] && deeperMatch (arr1, arr2[0]) && arr2[1].branches
                ) {
                    return true;
                }
                else if (Array.isArray (arr2) && arr2[0] && arr2[1] && arr1 === arr2[0] && arr2[1].branches) {
                    return true;
                }
                else if (Array.isArray (arr1) && Array.isArray (arr2) && arr1.length === arr2.length) {
                    for (var i = 0; i < arr1.length; i++) {
                        if (!deeperMatch (arr1[i], arr2[i])) {
                            return false;
                        }
                    }
                    
                    if (i === arr1.length) {
                        return true;
                    }
                }
                else if (arr1.branches && arr2.branches) {
                    return deeperMatch (arr1.branches[0].follows, arr2.branches[0].follows);
                }

                return false;
            }
            
            var assignVar = function (varbl, val, append, vars, propgs, devars) {
                var cond;
                if (vars[varbl]) {
                    if (devars[varbl]) {
                        cond = exactMatch (vars[varbl], (append ? [val, append] : val));
                    }
                    else {
                        cond = deeperMatch (vars[varbl], (append ? [val, append] : val));
                    }

                    if (cond) {
                        if (val.var && propgs[varbl].indexOf (val.var) === -1) {
                            propgs[varbl].push (val.var);
                        }

                        for (var i = 0; i < propgs[varbl].length; i++) {
                            if (!assignVar (propgs[varbl][i], (val.var ? val.val : val), append, vars, propgs, devars)) {
                                return false;
                            }
                        }

                        vars[varbl] = (append ? [val, append] : val);
                        devars[varbl] = (append ? [val, append] : val);
                        
                        return true;
                    }
                    /*
                    else if (deeperMatch ((append ? [val, append] : val), vars[varbl])) {
                        return true;
                    }
                    */
                    else {
                        return false;
                    }
                }
                else {
                    propgs[varbl] = [];
                    if (val.var) {
                        propgs[varbl].push (val.var);
                        if (!assignVar (val.var, val.val, append, vars, propgs, devars)) {
                            return false;
                        }
                    }

                    vars[varbl] = (append ? [val, append] : val);
                    devars[varbl] = (append ? [val, append] : val);
                    
                    return readVarsSubst ((append ? [val, append] : val), vars, propgs, devars);
                }
            }
            
            var readVarsSubst = function (item, vars, propgs, devars) {
                if (!devars) {
                    devars = [];
                }
                
                if (item.branches) {
                    return readVarsSubst (item.branches[0].follows, vars, propgs, []);
                }
                else if (item.var) {
                    if (!assignVar (item.var, item.val, null, vars, propgs, devars)) {
                        return false;
                    }
                }
                else if (Array.isArray (item)) {
                    if (item[0] && item[0].var && item[1] && item[1].branches) {
                        if (!assignVar (item[0].var, item[0].val, item[1], vars, propgs, devars)) {
                            return false;
                        }
                    }
                    else {
                        for (var i = 0; i < item.length; i++) {
                            ret = readVarsSubst (item[i], vars, propgs, devars);
                            if (!ret)
                                return false;
                        }
                    }
                }
                
                return true;
            }

            var writeVarsSubst = function (arr, vars) {
                if (!arr) {
                    return null;
                }
                else if (!vars) {
                    return arr;
                }
                else {
                    var ret;
                    if (Array.isArray (arr)) {
                        ret = [];
                        for (var i = 0; i < arr.length; i++) {
                            ret.push (writeVarsSubst (arr[i], vars));
                        }
                    }
                    else if (arr.branches) {
                        ret = {branches: [{segment: arr.branches[0].segment, ruleIndex: arr.branches[0].ruleIndex, follows: writeVarsSubst (arr.branches[0].follows, vars)}]};
                    }
                    else if (vars[arr.var]) {
                        if (arr.val.val) {
                            ret = {var: arr.var, val: {var: arr.val.var, val: writeVarsSubst (vars[arr.val.var], vars)}/*, unified: true*/}
                        }
                        else {
                            ret = {var: arr.var, val: writeVarsSubst (vars[arr.var], vars)/*, unified: true*/};
                        }
                    }
                    else {
                        ret = arr;
                    }
                    
                    return ret;
                }
            }
            
            var substAllVars = function (input) {
                var vars = [];
                readVarsSubst (input, vars, []);
                return writeVarsSubst (input, vars);
            }

            var applySingleRule = function (rules, input) {
                var vars = Ruler.getVars(rules[0].vars, 0);
                if (Ruler.arrayMatch (input, rules[0].rule.read[0], vars, 0)) {
                    return Ruler.substVars (vars, rules[0].rule.write[0], 0);
                }
                else {
                    return ["FAILURE"];
                }
            }

            var extractResult = function (proof, seg) {
                var traverse = function (loop, seg) {
                    if (!loop) {
                        return loop;
                    }
                    else if (loop[1] && loop[1].branches) {
                        return extractResult (loop, seg);
                    }
                    else if (loop[1] && loop[1].segment) {
                        return extractResult (loop, seg);
                    }
                    else if (Array.isArray (loop)) {
                        var ret = [];
                        for (var i = 0; i < loop.length; i++) {
                            ret.push (traverse (loop[i], seg));
                        }
                        return ret;
                    }
                    else if (loop && loop.var) {
                        return traverse (loop.val);
                    }
                    else {
                        return loop;
                    }
                }
                
                var loop = proof
                while (loop[1] && loop[1].branches && (loop[1].branches[0].segment === seg || (seg === undefined))) {
                    loop = loop[1].branches[0].follows
                }
                while (loop[1] && loop[1].segment !== undefined && (loop[1].segment === seg || (seg === undefined))) {
                    loop = loop[1].follows;
                }
                
                if (loop[1] && loop[1].branches) {
                    return traverse (loop[0], seg);
                }
                else if (loop[1] && loop[1].segment) {
                    return traverse (loop[0], seg);
                }
                else {
                    return traverse (loop, seg);
                }
            }
            
            var ret = null;
            if (rules[0] === "REWRITE") {
                if (phase === "FWD") {
                    var rules = getRules (rules[1], "FWD", "ITYPE");
                    var proof = prove (rules, input);
                    var substed = substAllVars (proof);
                    var ret = extractResult (substed, "ITYPE");
                }
                else if (phase === "BWD") {
                    var rules = getRules (rules[2], "BWD", "IOCHAIN").concat (getRules (rules[3], "BWD", "OTYPE"));
                    var proof = prove (rules, input);
                    var substed = substAllVars (proof);
                    var ret = extractResult (substed, "OTYPE");
                }
            }
            else if (rules[0] === "RULE" || rules[0] === "MATCH") {
                var rules = getRules (["SINGLE-RULE", rules], "FWD", "SINGLE-RULE");
                var ret = applySingleRule (rules, input);
                var substed = [input, {segment: "SINGLE-RULE", ruleIndex: 0, follows: ret}];
            }
            
            return (ret[0] !== "FAILURE" ? {output: ret, rules: rules, proof: substed} : {err: {indexes: [0]}});
        }
        
        return {
            rewrite: rewrite
        }
    }) ()
);
