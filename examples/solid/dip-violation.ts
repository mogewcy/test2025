// 违反依赖倒置原则的示例
// 高层模块直接依赖低层模块，而不是依赖抽象

// 低层模块：具体的数据存储实现
class MySQLDatabase {
    save(data: any): void {
        console.log('Saving data to MySQL database:', data);
    }

    delete(id: string): void {
        console.log('Deleting data from MySQL database, id:', id);
    }

    update(id: string, data: any): void {
        console.log('Updating data in MySQL database:', { id, data });
    }

    fetch(id: string): any {
        console.log('Fetching data from MySQL database, id:', id);
        return { id, someData: 'test' };
    }
}

// 低层模块：具体的通知实现
class EmailNotifier {
    sendNotification(to: string, message: string): void {
        console.log(`Sending email to ${to}: ${message}`);
    }
}

// 低层模块：具体的日志实现
class FileLogger {
    log(message: string): void {
        console.log(`Writing to log file: ${message}`);
    }
}

// 高层模块：直接依赖具体实现而不是抽象
class UserService {
    private database: MySQLDatabase;
    private notifier: EmailNotifier;
    private logger: FileLogger;

    constructor() {
        // 直接实例化具体类，违反DIP
        this.database = new MySQLDatabase();
        this.notifier = new EmailNotifier();
        this.logger = new FileLogger();
    }

    createUser(userData: any): void {
        try {
            // 直接使用具体的MySQL实现
            this.database.save(userData);
            
            // 直接使用具体的邮件通知实现
            this.notifier.sendNotification(
                userData.email,
                'Welcome to our platform!'
            );
            
            // 直接使用具体的文件日志实现
            this.logger.log(`User created: ${userData.email}`);
        } catch (error) {
            // 直接使用具体的文件日志实现
            this.logger.log(`Error creating user: ${error.message}`);
            throw error;
        }
    }

    deleteUser(userId: string): void {
        try {
            const user = this.database.fetch(userId);
            this.database.delete(userId);
            this.notifier.sendNotification(
                user.email,
                'Your account has been deleted'
            );
            this.logger.log(`User deleted: ${userId}`);
        } catch (error) {
            this.logger.log(`Error deleting user: ${error.message}`);
            throw error;
        }
    }

    updateUser(userId: string, userData: any): void {
        try {
            this.database.update(userId, userData);
            const user = this.database.fetch(userId);
            this.notifier.sendNotification(
                user.email,
                'Your account has been updated'
            );
            this.logger.log(`User updated: ${userId}`);
        } catch (error) {
            this.logger.log(`Error updating user: ${error.message}`);
            throw error;
        }
    }
}

// 使用示例
const userService = new UserService();

// 创建用户
userService.createUser({
    email: 'test@example.com',
    name: 'Test User'
});

// 更新用户
userService.updateUser('123', {
    email: 'test@example.com',
    name: 'Updated Name'
});

// 删除用户
userService.deleteUser('123');

// 问题：
// 1. UserService 直接依赖具体实现（MySQLDatabase, EmailNotifier, FileLogger）
// 2. 难以切换到其他实现（如 MongoDB, SMSNotifier, ConsoleLogger）
// 3. 难以进行单元测试（无法mock依赖）
// 4. 代码耦合度高，难以维护和扩展