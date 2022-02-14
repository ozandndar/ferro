class AppError extends Error {
    constructor(message, status) {
        super(message);
        this.message = message;
        this.status = status;
        this.statusText = `${status}`.startsWith('4') ? 'Bad Request' : 'Internal Server Error';
    }
}

module.exports = AppError;