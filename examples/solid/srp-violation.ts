// 违反单一职责原则的示例
// 这个类承担了太多的职责：用户管理、邮件发送、日志记录

class UserManager {
    private users: any[] = [];

    // 用户管理功能
    addUser(user: any) {
        // 验证用户
        if (!this.validateUser(user)) {
            throw new Error('Invalid user data');
        }

        // 保存用户
        this.users.push(user);

        // 发送欢迎邮件
        this.sendWelcomeEmail(user);

        // 记录日志
        this.logUserActivity('User added: ' + user.email);
    }

    private validateUser(user: any): boolean {
        // 验证邮箱
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            return false;
        }

        // 验证密码
        if (user.password.length < 8) {
            return false;
        }

        return true;
    }

    // 邮件功能
    private sendWelcomeEmail(user: any) {
        const emailContent = `Welcome ${user.name}!
            Thank you for joining our platform.
            Best regards,
            The Team`;
        
        // 直接处理邮件发送逻辑
        console.log(`Sending email to ${user.email}`);
        // 处理SMTP配置
        // 处理邮件模板
        // 处理发送失败重试
    }

    // 日志功能
    private logUserActivity(activity: string) {
        const timestamp = new Date().toISOString();
        // 直接处理日志记录逻辑
        console.log(`${timestamp}: ${activity}`);
        // 处理日志文件
        // 处理日志轮转
        // 处理日志清理
    }

    // 用户查询功能
    findUser(email: string) {
        return this.users.find(user => user.email === email);
    }

    // 用户统计功能
    getUserStats() {
        return {
            total: this.users.length,
            active: this.users.filter(user => user.isActive).length,
            inactive: this.users.filter(user => !user.isActive).length
        };
    }
}