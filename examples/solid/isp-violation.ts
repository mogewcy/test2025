// 违反接口隔离原则的示例
// 创建了一个过于臃肿的接口，迫使类实现它们不需要的方法

// 一个臃肿的工作者接口
interface Worker {
    work(): void;
    eat(): void;
    sleep(): void;
    // 以下是一些并非所有工作者都需要的方法
    writeCode(): void;
    testCode(): void;
    reviewCode(): void;
    deployCode(): void;
    manageMeetings(): void;
    createReports(): void;
    performanceReview(): void;
}

// 开发人员被迫实现所有方法
class Developer implements Worker {
    work() {
        console.log('Writing and reviewing code');
    }

    eat() {
        console.log('Eating lunch at desk');
    }

    sleep() {
        console.log('Sleeping after debug');
    }

    writeCode() {
        console.log('Writing code');
    }

    testCode() {
        console.log('Testing code');
    }

    reviewCode() {
        console.log('Reviewing PRs');
    }

    deployCode() {
        console.log('Deploying to production');
    }

    // 被迫实现不相关的方法
    manageMeetings() {
        throw new Error('Developers do not manage meetings');
    }

    createReports() {
        throw new Error('Developers do not create reports');
    }

    performanceReview() {
        throw new Error('Developers do not perform reviews');
    }
}

// 经理也被迫实现所有方法
class Manager implements Worker {
    work() {
        console.log('Managing team');
    }

    eat() {
        console.log('Lunch meeting');
    }

    sleep() {
        console.log('Sleep after overtime');
    }

    // 被迫实现不相关的方法
    writeCode() {
        throw new Error('Managers do not write code');
    }

    testCode() {
        throw new Error('Managers do not test code');
    }

    reviewCode() {
        throw new Error('Managers do not review code');
    }

    deployCode() {
        throw new Error('Managers do not deploy code');
    }

    // 实际需要的方法
    manageMeetings() {
        console.log('Organizing team meetings');
    }

    createReports() {
        console.log('Creating status reports');
    }

    performanceReview() {
        console.log('Reviewing team performance');
    }
}

// 清洁工也被迫实现所有方法
class Janitor implements Worker {
    work() {
        console.log('Cleaning the office');
    }

    eat() {
        console.log('Taking lunch break');
    }

    sleep() {
        console.log('Resting after work');
    }

    // 被迫实现大量不相关的方法
    writeCode() {
        throw new Error('Janitors do not write code');
    }

    testCode() {
        throw new Error('Janitors do not test code');
    }

    reviewCode() {
        throw new Error('Janitors do not review code');
    }

    deployCode() {
        throw new Error('Janitors do not deploy code');
    }

    manageMeetings() {
        throw new Error('Janitors do not manage meetings');
    }

    createReports() {
        throw new Error('Janitors do not create reports');
    }

    performanceReview() {
        throw new Error('Janitors do not perform reviews');
    }
}

// 使用示例
function handleWorker(worker: Worker) {
    try {
        worker.work();
        worker.writeCode();     // 可能抛出错误
        worker.manageMeetings(); // 可能抛出错误
        worker.createReports();  // 可能抛出错误
    } catch (error) {
        console.error('Error occurred:', error.message);
    }
}