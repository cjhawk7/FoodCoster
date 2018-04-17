exports.DATABASE_URL = process.env.DATABASE_URL ||
                      'mongodb://localhost/makeRequest';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
                      'mongodb://localhost/test-makeRequest';
exports.PORT = process.env.PORT || 8080;