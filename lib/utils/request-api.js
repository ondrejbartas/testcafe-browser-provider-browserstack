'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.default = function (apiPath) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!process.env['BROWSERSTACK_USERNAME'] || !process.env['BROWSERSTACK_ACCESS_KEY']) throw new Error(AUTH_FAILED_ERROR);

    var url = apiPath.url;

    var body = params.body,
        executeImmediately = params.executeImmediately,
        queryParams = (0, _objectWithoutProperties3.default)(params, ['body', 'executeImmediately']);


    var opts = {
        auth: {
            user: process.env['BROWSERSTACK_USERNAME'],
            pass: process.env['BROWSERSTACK_ACCESS_KEY']
        },

        qs: (0, _extends3.default)({}, queryParams),

        method: apiPath.method || 'GET',
        json: apiPath.encoding === void 0
    };

    if (body) opts.body = body;

    if (apiPath.encoding !== void 0) opts.encoding = apiPath.encoding;

    var chainPromise = executeImmediately ? _pinkie2.default.resolve(null) : apiRequestPromise;

    var currentRequestPromise = chainPromise.then(function () {
        return (0, _requestPromise2.default)(url, opts);
    }).catch(function (error) {
        if (error.statusCode === 401) throw new Error(AUTH_FAILED_ERROR);

        throw error;
    });

    if (executeImmediately) {
        var result = null;

        currentRequestPromise = currentRequestPromise.then(function (promiseResult) {
            result = promiseResult;
        }).then(function () {
            return (0, _delay2.default)(API_REQUEST_DELAY);
        }).then(function () {
            return result;
        });
    } else apiRequestPromise = currentRequestPromise.then(function () {
        return (0, _delay2.default)(API_REQUEST_DELAY);
    });

    return currentRequestPromise;
};

var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _delay = require('./delay');

var _delay2 = _interopRequireDefault(_delay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AUTH_FAILED_ERROR = 'Authentication failed. Please assign the correct username and access key ' + 'to the BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY environment variables.';

var API_REQUEST_DELAY = 100;

var apiRequestPromise = _pinkie2.default.resolve(null);

module.exports = exports['default'];