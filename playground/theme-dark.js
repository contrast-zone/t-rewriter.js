ace.define("ace/theme/dark",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-solarized-dark";
exports.cssText = ".ace-solarized-dark .ace_gutter {\
background: #101010;\
color: #f0f0f0\
}\
.ace-solarized-dark .ace_print-margin {\
width: 1px;\
background: #555555\
}\
.ace-solarized-dark {\
background-color: #101010;\
color: #D9D9D9\
}\
.ace-solarized-dark .ace_entity.ace_other.ace_attribute-name,\
.ace-solarized-dark .ace_storage {\
color: #A1A1A1\
}\
.ace-solarized-dark .ace_cursor,\
.ace-solarized-dark .ace_string.ace_regexp {\
color: #D3D3D3\
}\
.ace-solarized-dark .ace_marker-layer .ace_active-line,\
.ace-solarized-dark .ace_marker-layer .ace_selection {\
background: rgba(255, 255, 255, 0.08)\
}\
.ace-solarized-dark.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #2B2B2B;\
}\
.ace-solarized-dark .ace_marker-layer .ace_step {\
background: rgb(82, 82, 82)\
}\
.ace-solarized-dark .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgba(161, 161, 161, 0.50)\
}\
.ace-solarized-dark .ace_gutter-active-line {\
background-color: #101010\
}\
.ace-solarized-dark .ace_marker-layer .ace_selected-word {\
border: 1px solid #f0f0f0\
color: #272727\
}\
.ace-solarized-dark .ace_invisible {\
color: rgba(161, 161, 161, 0.50)\
}\
.ace-solarized-dark .ace_keyword,\
.ace-solarized-dark .ace_meta,\
.ace-solarized-dark .ace_support.ace_class,\
.ace-solarized-dark .ace_support.ace_type {\
color: #999999\
}\
.ace-solarized-dark .ace_constant.ace_character,\
.ace-solarized-dark .ace_constant.ace_other {\
color: #4B4B4B\
}\
.ace-solarized-dark .ace_constant.ace_language {\
color: #898989\
}\
.ace-solarized-dark .ace_constant.ace_numeric {\
color: #828282\
}\
.ace-solarized-dark .ace_fold {\
background-color: #8B8B8B;\
border-color: #A1A1A1\
}\
.ace-solarized-dark .ace_entity.ace_name.ace_function,\
.ace-solarized-dark .ace_entity.ace_name.ace_tag,\
.ace-solarized-dark .ace_support.ace_function,\
.ace-solarized-dark .ace_variable,\
.ace-solarized-dark .ace_variable.ace_language {\
color: #8B8B8B\
}\
.ace-solarized-dark .ace_string {\
color: #A1A1A1\
}\
.ace-solarized-dark .ace_comment {\
font-style: italic;\
color: #7B7B7B\
}\
.ace-solarized-dark .ace_indent-guide {\
background: url( data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAvHpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjaVVDbDcMgDPz3FB3Br4AZhyhU6gYdvwZME07CjzPYZ6B9P294dTAy6JEtlZTQoUULVw8MJ8qwhDosRrb8xgNyFNgpcS8zzTXuV+eP+8GaQefOg0WFLRrRv/GA9Mk9vp4inefJk0aj0maQiuWn1HMpXbD7qO1r9hw2IvsvXYcPEuYmJDisTQXSD0l1r25Jst+jEbMojMJayT9kW492UfADaahTxP0s7GgAAAGFaUNDUElDQyBwcm9maWxlAAB4nH2RPUjDQBzFXz+0ohURO0hxyFCdLIiKOGoVilAh1AqtOphc+iE0aUhSXBwF14KDH4tVBxdnXR1cBUHwA8TNzUnRRUr8X1JoEePBcT/e3XvcvQP89TJTzeAYoGqWkU4mhGxuRQi9Ioh+9KATUYmZ+qwopuA5vu7h4+tdnGd5n/tz9Cp5kwE+gXiG6YZFvE48tWnpnPeJI6wkKcTnxKMGXZD4keuyy2+ciw77eWbEyKTniCPEQrGN5TZmJUMlniSOKapG+f6sywrnLc5qucqa9+QvDOe15SWu0xxCEgtYhAgBMqrYQBkW4rRqpJhI037Cwx91/CK5ZHJtgJFjHhWokBw/+B/87tYsTIy7SeEE0PFi2x/DQGgXaNRs+/vYthsnQOAZuNJa/kodmP4kvdbSYkdA3zZwcd3S5D3gcgcYfNIlQ3KkAE1/oQC8n9E35YCBW6B71e2tuY/TByBDXaVugINDYKRI2Wse7+5q7+3fM83+fgAMpHJ+sZ670wAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+UEEQwYF5+qUlEAAAASSURBVAjXY1BTU/NlEhER2QQABtgBsJDr2HAAAAAASUVORK5CYII=) right repeat-y\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});                (function() {
                    ace.require(["ace/theme/solarized_dark"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            
/*
ace.define("ace/theme/solarized_dark",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-solarized-dark";
exports.cssText = ".ace-solarized-dark .ace_gutter {\
background: #01313f;\
color: #d0edf7\
}\
.ace-solarized-dark .ace_print-margin {\
width: 1px;\
background: #33555E\
}\
.ace-solarized-dark {\
background-color: #002B36;\
color: #93A1A1\
}\
.ace-solarized-dark .ace_entity.ace_other.ace_attribute-name,\
.ace-solarized-dark .ace_storage {\
color: #93A1A1\
}\
.ace-solarized-dark .ace_cursor,\
.ace-solarized-dark .ace_string.ace_regexp {\
color: #D30102\
}\
.ace-solarized-dark .ace_marker-layer .ace_active-line,\
.ace-solarized-dark .ace_marker-layer .ace_selection {\
background: rgba(255, 255, 255, 0.1)\
}\
.ace-solarized-dark.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #002B36;\
}\
.ace-solarized-dark .ace_marker-layer .ace_step {\
background: rgb(102, 82, 0)\
}\
.ace-solarized-dark .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgba(147, 161, 161, 0.50)\
}\
.ace-solarized-dark .ace_gutter-active-line {\
background-color: #0d3440\
}\
.ace-solarized-dark .ace_marker-layer .ace_selected-word {\
border: 1px solid #073642\
}\
.ace-solarized-dark .ace_invisible {\
color: rgba(147, 161, 161, 0.50)\
}\
.ace-solarized-dark .ace_keyword,\
.ace-solarized-dark .ace_meta,\
.ace-solarized-dark .ace_support.ace_class,\
.ace-solarized-dark .ace_support.ace_type {\
color: #859900\
}\
.ace-solarized-dark .ace_constant.ace_character,\
.ace-solarized-dark .ace_constant.ace_other {\
color: #CB4B16\
}\
.ace-solarized-dark .ace_constant.ace_language {\
color: #B58900\
}\
.ace-solarized-dark .ace_constant.ace_numeric {\
color: #D33682\
}\
.ace-solarized-dark .ace_fold {\
background-color: #268BD2;\
border-color: #93A1A1\
}\
.ace-solarized-dark .ace_entity.ace_name.ace_function,\
.ace-solarized-dark .ace_entity.ace_name.ace_tag,\
.ace-solarized-dark .ace_support.ace_function,\
.ace-solarized-dark .ace_variable,\
.ace-solarized-dark .ace_variable.ace_language {\
color: #268BD2\
}\
.ace-solarized-dark .ace_string {\
color: #2AA198\
}\
.ace-solarized-dark .ace_comment {\
font-style: italic;\
color: #657B83\
}\
.ace-solarized-dark .ace_indent-guide {\
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNg0Db1ZVCxc/sPAAd4AlUHlLenAAAAAElFTkSuQmCC) right repeat-y\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});                (function() {
                    ace.require(["ace/theme/solarized_dark"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
*/
