// 违反里氏替换原则的示例
// 子类违反了父类的契约

class Bird {
    fly(altitude: number): void {
        console.log(`Flying at ${altitude} meters`);
    }
}

// 企鹅是鸟类，但不能飞
class Penguin extends Bird {
    fly(altitude: number): void {
        // 违反了父类的契约，企鹅不能飞
        throw new Error('Penguins cannot fly!');
    }
}

// 另一个违反LSP的例子：矩形和正方形
class Rectangle {
    protected width: number;
    protected height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    setWidth(width: number): void {
        this.width = width;
    }

    setHeight(height: number): void {
        this.height = height;
    }

    getArea(): number {
        return this.width * this.height;
    }
}

// 正方形继承矩形，但违反了LSP
class Square extends Rectangle {
    constructor(size: number) {
        super(size, size);
    }

    // 违反LSP：改变了父类的行为
    setWidth(width: number): void {
        this.width = width;
        this.height = width; // 正方形的宽高必须相等
    }

    setHeight(height: number): void {
        this.width = height; // 正方形的宽高必须相等
        this.height = height;
    }
}

// 使用示例
function testRectangle(rectangle: Rectangle) {
    rectangle.setWidth(5);
    rectangle.setHeight(4);
    
    // 期望面积为20
    if (rectangle.getArea() !== 20) {
        console.log('Area calculation failed!');
        console.log(`Actual area: ${rectangle.getArea()}`);
    }
}

// 测试矩形
const rectangle = new Rectangle(2, 3);
testRectangle(rectangle); // 正常工作

// 测试正方形
const square = new Square(2);
testRectangle(square); // 违反LSP：正方形的行为与预期不符

// 另一个违反LSP的例子：电子支付
class Payment {
    processPayment(amount: number): void {
        console.log(`Processing payment of ${amount}`);
    }

    refund(amount: number): void {
        console.log(`Refunding ${amount}`);
    }
}

// 某些支付方式可能不支持退款
class CashPayment extends Payment {
    refund(amount: number): void {
        // 违反LSP：现金支付不支持退款操作
        throw new Error('Cash payments cannot be refunded automatically');
    }
}