exports.DATABASE_URL = process.env.DATABASE_URL ||
                      'mongodb://localhost/makeNumbeoRequest';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
                      'mongodb://localhost/test-makeNumbeoRequest';
exports.PORT = process.env.PORT || 8080;