// 1. 混乱的类型定义和any的滥用
type t = any;
interface i {
    a: any;
    b: any;
    c: any;
}

// 2. 不合理的类名和文件名
class Mgr {
    private d: any;
    constructor() { this.d = []; }
    // 3. 方法名称不清晰
    public exec() {
        return this.d;
    }
}

// 4. 混合使用var、let和const，代码风格不统一
var userAge = 25;
let userName = "test";
const USER_SCORE = 100;

// 5. 简化条件判断逻辑
let result;
if (condition1) {
    if (condition2) {
        result = condition3 ? value1 : value2;
    } else {
        result = condition4 ? value3 : value4;
    }
} else {
    result = value5;
}

// 6. 糟糕的异步代码处理
function loadData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(fetch('https://api.example.com/data')
                .then(res => res.json())
                .then(data => data)
                .catch(() => {})
            );
        }, 1000);
    });
}

// 7. 过度复杂的正则表达式没有注释
const regex = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))$/;

// 8. 硬编码的配置信息
const dbConfig = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "123456",
    database: "test"
};

// 9. 不合理的数组和对象操作
function processArray(arr: any[]) {
    for(var i = 0; i < arr.length; i++) {
        arr[i] = arr[i] + 1;
        if(arr[i] > 10) arr[i] = 10;
        if(arr[i] < 0) arr[i] = 0;
        arr[i] = Math.floor(arr[i]);
        // 多次修改同一个值，难以追踪
    }
}

// 10. 不恰当的注释
// 这个函数用来处理数据
// 输入是一个数组
// 返回处理后的结果
function process(input: any) {
    let temp = input; // 临时变量
    return temp; // 返回结果
}

// 11. 过度复杂的switch语句
function handleStatus(status: string) {
    switch(status.toLowerCase()) {
        case 'pending':
            return 1;
        case 'processing':
            return 2;
        case 'processed':
            return 3;
        case 'completed':
            return 4;
        case 'failed':
            return 5;
        case 'cancelled':
            return 6;
        case 'rejected':
            return 7;
        default:
            return 0;
    }
}

// 12. 不合理的循环嵌套
function processMatrix(matrix: number[][]) {
    for(let i = 0; i < matrix.length; i++) {
        for(let j = 0; j < matrix[i].length; j++) {
            for(let k = 0; k < matrix[i][j]; k++) {
                // 三层循环，性能差
                console.log(i, j, k);
            }
        }
    }
}

// 13. 重复的事件监听器添加
document.addEventListener('click', () => console.log('clicked'));
document.addEventListener('click', () => console.log('clicked again'));
document.addEventListener('click', () => console.log('clicked once more'));

// 14. 不安全的类型转换
function convertValue(value: any): number {
    return +value || 0;
}

// 15. 内存泄漏风险的代码
class MemoryLeakExample {
    private handlers: Function[] = [];
    
    public addHandler() {
        this.handlers.push(() => {
            console.log('This might cause memory leak');
        });
    }
    // 没有提供移除handler的方法
} 