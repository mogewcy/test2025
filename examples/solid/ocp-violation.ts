// 违反开闭原则的示例
// 每次添加新的形状都需要修改 AreaCalculator 类

class Rectangle {
    constructor(public width: number, public height: number) {}
}

class Circle {
    constructor(public radius: number) {}
}

class Triangle {
    constructor(
        public base: number,
        public height: number
    ) {}
}

// 违反开闭原则的计算器
class AreaCalculator {
    calculateArea(shape: Rectangle | Circle | Triangle): number {
        // 每添加一个新的形状，都需要修改这个方法
        if (shape instanceof Rectangle) {
            return shape.width * shape.height;
        } 
        else if (shape instanceof Circle) {
            return Math.PI * shape.radius * shape.radius;
        }
        else if (shape instanceof Triangle) {
            return (shape.base * shape.height) / 2;
        }
        
        throw new Error('Unknown shape');
    }
}

// 使用示例
const calculator = new AreaCalculator();
const rectangle = new Rectangle(5, 10);
const circle = new Circle(7);
const triangle = new Triangle(4, 6);

console.log(calculator.calculateArea(rectangle)); // 50
console.log(calculator.calculateArea(circle));    // 153.93...
console.log(calculator.calculateArea(triangle));  // 12

// 如果要添加新的形状（比如椭圆），需要：
// 1. 创建新的形状类
// 2. 修改 AreaCalculator 类的 calculateArea 方法
// 这违反了开闭原则，因为需要修改现有的代码而不是扩展它

class Ellipse {
    constructor(
        public majorAxis: number,
        public minorAxis: number
    ) {}
}

// 需要修改现有的 AreaCalculator 类
class UpdatedAreaCalculator extends AreaCalculator {
    calculateArea(shape: Rectangle | Circle | Triangle | Ellipse): number {
        if (shape instanceof Ellipse) {
            return Math.PI * shape.majorAxis * shape.minorAxis;
        }
        return super.calculateArea(shape as any);
    }
}