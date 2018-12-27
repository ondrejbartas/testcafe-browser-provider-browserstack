'use strict';

exports.__esModule = true;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.default = function (apiPath, params) {
    if (!process.env['BROWSERSTACK_USERNAME'] || !process.env['BROWSERSTACK_ACCESS_KEY']) throw new Error(AUTH_FAILED_ERROR);

    var url = apiPath.url;

    var opts = {
        auth: {
            user: process.env['BROWSERSTACK_USERNAME'],
            pass: process.env['BROWSERSTACK_ACCESS_KEY']
        },

        qs: (0, _assign2.default)({}, BUILD_ID && { build: BUILD_ID }, PROJECT_NAME && { project: PROJECT_NAME }, params),

        method: apiPath.method || 'GET',
        json: !apiPath.binaryStream
    };

    if (apiPath.binaryStream) opts.encoding = null;

    var currentRequestPromise = apiRequestPromise.then(function () {
        return (0, _requestPromise2.default)(url, opts);
    }).catch(function (error) {
        if (error.statusCode === 401) throw new Error(AUTH_FAILED_ERROR);

        throw error;
    });

    apiRequestPromise = currentRequestPromise.then(function () {
        return (0, _delay2.default)(API_REQUEST_DELAY);
    });

    return currentRequestPromise;
};

var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _delay = require('./utils/delay');

var _delay2 = _interopRequireDefault(_delay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BUILD_ID = process.env['BROWSERSTACK_BUILD_ID'];
var PROJECT_NAME = process.env['BROWSERSTACK_PROJECT_NAME'];

var AUTH_FAILED_ERROR = 'Authentication failed. Please assign the correct username and access key ' + 'to the BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY environment variables.';

var API_REQUEST_DELAY = 100;

var apiRequestPromise = _pinkie2.default.resolve(null);

module.exports = exports['default'];