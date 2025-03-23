// 糟糕的变量命名
var x = 1;
var y = 2;
var z = 3;

// 超长且难以理解的一行代码
function doStuff(a,b,c,d,e,f){return a&&b||c&&d?(e>f?a+b:c-d)*e/f:a+b+c+d*e/f+Math.random()*100-50+new Date().getTime();}

// 不必要的全局变量
globalThis.DATA = [];
globalThis.FLAG = true;
globalThis.TEMP = null;

// 糟糕的错误处理
function processData() {
    try {
        // 一些操作
    } catch(e) {
        // 空的 catch 块，完全忽略错误
    }
}

// 重复的代码块
function calculate1(num) {
    let result = num * 2;
    result = result + 100;
    result = result / 3;
    result = result * 1.5;
    return result;
}

function calculate2(num) {
    let result = num * 2;
    result = result + 100;
    result = result / 3;
    result = result * 1.5;
    return result;
}

// 魔法数字
function calculatePrice(quantity) {
    return quantity * 1.08 * 1.15 * 0.95 * 299.99;
}

// 嵌套过深的条件语句
function checkConditions(a, b, c) {
    if(a) {
        if(b) {
            if(c) {
                if(a > b) {
                    if(b < c) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}
