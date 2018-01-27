var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('admin',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Admin = (function () {
        function Admin(au) {
            this.aurelia = au;
        }
        Admin.prototype.configureRouter = function (config, router) {
            config.map([
                {
                    route: ['', 'home'],
                    name: 'statistics',
                    moduleId: 'viewmodels/admin/statistics/statistics',
                    nav: true,
                    title: 'Statistics'
                },
                { route: 'users', name: 'users', moduleId: 'viewmodels/admin/manageUsers/manageUsers', nav: true, title: 'Users' },
                {
                    route: 'tweets',
                    name: 'tweets',
                    moduleId: 'viewmodels/admin/manageTweets/manageTweets',
                    nav: true,
                    title: 'Tweets'
                },
                { route: 'logout', name: 'logout', moduleId: 'viewmodels/logout/logout', nav: true, title: 'Logout' }
            ]);
            this.router = router;
            config.mapUnknownRoutes({ redirect: '#/' });
        };
        Admin = __decorate([
            aurelia_framework_1.inject(aurelia_framework_1.Aurelia),
            __metadata("design:paramtypes", [Object])
        ], Admin);
        return Admin;
    }());
    exports.Admin = Admin;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app',["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "./services/authMessages", "./services/svc/user/updateService"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, authMessages_1, updateService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var logger = aurelia_framework_1.LogManager.getLogger('app');
    var App = (function () {
        function App(au, ea, updateService) {
            var _this = this;
            ea.subscribe(authMessages_1.LoginMessage, function (msg) {
                if (msg.success === true) {
                    if (msg.role === authMessages_1.AuthRole.USER) {
                        au.setRoot('user').then(function () {
                            _this.router.navigateToRoute('twTimeline');
                            updateService.fetchUserData(msg.id).catch(function (err) {
                                return logger.error('Error during update of user.', err);
                            });
                        });
                    }
                    if (msg.role === authMessages_1.AuthRole.ADMIN) {
                        au.setRoot('admin').then(function () {
                            _this.router.navigateToRoute('statistics');
                        });
                    }
                }
                else {
                    au.setRoot('app').then(function () {
                        _this.router.navigateToRoute('twittr');
                        if (msg.failed) {
                            ea.publish(new authMessages_1.FailedLogin(msg.role, msg.message));
                        }
                    });
                }
            });
        }
        App.prototype.configureRouter = function (config, router) {
            config.map([
                {
                    route: ['', 'home'],
                    name: 'twittr',
                    moduleId: 'viewmodels/start/notLoggedIn/notLoggedIn',
                    nav: true,
                    title: 'Twittr'
                },
                { route: 'signup', name: 'signup', moduleId: 'viewmodels/start/signup/signup', nav: true, title: 'Signup' },
                {
                    route: 'adminLogin',
                    name: 'adminLogin',
                    moduleId: 'viewmodels/start/loginAdmin/loginAdmin',
                    nav: true,
                    title: 'Admin'
                }
            ]);
            this.router = router;
            config.mapUnknownRoutes({ redirect: '#/' });
        };
        App = __decorate([
            aurelia_framework_1.inject(aurelia_framework_1.Aurelia, aurelia_event_aggregator_1.EventAggregator, updateService_1.UpdateService),
            __metadata("design:paramtypes", [aurelia_framework_1.Aurelia, aurelia_event_aggregator_1.EventAggregator, updateService_1.UpdateService])
        ], App);
        return App;
    }());
    exports.App = App;
});



define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});



define('main',["require", "exports", "./environment"], function (require, exports, environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources')
            .plugin('aurelia-validation');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('user',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var User = (function () {
        function User(au) {
            this.aurelia = au;
        }
        User.prototype.configureRouter = function (config, router) {
            config.map([
                {
                    route: ['', 'home'],
                    name: 'twTimeline',
                    moduleId: 'viewmodels/user/tweetTimeline/tweetTimeline',
                    nav: true,
                    title: 'Timeline'
                },
                {
                    route: 'settings',
                    name: 'settings',
                    moduleId: 'viewmodels/user/userSettings/userSettings',
                    nav: true,
                    title: 'Settings'
                },
                { route: 'logout', name: 'logout', moduleId: 'viewmodels/logout/logout', nav: true, title: 'Logout' }
            ]);
            this.router = router;
            config.mapUnknownRoutes({ redirect: '#/' });
        };
        User = __decorate([
            aurelia_framework_1.inject(aurelia_framework_1.Aurelia),
            __metadata("design:paramtypes", [Object])
        ], User);
        return User;
    }());
    exports.User = User;
});



define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
    }
    exports.configure = configure;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('services/FetchClient',["require", "exports", "aurelia-framework", "aurelia-fetch-client", "./fetchConfigLocal", "aurelia-path"], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1, fetchConfigLocal_1, aurelia_path_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var logger = aurelia_framework_1.LogManager.getLogger('FetchClient');
    var QueryObject = (function () {
        function QueryObject(name, value) {
            this.name = name;
            this.value = value;
        }
        return QueryObject;
    }());
    exports.QueryObject = QueryObject;
    var FetchClient = (function () {
        function FetchClient(client, fetchConfig) {
            this.fetchClient = client;
            this.fetchClient.configure(function (config) {
                config.withBaseUrl(fetchConfig.baseUrl)
                    .withDefaults({
                    mode: 'cors'
                }).withInterceptor({
                    request: function (request) {
                        if (FetchClient_1.authToken != null) {
                            request.headers.append('Authorization', "Bearer " + FetchClient_1.authToken);
                        }
                        return request;
                    },
                });
            });
        }
        FetchClient_1 = FetchClient;
        FetchClient.setAuthToken = function (token) {
            FetchClient_1.authToken = token;
        };
        FetchClient.prototype.postJSON = function (targetUrl, object) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, this.sendPost(targetUrl, aurelia_fetch_client_1.json(object))];
                });
            });
        };
        FetchClient.prototype.postForm = function (targetUrl, formData) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, this.sendPost(targetUrl, formData)];
                });
            });
        };
        FetchClient.prototype.sendPost = function (targetUrl, body) {
            return __awaiter(this, void 0, void 0, function () {
                var fetchResult, jsonResponse;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            FetchClient_1.logRequestStart(targetUrl);
                            return [4, this.fetchClient.fetch(targetUrl, {
                                    method: 'post',
                                    body: body
                                })];
                        case 1:
                            fetchResult = _a.sent();
                            if (!!fetchResult.ok) return [3, 3];
                            return [4, this.handleNotOkResponse(fetchResult)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [4, fetchResult.json()];
                        case 4:
                            jsonResponse = _a.sent();
                            FetchClient_1.logSuccess(targetUrl, fetchResult.status);
                            return [2, jsonResponse];
                    }
                });
            });
        };
        FetchClient.prototype.getText = function (targetUrl, query) {
            return __awaiter(this, void 0, void 0, function () {
                var fetchResult, result, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            FetchClient_1.logRequestStart(targetUrl);
                            return [4, this.sendGet(targetUrl, query)];
                        case 1:
                            fetchResult = _a.sent();
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4, fetchResult.text()];
                        case 3:
                            result = _a.sent();
                            return [3, 5];
                        case 4:
                            error_1 = _a.sent();
                            logger.error('Could not fetch result as text', fetchResult, error_1);
                            throw error_1;
                        case 5:
                            FetchClient_1.logSuccess(targetUrl, fetchResult.status);
                            return [2, result];
                    }
                });
            });
        };
        FetchClient.prototype.get = function (targetUrl, query) {
            return __awaiter(this, void 0, void 0, function () {
                var fetchResult, result, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            FetchClient_1.logRequestStart(targetUrl);
                            return [4, this.sendGet(targetUrl, query)];
                        case 1:
                            fetchResult = _a.sent();
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4, fetchResult.json()];
                        case 3:
                            result = _a.sent();
                            return [3, 5];
                        case 4:
                            error_2 = _a.sent();
                            logger.error('Could not fetch result as json', fetchResult, error_2);
                            throw error_2;
                        case 5:
                            FetchClient_1.logSuccess(targetUrl, fetchResult.status);
                            return [2, result];
                    }
                });
            });
        };
        FetchClient.prototype.sendGet = function (targetUrl, query) {
            return __awaiter(this, void 0, void 0, function () {
                var fetchResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.fetchClient.fetch(targetUrl + (query ? "?" + aurelia_path_1.buildQueryString(query) : ''))];
                        case 1:
                            fetchResult = _a.sent();
                            if (!fetchResult.ok) {
                                this.handleNotOkResponse(fetchResult);
                            }
                            return [2, fetchResult];
                    }
                });
            });
        };
        FetchClient.prototype.put = function (targetUrl, object) {
            return __awaiter(this, void 0, void 0, function () {
                var fetchResult, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            FetchClient_1.logRequestStart(targetUrl);
                            return [4, this.fetchClient.fetch(targetUrl, {
                                    method: 'put',
                                    body: aurelia_fetch_client_1.json(object)
                                })];
                        case 1:
                            fetchResult = _a.sent();
                            if (!fetchResult.ok) {
                                this.handleNotOkResponse(fetchResult);
                            }
                            try {
                                result = fetchResult.json();
                                FetchClient_1.logSuccess(targetUrl, fetchResult.status);
                                return [2, result];
                            }
                            catch (error) {
                                logger.error('Unable to read fetch result', error);
                                throw error;
                            }
                            return [2];
                    }
                });
            });
        };
        FetchClient.prototype.delete = function (targetUrl, query) {
            return __awaiter(this, void 0, void 0, function () {
                var fetchResult, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            FetchClient_1.logRequestStart(targetUrl);
                            return [4, this.fetchClient.fetch(targetUrl + (query ? "?" + aurelia_path_1.buildQueryString(query) : ''), {
                                    method: 'delete'
                                })];
                        case 1:
                            fetchResult = _a.sent();
                            if (!fetchResult.ok) {
                                this.handleNotOkResponse(fetchResult);
                            }
                            try {
                                result = fetchResult.json();
                                FetchClient_1.logSuccess(targetUrl, fetchResult.status);
                                return [2, result];
                            }
                            catch (error) {
                                logger.error('Unable to read fetch result', error);
                                throw error;
                            }
                            return [2];
                    }
                });
            });
        };
        FetchClient.prototype.handleNotOkResponse = function (response) {
        };
        FetchClient.logRequestStart = function (url) {
            logger.info("Started request to: [" + url + "]");
        };
        FetchClient.logSuccess = function (url, status) {
            logger.info("Received valid response for url: [" + url + "] status: [" + status + "]");
        };
        FetchClient = FetchClient_1 = __decorate([
            aurelia_framework_1.inject(aurelia_fetch_client_1.HttpClient, fetchConfigLocal_1.default),
            __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient, fetchConfigLocal_1.default])
        ], FetchClient);
        return FetchClient;
        var FetchClient_1;
    }());
    exports.FetchClient = FetchClient;
});



define('services/authMessages',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AuthRole;
    (function (AuthRole) {
        AuthRole[AuthRole["USER"] = 0] = "USER";
        AuthRole[AuthRole["ADMIN"] = 1] = "ADMIN";
    })(AuthRole = exports.AuthRole || (exports.AuthRole = {}));
    var LoginMessage = (function () {
        function LoginMessage(role, success, failed) {
            this.role = role;
            this.success = success;
            this.failed = failed;
        }
        return LoginMessage;
    }());
    exports.LoginMessage = LoginMessage;
    var FailedLogin = (function () {
        function FailedLogin(role, message) {
            this.role = role;
            this.message = message;
        }
        return FailedLogin;
    }());
    exports.FailedLogin = FailedLogin;
});



define('services/fetchConfig',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FetchConfig = (function () {
        function FetchConfig() {
            this.baseUrl = "https://node-js-twitter-backend.herokuapp.com/api/";
            this.usersPart = "users";
            this.adminsPart = "admins";
            this.tweetsPart = "tweets";
            this.imagePart = "images";
            this.authPart = "/authenticate";
        }
        return FetchConfig;
    }());
    exports.default = FetchConfig;
});



define('services/fetchConfigLocal',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FetchConfig = (function () {
        function FetchConfig() {
            this.baseUrl = "https://node-js-twitter-backend.herokuapp.com/api/";
            this.usersPart = "users";
            this.adminsPart = "admins";
            this.tweetsPart = "tweets";
            this.imagePart = "images";
            this.authPart = "/authenticate";
        }
        return FetchConfig;
    }());
    exports.default = FetchConfig;
});



define('services/timelineMessage',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SwitchToFriend = (function () {
        function SwitchToFriend(friend) {
            this.friend = friend;
        }
        return SwitchToFriend;
    }());
    exports.SwitchToFriend = SwitchToFriend;
});



define('services/updateMessages',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UpdateSuccess = (function () {
        function UpdateSuccess() {
        }
        return UpdateSuccess;
    }());
    exports.UpdateSuccess = UpdateSuccess;
    var UpdateRequest = (function () {
        function UpdateRequest(id) {
            this.id = id;
        }
        return UpdateRequest;
    }());
    exports.UpdateRequest = UpdateRequest;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('services/svc/adminService',["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "../FetchClient", "../fetchConfigLocal", "../authMessages"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, FetchClient_1, fetchConfigLocal_1, authMessages_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var logger = aurelia_framework_1.LogManager.getLogger('AdminService');
    var AdminService = (function () {
        function AdminService(ea, fetchClient, fetchConfig) {
            this.eventAggregator = ea;
            this.fetchClient = fetchClient;
            this.fetchConfig = fetchConfig;
        }
        AdminService.prototype.authenticate = function (username, password) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var authBody, authUrl;
                return __generator(this, function (_a) {
                    authBody = {
                        username: username,
                        password: password
                    };
                    authUrl = this.fetchConfig.adminsPart + this.fetchConfig.authPart;
                    this.fetchClient.postJSON(authUrl, authBody).then(function (authResult) {
                        if (authResult.success && authResult.token) {
                            FetchClient_1.FetchClient.setAuthToken(authResult.token);
                            _this.eventAggregator.publish(new authMessages_1.LoginMessage(authMessages_1.AuthRole.ADMIN, true));
                        }
                        else {
                            var loginEvent = new authMessages_1.LoginMessage(authMessages_1.AuthRole.ADMIN, false);
                            if (authResult.message) {
                                loginEvent.message = authResult.message;
                            }
                            _this.eventAggregator.publish(loginEvent);
                            throw loginEvent;
                        }
                    }).catch(function (err) {
                        if (err) {
                            logger.error('Error during authentication', err);
                        }
                        var loginEvent = new authMessages_1.LoginMessage(authMessages_1.AuthRole.ADMIN, false);
                        if (err.message) {
                            loginEvent.message = err.message;
                        }
                        _this.eventAggregator.publish(loginEvent);
                        if (err) {
                            throw err;
                        }
                    });
                    return [2];
                });
            });
        };
        AdminService = __decorate([
            aurelia_framework_1.inject(aurelia_event_aggregator_1.EventAggregator, FetchClient_1.FetchClient, fetchConfigLocal_1.default),
            __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator, FetchClient_1.FetchClient, fetchConfigLocal_1.default])
        ], AdminService);
        return AdminService;
    }());
    exports.AdminService = AdminService;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('services/svc/imageService',["require", "exports", "aurelia-framework", "../FetchClient", "../fetchConfigLocal"], function (require, exports, aurelia_framework_1, FetchClient_1, fetchConfigLocal_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var logger = aurelia_framework_1.LogManager.getLogger('ImageService');
    var ImageService = (function () {
        function ImageService(fetchClient, fetchConfig) {
            this.fetchClient = fetchClient;
            this.fetchConfig = fetchConfig;
        }
        ImageService.prototype.saveImage = function (image) {
            return __awaiter(this, void 0, void 0, function () {
                var formData, uploadResult, exception_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!image) {
                                logger.warn('Image to save was null.');
                                return [2, null];
                            }
                            formData = new FormData();
                            formData.append('image', image);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4, this.fetchClient.postForm(this.fetchConfig.imagePart, formData)];
                        case 2:
                            uploadResult = _a.sent();
                            if (uploadResult && uploadResult.public_id) {
                                return [2, uploadResult.public_id];
                            }
                            else {
                                logger.error('Img Upload result hat not expected parameters', uploadResult);
                                return [2, null];
                            }
                            return [3, 4];
                        case 3:
                            exception_1 = _a.sent();
                            logger.error('Exception during upload of image.', exception_1);
                            return [2, null];
                        case 4: return [2];
                    }
                });
            });
        };
        ImageService.prototype.getUrlForImageId = function (imageId) {
            return __awaiter(this, void 0, void 0, function () {
                var queryObj, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!imageId) {
                                logger.warn('Required image public id is null');
                                return [2, null];
                            }
                            queryObj = {
                                publicId: imageId
                            };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4, this.fetchClient.getText(this.fetchConfig.imagePart, queryObj)];
                        case 2: return [2, _a.sent()];
                        case 3:
                            err_1 = _a.sent();
                            logger.error('Exception during fetch of image url.', err_1);
                            return [2, null];
                        case 4: return [2];
                    }
                });
            });
        };
        ImageService = __decorate([
            aurelia_framework_1.inject(FetchClient_1.FetchClient, fetchConfigLocal_1.default),
            __metadata("design:paramtypes", [FetchClient_1.FetchClient, fetchConfigLocal_1.default])
        ], ImageService);
        return ImageService;
    }());
    exports.ImageService = ImageService;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('viewmodels/logout/logout',["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "../../services/authMessages", "../../services/svc/user/userData", "../../services/svc/admin/adminData"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, authMessages_1, userData_1, adminData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Logout = (function () {
        function Logout(ea, userData, adminData) {
            this.userData = userData;
            this.adminData = adminData;
            this.eventAggregator = ea;
        }
        Logout.prototype.logout = function () {
            this.adminData.allUsers = null;
            this.userData.loggedInUser = null;
            this.userData.userFriends = null;
            this.userData.allUsers = null;
            this.eventAggregator.publish(new authMessages_1.LoginMessage(null, false, false));
        };
        Logout = __decorate([
            aurelia_framework_1.inject(aurelia_event_aggregator_1.EventAggregator, userData_1.UserData, adminData_1.AdminData),
            __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator, userData_1.UserData, adminData_1.AdminData])
        ], Logout);
        return Logout;
    }());
    exports.Logout = Logout;
});



define('services/svc/tweet/tweetData',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TweetData = (function () {
        function TweetData() {
        }
        return TweetData;
    }());
    exports.TweetData = TweetData;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('services/svc/tweet/tweetDeleter',["require", "exports", "aurelia-framework", "./tweetService", "../user/userService"], function (require, exports, aurelia_framework_1, tweetService_1, userService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TweetDeleter = (function () {
        function TweetDeleter(tweetService, userService) {
            this.tweetService = tweetService;
            this.userService = userService;
        }
        TweetDeleter.prototype.deleteTweets = function (tweets, updateUsers) {
            return __awaiter(this, void 0, void 0, function () {
                var usersToUpdate;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!Array.isArray(tweets)) {
                                return [2];
                            }
                            if (!updateUsers) return [3, 2];
                            usersToUpdate = this.getUsersToUpdate(tweets);
                            return [4, this.updateUsers(usersToUpdate)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [4, this.tweetService.deleteTweets(tweets)];
                        case 3:
                            _a.sent();
                            return [2];
                    }
                });
            });
        };
        TweetDeleter.prototype.getUsersToUpdate = function (tweets) {
            if (!Array.isArray(tweets)) {
                return;
            }
            var usersToUpdate = [];
            var _loop_1 = function (tweet) {
                var user = usersToUpdate.find(function (foundUser) {
                    return foundUser.id === tweet.poster.id;
                });
                if (!user) {
                    user = tweet.poster;
                    usersToUpdate.push(user);
                }
                var tweetIndex = user.tweets.findIndex(function (foundTweet) {
                    return foundTweet.id === tweet.id;
                });
                if (tweetIndex !== -1) {
                    user.tweets.splice(tweetIndex, 1);
                }
            };
            for (var _i = 0, tweets_1 = tweets; _i < tweets_1.length; _i++) {
                var tweet = tweets_1[_i];
                _loop_1(tweet);
            }
            return usersToUpdate;
        };
        TweetDeleter.prototype.updateUsers = function (users) {
            return __awaiter(this, void 0, void 0, function () {
                var updatedUsers, _i, users_1, toUpdate;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!Array.isArray(users)) {
                                return [2];
                            }
                            updatedUsers = [];
                            for (_i = 0, users_1 = users; _i < users_1.length; _i++) {
                                toUpdate = users_1[_i];
                                updatedUsers.push(this.userService.updateUser(toUpdate, true));
                            }
                            return [4, Promise.all(updatedUsers)];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            });
        };
        TweetDeleter = __decorate([
            aurelia_framework_1.inject(tweetService_1.TweetService, userService_1.UserService),
            __metadata("design:paramtypes", [tweetService_1.TweetService, userService_1.UserService])
        ], TweetDeleter);
        return TweetDeleter;
    }());
    exports.TweetDeleter = TweetDeleter;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('services/svc/tweet/tweetService',["require", "exports", "aurelia-framework", "../../FetchClient", "../../fetchConfigLocal", "./tweetUtils", "../imageService", "../user/userData"], function (require, exports, aurelia_framework_1, FetchClient_1, fetchConfigLocal_1, tweetUtils_1, imageService_1, userData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var logger = aurelia_framework_1.LogManager.getLogger('TweetService');
    var TweetService = (function () {
        function TweetService(fetchClient, fetchConfig, imageService, ud) {
            this.imageService = imageService;
            this.fetchClient = fetchClient;
            this.fetchConfig = fetchConfig;
            this.userData = ud;
        }
        TweetService.prototype.getTweetsById = function (ids) {
            return __awaiter(this, void 0, void 0, function () {
                var plainTweets, tweets, _i, plainTweets_1, plainTweet, tweet, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4, this.fetchClient.get(this.fetchConfig.tweetsPart, { ids: ids })];
                        case 1:
                            plainTweets = _a.sent();
                            if (!Array.isArray(plainTweets)) {
                                logger.error('Fetched tweet array is no array.');
                                return [2, null];
                            }
                            tweets = [];
                            for (_i = 0, plainTweets_1 = plainTweets; _i < plainTweets_1.length; _i++) {
                                plainTweet = plainTweets_1[_i];
                                tweet = tweetUtils_1.TweetUtils.mapToTweet(plainTweet);
                                tweets.push(tweet);
                            }
                            return [2, tweets];
                        case 2:
                            error_1 = _a.sent();
                            logger.error('Can not fetch tweets', error_1);
                            return [2, null];
                        case 3: return [2];
                    }
                });
            });
        };
        TweetService.prototype.createTweet = function (image, content) {
            return __awaiter(this, void 0, void 0, function () {
                var imageId, tweetData, result, newTweet, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            imageId = null;
                            if (!image) return [3, 2];
                            return [4, this.imageService.saveImage(image)];
                        case 1:
                            imageId = _a.sent();
                            _a.label = 2;
                        case 2:
                            tweetData = {
                                content: content,
                                poster: this.userData.loggedInUser.id,
                                upvotes: 0,
                            };
                            if (imageId) {
                                tweetData['image'] = imageId;
                            }
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 5, , 6]);
                            return [4, this.fetchClient.postJSON(this.fetchConfig.tweetsPart, tweetData)];
                        case 4:
                            result = _a.sent();
                            newTweet = tweetUtils_1.TweetUtils.mapToTweet(result);
                            newTweet.poster = this.userData.loggedInUser;
                            return [2, newTweet];
                        case 5:
                            err_1 = _a.sent();
                            logger.error('Error during creation of tweet.', err_1);
                            return [2, null];
                        case 6: return [2];
                    }
                });
            });
        };
        TweetService.prototype.deleteTweets = function (tweets) {
            return __awaiter(this, void 0, void 0, function () {
                var idArr, _i, tweets_1, tweet, err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!Array.isArray(tweets)) {
                                return [2];
                            }
                            idArr = [];
                            for (_i = 0, tweets_1 = tweets; _i < tweets_1.length; _i++) {
                                tweet = tweets_1[_i];
                                idArr.push(tweet.id);
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4, this.fetchClient.delete(this.fetchConfig.tweetsPart, { ids: idArr })];
                        case 2: return [2, _a.sent()];
                        case 3:
                            err_2 = _a.sent();
                            logger.error('Error during deleting tweets.', err_2);
                            return [2, false];
                        case 4: return [2];
                    }
                });
            });
        };
        TweetService = __decorate([
            aurelia_framework_1.inject(FetchClient_1.FetchClient, fetchConfigLocal_1.default, imageService_1.ImageService, userData_1.UserData),
            __metadata("design:paramtypes", [FetchClient_1.FetchClient, fetchConfigLocal_1.default, imageService_1.ImageService, userData_1.UserData])
        ], TweetService);
        return TweetService;
    }());
    exports.TweetService = TweetService;
});



define('services/svc/tweet/tweetUtils',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Tweet = (function () {
        function Tweet(id, updatedAt, createdAt, content, poster, upvotes) {
            this.id = id;
            this.updatedAt = updatedAt;
            this.createdAt = createdAt;
            this.content = content;
            this.poster = poster;
            this.upvotes = upvotes;
        }
        return Tweet;
    }());
    exports.Tweet = Tweet;
    var TweetUtils = (function () {
        function TweetUtils() {
        }
        TweetUtils.mapToTweet = function (object) {
            if (!object) {
                return null;
            }
            var tweetObject = Object.assign({}, object);
            if (object._id) {
                tweetObject.id = object._id;
            }
            return tweetObject;
        };
        TweetUtils.dePopulateUser = function (tweet) {
            if (!tweet) {
                return null;
            }
            var posterId = tweet.poster.id;
            tweet.poster = posterId;
            return tweet;
        };
        TweetUtils.mapFromTweet = function (tweet) {
            if (!tweet) {
                return null;
            }
            var newObject = this.dePopulateUser(tweet);
            delete newObject._v0;
            delete newObject.id;
            delete newObject._id;
            delete newObject.createdAt;
            delete newObject.updatedAt;
            return newObject;
        };
        return TweetUtils;
    }());
    exports.TweetUtils = TweetUtils;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('services/svc/user/updateService',["require", "exports", "aurelia-framework", "./userService", "../tweet/tweetService", "./userData", "aurelia-event-aggregator", "../../updateMessages", "../admin/adminData"], function (require, exports, aurelia_framework_1, userService_1, tweetService_1, userData_1, aurelia_event_aggregator_1, updateMessages_1, adminData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var logger = aurelia_framework_1.LogManager.getLogger('UpdateService');
    var UpdateService = (function () {
        function UpdateService(userService, TweetService, userData, ea, adminData) {
            var _this = this;
            this.userService = userService;
            this.TweetService = TweetService;
            this.ea = ea;
            this.adminData = adminData;
            this.userData = userData;
            ea.subscribe(updateMessages_1.UpdateRequest, function (request) {
                if (request && request.id) {
                    _this.fetchUserData(request.id).then(function () {
                        logger.info('Update successfull');
                    }).catch(function (err) {
                        logger.error('Error during update', err);
                    });
                }
            });
        }
        UpdateService.prototype.fetchUserData = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, err_1;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 4, , 5]);
                            _a = this.userData;
                            return [4, this.userService.getUserById(id)];
                        case 1:
                            _a.loggedInUser = _c.sent();
                            this.loadAllUsers().then(function () {
                                logger.info('Loaded all users.');
                            }).catch(function (err) {
                                logger.error('Error on all users update.', err);
                            });
                            this.userData.userFriends = [];
                            if (!(this.userData.loggedInUser.following.length > 0)) return [3, 3];
                            _b = this.userData;
                            return [4, this.userService.getUsersById(this.userData.loggedInUser.following)];
                        case 2:
                            _b.userFriends = _c.sent();
                            _c.label = 3;
                        case 3:
                            this.ea.publish(new updateMessages_1.UpdateSuccess());
                            logger.info('Finished fetching user data.');
                            return [3, 5];
                        case 4:
                            err_1 = _c.sent();
                            logger.error("Error during user data fetch.", err_1);
                            return [3, 5];
                        case 5: return [2];
                    }
                });
            });
        };
        UpdateService.prototype.loadAllUsers = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            logger.info('Started loading all users.');
                            console.time('fetchAllUsers');
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, 4, 5]);
                            _a = this.userData;
                            return [4, this.userService.getUsersById(null)];
                        case 2:
                            _a.allUsers = _b.sent();
                            return [3, 5];
                        case 3:
                            error_1 = _b.sent();
                            logger.error('Error during fetch of all users.', error_1);
                            throw error_1;
                        case 4:
                            console.timeEnd('fetchAllUsers');
                            logger.info('Finished loading all users;');
                            return [7];
                        case 5: return [2];
                    }
                });
            });
        };
        UpdateService.prototype.updateAdminData = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, error_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            logger.info('Started loading all users.');
                            console.time('updateAdmin');
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, 4, 5]);
                            _a = this.adminData;
                            return [4, this.userService.getUsersById(null)];
                        case 2:
                            _a.allUsers = _b.sent();
                            return [3, 5];
                        case 3:
                            error_2 = _b.sent();
                            logger.error('Error during fetch of all users.', error_2);
                            throw error_2;
                        case 4:
                            console.timeEnd('updateAdmin');
                            logger.info('Finished loading all users;');
                            return [7];
                        case 5: return [2];
                    }
                });
            });
        };
        UpdateService = __decorate([
            aurelia_framework_1.inject(userService_1.UserService, tweetService_1.TweetService, userData_1.UserData, aurelia_event_aggregator_1.EventAggregator, adminData_1.AdminData),
            __metadata("design:paramtypes", [userService_1.UserService, tweetService_1.TweetService, userData_1.UserData,
                aurelia_event_aggregator_1.EventAggregator, adminData_1.AdminData])
        ], UpdateService);
        return UpdateService;
    }());
    exports.UpdateService = UpdateService;
});



define('services/svc/user/userData',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UserData = (function () {
        function UserData() {
        }
        return UserData;
    }());
    exports.UserData = UserData;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('services/svc/user/userService',["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "../../FetchClient", "../../fetchConfigLocal", "../../authMessages", "./userUtils", "../tweet/tweetService", "../../updateMessages"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, FetchClient_1, fetchConfigLocal_1, authMessages_1, userUtils_1, tweetService_1, updateMessages_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var logger = aurelia_framework_1.LogManager.getLogger('UserService');
    var UserService = (function () {
        function UserService(ea, fetchClient, fetchConfig, tweetService) {
            this.tweetService = tweetService;
            this.eventAggregator = ea;
            this.fetchClient = fetchClient;
            this.fetchConfig = fetchConfig;
        }
        UserService.prototype.authenticate = function (email, password) {
            return __awaiter(this, void 0, void 0, function () {
                var authBody, authUrl, authResult, loginEvent, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            authBody = {
                                email: email,
                                password: password
                            };
                            authUrl = this.fetchConfig.usersPart + this.fetchConfig.authPart;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4, this.fetchClient.postJSON(authUrl, authBody)];
                        case 2:
                            authResult = _a.sent();
                            if (authResult.success && authResult.token) {
                                this.handleAuthSuccess(authResult);
                            }
                            else {
                                loginEvent = new authMessages_1.LoginMessage(authMessages_1.AuthRole.USER, false, true);
                                if (authResult.message) {
                                    loginEvent.message = authResult.message;
                                }
                                this.eventAggregator.publish(loginEvent);
                            }
                            return [3, 4];
                        case 3:
                            err_1 = _a.sent();
                            this.handleAuthError(err_1);
                            return [3, 4];
                        case 4: return [2];
                    }
                });
            });
        };
        UserService.prototype.handleAuthSuccess = function (authResult) {
            FetchClient_1.FetchClient.setAuthToken(authResult.token);
            var loginMessage = new authMessages_1.LoginMessage(authMessages_1.AuthRole.USER, true, true);
            if (authResult) {
                loginMessage.id = authResult.id;
            }
            this.eventAggregator.publish(loginMessage);
        };
        UserService.prototype.handleAuthError = function (err) {
            if (err) {
                logger.error('Error during authentication', err);
            }
            var loginEvent = new authMessages_1.LoginMessage(authMessages_1.AuthRole.USER, false, true);
            if (err.message) {
                loginEvent.message = err.message;
            }
            this.eventAggregator.publish(loginEvent);
        };
        UserService.prototype.signUp = function (username, email, password, firstName, lastName, loginAfter) {
            return __awaiter(this, void 0, void 0, function () {
                var signupBody, exception_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            signupBody = {
                                username: username,
                                email: email,
                                password: password,
                                firstName: firstName,
                                lastName: lastName
                            };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            return [4, this.fetchClient.postJSON(this.fetchConfig.usersPart, signupBody)];
                        case 2:
                            _a.sent();
                            if (!loginAfter) return [3, 4];
                            return [4, this.authenticate(email, password)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2, true];
                        case 5:
                            exception_1 = _a.sent();
                            logger.error('Exception during signup.', exception_1);
                            throw exception_1;
                        case 6: return [2];
                    }
                });
            });
        };
        UserService.prototype.getUserById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var plainUser, user, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4, this.fetchClient.get(this.fetchConfig.usersPart + "/" + id, null)];
                        case 1:
                            plainUser = _a.sent();
                            return [4, this.populateTweets(plainUser)];
                        case 2:
                            user = _a.sent();
                            return [2, user];
                        case 3:
                            error_1 = _a.sent();
                            logger.error('Error during fetch of user.', error_1);
                            throw error_1;
                        case 4: return [2];
                    }
                });
            });
        };
        UserService.prototype.getUsersById = function (ids) {
            return __awaiter(this, void 0, void 0, function () {
                var plainUsers, users, populationPromise, _i, plainUsers_1, plainUser, err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4, this.fetchClient.get(this.fetchConfig.usersPart, { ids: ids })];
                        case 1:
                            plainUsers = _a.sent();
                            if (!Array.isArray(plainUsers)) {
                                logger.error('Fetched user array is no array.');
                                return [2, null];
                            }
                            users = void 0;
                            populationPromise = [];
                            for (_i = 0, plainUsers_1 = plainUsers; _i < plainUsers_1.length; _i++) {
                                plainUser = plainUsers_1[_i];
                                populationPromise.push(this.populateTweets(plainUser));
                            }
                            return [4, Promise.all(populationPromise)];
                        case 2:
                            users = _a.sent();
                            return [2, users];
                        case 3:
                            err_2 = _a.sent();
                            logger.error('Could not fetch users by id', err_2);
                            return [2, null];
                        case 4: return [2];
                    }
                });
            });
        };
        UserService.prototype.updateUser = function (user, preventDataUpdate) {
            return __awaiter(this, void 0, void 0, function () {
                var id, toUpdate, updateResult, err_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!user) {
                                return [2];
                            }
                            id = JSON.parse(JSON.stringify(user.id));
                            toUpdate = userUtils_1.UserUtils.mapFromUser(user);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4, this.fetchClient.put(this.fetchConfig.usersPart + "/" + id, toUpdate)];
                        case 2:
                            updateResult = _a.sent();
                            if (!preventDataUpdate) {
                                this.eventAggregator.publish(new updateMessages_1.UpdateRequest(id));
                            }
                            return [2, true];
                        case 3:
                            err_3 = _a.sent();
                            logger.error('Error during update of user', err_3);
                            return [2, false];
                        case 4: return [2];
                    }
                });
            });
        };
        UserService.prototype.populateTweets = function (plainUser) {
            return __awaiter(this, void 0, void 0, function () {
                var errMsg, user, tweets, _i, tweets_1, tweet;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!plainUser || !(Array.isArray(plainUser.tweets))) {
                                errMsg = 'User does not contain required tweet-id array.';
                                logger.error(errMsg);
                                throw errMsg;
                            }
                            user = userUtils_1.UserUtils.mapToUser(plainUser);
                            tweets = [];
                            if (!(plainUser.tweets.length > 0)) return [3, 2];
                            return [4, this.tweetService.getTweetsById(plainUser.tweets)];
                        case 1:
                            tweets = _a.sent();
                            for (_i = 0, tweets_1 = tweets; _i < tweets_1.length; _i++) {
                                tweet = tweets_1[_i];
                                tweet.poster = user;
                            }
                            _a.label = 2;
                        case 2:
                            user.tweets = tweets;
                            return [2, user];
                    }
                });
            });
        };
        UserService.prototype.deleteUsers = function (users) {
            return __awaiter(this, void 0, void 0, function () {
                var userIds, _i, users_1, user, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!Array.isArray(users)) {
                                return [2];
                            }
                            userIds = [];
                            for (_i = 0, users_1 = users; _i < users_1.length; _i++) {
                                user = users_1[_i];
                                if (!user.id) {
                                    continue;
                                }
                                userIds.push(user.id);
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4, this.fetchClient.delete(this.fetchConfig.usersPart, { ids: userIds })];
                        case 2:
                            _a.sent();
                            return [2, true];
                        case 3:
                            error_2 = _a.sent();
                            logger.error('Error during deletion of users.', error_2);
                            throw error_2;
                        case 4: return [2];
                    }
                });
            });
        };
        UserService = __decorate([
            aurelia_framework_1.inject(aurelia_event_aggregator_1.EventAggregator, FetchClient_1.FetchClient, fetchConfigLocal_1.default, tweetService_1.TweetService),
            __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator, FetchClient_1.FetchClient, fetchConfigLocal_1.default, tweetService_1.TweetService])
        ], UserService);
        return UserService;
    }());
    exports.UserService = UserService;
});



define('services/svc/user/userUtils',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var User = (function () {
        function User(id, updatedAt, createdAt, username, email, password, firstName, lastName) {
            this.id = id;
            this.updatedAt = updatedAt;
            this.createdAt = createdAt;
            this.username = username;
            this.email = email;
            this.password = password;
            this.firstName = firstName;
            this.lastName = lastName;
            this.tweets = [];
            this.following = [];
        }
        return User;
    }());
    exports.User = User;
    var UserUtils = (function () {
        function UserUtils() {
        }
        UserUtils.isInstanceOfUser = function (object) {
            return 'member' in object;
        };
        UserUtils.mapToUser = function (object) {
            if (!object) {
                return null;
            }
            var userObject = Object.assign({}, object);
            if (object._id) {
                userObject.id = object._id;
            }
            return userObject;
        };
        UserUtils.dePopulateTweets = function (user) {
            if (!user) {
                return;
            }
            var tweets = [];
            for (var _i = 0, _a = user.tweets; _i < _a.length; _i++) {
                var tweet = _a[_i];
                tweets.push(tweet.id);
            }
            user.tweets = tweets;
            return user;
        };
        UserUtils.mapFromUser = function (user) {
            if (!user) {
                return null;
            }
            var changedObject = this.dePopulateTweets(user);
            var newObject = JSON.parse(JSON.stringify(changedObject));
            delete newObject.__v;
            delete newObject.id;
            delete newObject._id;
            delete newObject.createdAt;
            delete newObject.updatedAt;
            return newObject;
        };
        return UserUtils;
    }());
    exports.UserUtils = UserUtils;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('viewmodels/admin/manageTweets/manageTweets',["require", "exports", "aurelia-framework", "aurelia-binding", "../../../services/svc/admin/adminData", "../../../services/svc/tweet/tweetDeleter", "../../../services/svc/user/updateService"], function (require, exports, aurelia_framework_1, aurelia_binding_1, adminData_1, tweetDeleter_1, updateService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var logger = aurelia_framework_1.LogManager.getLogger('ManageTweets');
    var ManageTweets = (function () {
        function ManageTweets(adminData, tweetDeleter, updateService, be) {
            var _this = this;
            this.adminData = adminData;
            this.tweetDeleter = tweetDeleter;
            this.updateService = updateService;
            be.propertyObserver(this.adminData, 'allUsers').subscribe(function () {
                _this.update();
            });
        }
        ManageTweets.prototype.attached = function () {
            this.update();
        };
        ManageTweets.prototype.update = function () {
            if (!this.adminData || !Array.isArray(this.adminData.allUsers)) {
                return;
            }
            this.tweets = [];
            this.selectedTweets = [];
            for (var _i = 0, _a = this.adminData.allUsers; _i < _a.length; _i++) {
                var user = _a[_i];
                this.tweets = this.tweets.concat(user.tweets);
            }
        };
        ManageTweets.prototype.deleteTweets = function () {
            return __awaiter(this, void 0, void 0, function () {
                var err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!Array.isArray(this.selectedTweets) || this.selectedTweets.length <= 0) {
                                return [2];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4, this.tweetDeleter.deleteTweets(this.selectedTweets, true)];
                        case 2:
                            _a.sent();
                            return [4, this.updateService.updateAdminData()];
                        case 3:
                            _a.sent();
                            return [3, 5];
                        case 4:
                            err_1 = _a.sent();
                            logger.error('Error during tweet deletion.', err_1);
                            return [3, 5];
                        case 5: return [2];
                    }
                });
            });
        };
        ManageTweets = __decorate([
            aurelia_framework_1.inject(adminData_1.AdminData, tweetDeleter_1.TweetDeleter, updateService_1.UpdateService, aurelia_binding_1.BindingEngine),
            __metadata("design:paramtypes", [adminData_1.AdminData, tweetDeleter_1.TweetDeleter, updateService_1.UpdateService,
                aurelia_binding_1.BindingEngine])
        ], ManageTweets);
        return ManageTweets;
    }());
    exports.ManageTweets = ManageTweets;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('viewmodels/admin/manageUsers/manageUsers',["require", "exports", "aurelia-framework", "../../../services/svc/user/userService", "aurelia-binding", "../../../services/svc/admin/adminData", "../../../services/svc/user/userDeleter", "../../../services/svc/user/updateService", "aurelia-validation"], function (require, exports, aurelia_framework_1, userService_1, aurelia_binding_1, adminData_1, userDeleter_1, updateService_1, aurelia_validation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var logger = aurelia_framework_1.LogManager.getLogger('ManageUsers');
    var ManageUsers = (function () {
        function ManageUsers(adminData, userService, be, userDeleter, updateService, controller) {
            this.adminData = adminData;
            this.userService = userService;
            this.userDeleter = userDeleter;
            this.updateService = updateService;
            this.controller = controller;
            aurelia_validation_1.ValidationRules
                .ensure(function (s) { return s.username; }).required().minLength(4)
                .ensure(function (s) { return s.password; }).required().minLength(5)
                .ensure(function (s) { return s.email; }).required().email()
                .ensure(function (s) { return s.firstName; }).required()
                .ensure(function (s) { return s.lastName; }).required()
                .on(this);
            be.propertyObserver(this.adminData, 'allUsers').subscribe(this.update.bind(this));
            this.update();
        }
        ManageUsers.prototype.attached = function () {
            this.update();
        };
        ManageUsers.prototype.validate = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4, this.controller.validate({ object: this })];
                        case 1:
                            result = _a.sent();
                            return [2, result.valid];
                        case 2:
                            err_1 = _a.sent();
                            logger.warn('Validation failed with error.', err_1);
                            return [2, false];
                        case 3: return [2];
                    }
                });
            });
        };
        ManageUsers.prototype.update = function () {
            if (!this.adminData || !Array.isArray(this.adminData.allUsers)) {
                return;
            }
            this.users = this.adminData.allUsers;
            this.selectedUsers = [];
        };
        ManageUsers.prototype.deleteUsers = function () {
            return __awaiter(this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.selectedUsers.length <= 0) {
                                return [2];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4, this.userDeleter.deleteUser(this.selectedUsers)];
                        case 2:
                            _a.sent();
                            return [4, this.updateService.updateAdminData()];
                        case 3:
                            _a.sent();
                            return [3, 5];
                        case 4:
                            error_1 = _a.sent();
                            throw error_1;
                        case 5: return [2];
                    }
                });
            });
        };
        ManageUsers.prototype.createUser = function () {
            return __awaiter(this, void 0, void 0, function () {
                var valid, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.validate()];
                        case 1:
                            valid = _a.sent();
                            if (!valid) {
                                return [2];
                            }
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 5, , 6]);
                            return [4, this.userService.signUp(this.username, this.email, this.password, this.firstName, this.lastName, false)];
                        case 3:
                            _a.sent();
                            return [4, this.updateService.updateAdminData()];
                        case 4:
                            _a.sent();
                            this.username = '';
                            this.email = '';
                            this.password = '';
                            this.firstName = '';
                            this.lastName = '';
                            return [3, 6];
                        case 5:
                            error_2 = _a.sent();
                            logger.error('Error during creation of user.');
                            return [3, 6];
                        case 6: return [2];
                    }
                });
            });
        };
        ManageUsers = __decorate([
            aurelia_framework_1.inject(adminData_1.AdminData, userService_1.UserService, aurelia_binding_1.BindingEngine, userDeleter_1.UserDeleter, updateService_1.UpdateService, aurelia_validation_1.ValidationController),
            __metadata("design:paramtypes", [adminData_1.AdminData, userService_1.UserService, aurelia_binding_1.BindingEngine,
                userDeleter_1.UserDeleter, updateService_1.UpdateService, aurelia_validation_1.ValidationController])
        ], ManageUsers);
        return ManageUsers;
    }());
    exports.ManageUsers = ManageUsers;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('viewmodels/admin/statistics/statistics',["require", "exports", "aurelia-framework", "aurelia-binding", "../../../services/svc/admin/adminData"], function (require, exports, aurelia_framework_1, aurelia_binding_1, adminData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Statistics = (function () {
        function Statistics(be, adminData) {
            var _this = this;
            this.adminData = adminData;
            be.propertyObserver(this.adminData, 'allUsers').subscribe(function () {
                _this.update();
            });
        }
        Statistics.prototype.attached = function () {
            this.update();
        };
        Statistics.prototype.update = function () {
            if (!this.adminData || !Array.isArray(this.adminData.allUsers)) {
                return;
            }
            this.userNumber = this.adminData.allUsers.length;
            var tweets = 0;
            var following = 0;
            for (var _i = 0, _a = this.adminData.allUsers; _i < _a.length; _i++) {
                var user = _a[_i];
                tweets += user.tweets.length;
                following += user.following.length;
            }
            this.followingNumber = following;
            this.tweetNumber = tweets;
        };
        Statistics = __decorate([
            aurelia_framework_1.inject(aurelia_binding_1.BindingEngine, adminData_1.AdminData),
            __metadata("design:paramtypes", [aurelia_binding_1.BindingEngine, adminData_1.AdminData])
        ], Statistics);
        return Statistics;
    }());
    exports.Statistics = Statistics;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('viewmodels/start/loginAdmin/loginAdmin',["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "../../../services/svc/admin/adminService", "aurelia-validation"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, adminService_1, aurelia_validation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var logger = aurelia_framework_1.LogManager.getLogger('LoginAdmin');
    var LoginAdmin = (function () {
        function LoginAdmin(ea, adminService, controller) {
            this.adminService = adminService;
            this.controller = controller;
            this.eventAggregator = ea;
            aurelia_validation_1.ValidationRules
                .ensure(function (w) { return w.username; }).required()
                .ensure(function (w) { return w.password; }).required()
                .on(this);
        }
        LoginAdmin.prototype.validate = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4, this.controller.validate({ object: this })];
                        case 1:
                            result = _a.sent();
                            return [2, result.valid];
                        case 2:
                            err_1 = _a.sent();
                            logger.warn('Validation failed with error.', err_1);
                            return [2, false];
                        case 3: return [2];
                    }
                });
            });
        };
        LoginAdmin.prototype.login = function () {
            return __awaiter(this, void 0, void 0, function () {
                var valid, err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.validate()];
                        case 1:
                            valid = _a.sent();
                            if (!valid) {
                                return [2];
                            }
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4, this.adminService.authenticate(this.username, this.password)];
                        case 3:
                            _a.sent();
                            return [3, 5];
                        case 4:
                            err_2 = _a.sent();
                            if (err_2.message) {
                                this.errorMessage = err_2.message;
                            }
                            this.errorMessage = err_2;
                            return [3, 5];
                        case 5: return [2];
                    }
                });
            });
        };
        LoginAdmin = __decorate([
            aurelia_framework_1.inject(aurelia_event_aggregator_1.EventAggregator, adminService_1.AdminService, aurelia_validation_1.ValidationController),
            __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator, adminService_1.AdminService, aurelia_validation_1.ValidationController])
        ], LoginAdmin);
        return LoginAdmin;
    }());
    exports.LoginAdmin = LoginAdmin;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('viewmodels/start/notLoggedIn/notLoggedIn',["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "aurelia-validation", "../../../services/svc/user/userService", "../../../services/authMessages"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, aurelia_validation_1, userService_1, authMessages_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var logger = aurelia_framework_1.LogManager.getLogger('NotLoggedIn');
    var NotLoggedIn = (function () {
        function NotLoggedIn(vc, ea, userService) {
            var _this = this;
            this.email = '';
            this.password = '';
            this.controller = vc;
            this.userService = userService;
            ea.subscribe(authMessages_1.FailedLogin, function (result) {
                if (!result) {
                    return;
                }
                if (result.message) {
                    _this.errorMessage = result.message;
                }
                else {
                    _this.errorMessage = 'Unknown error during login. Please try again later.';
                }
            });
            this.controller.validateTrigger = aurelia_validation_1.validateTrigger.blur;
            aurelia_validation_1.ValidationRules
                .ensure(function (v) { return v.email; }).required().email()
                .ensure(function (v) { return v.password; }).required().minLength(5)
                .on(this);
        }
        NotLoggedIn.prototype.validate = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4, this.controller.validate({ object: this })];
                        case 1:
                            result = _a.sent();
                            return [2, result.valid];
                        case 2:
                            err_1 = _a.sent();
                            logger.error('Error during validation', err_1);
                            return [2, false];
                        case 3: return [2];
                    }
                });
            });
        };
        NotLoggedIn.prototype.login = function () {
            var _this = this;
            this.validate().then(function (isValid) {
                if (isValid) {
                    _this.userService.authenticate(_this.email, _this.password).then(function () {
                        logger.info('Authenticated without errors');
                        _this.errorMessage = '';
                    }).catch(function (err) {
                        logger.error('Error during authentication.', err);
                    });
                }
            });
        };
        NotLoggedIn = __decorate([
            aurelia_framework_1.inject(aurelia_framework_1.NewInstance.of(aurelia_validation_1.ValidationController), aurelia_event_aggregator_1.EventAggregator, userService_1.UserService),
            __metadata("design:paramtypes", [aurelia_validation_1.ValidationController, aurelia_event_aggregator_1.EventAggregator, userService_1.UserService])
        ], NotLoggedIn);
        return NotLoggedIn;
    }());
    exports.NotLoggedIn = NotLoggedIn;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('viewmodels/start/signup/signup',["require", "exports", "aurelia-framework", "aurelia-validation", "../../../services/svc/user/userService"], function (require, exports, aurelia_framework_1, aurelia_validation_1, userService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var logger = aurelia_framework_1.LogManager.getLogger('Signup');
    var Signup = (function () {
        function Signup(controller, userService) {
            this.controller = controller;
            this.userService = userService;
            this.signingUp = false;
            this.username = '';
            this.password = '';
            this.email = '';
            this.firstName = '';
            this.lastName = '';
            aurelia_validation_1.ValidationRules
                .ensure(function (s) { return s.username; }).required().minLength(4)
                .ensure(function (s) { return s.password; }).required().minLength(5)
                .ensure(function (s) { return s.email; }).required().email()
                .ensure(function (s) { return s.firstName; }).required()
                .ensure(function (s) { return s.lastName; }).required()
                .on(this);
        }
        Signup.prototype.validate = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4, this.controller.validate({ object: this })];
                        case 1:
                            result = _a.sent();
                            return [2, result.valid];
                        case 2:
                            err_1 = _a.sent();
                            logger.warn('Validation failed with error.', err_1);
                            return [2, false];
                        case 3: return [2];
                    }
                });
            });
        };
        Signup.prototype.signup = function () {
            var _this = this;
            this.validate().then(function (isValid) {
                if (isValid === true) {
                    _this.signingUp = true;
                    _this.userService.signUp(_this.username, _this.email, _this.password, _this.firstName, _this.lastName, true)
                        .then(function () {
                        logger.info('Signup successful');
                    })
                        .catch(function (err) {
                        logger.error('Error during signup process', err);
                        if (err && err.message) {
                            _this.errorMessage = err.message;
                        }
                        else {
                            _this.errorMessage = 'Unknown error during signup process. Please try again later.';
                        }
                    });
                }
            });
        };
        Signup = __decorate([
            aurelia_framework_1.inject(aurelia_framework_1.NewInstance.of(aurelia_validation_1.ValidationController), userService_1.UserService),
            __metadata("design:paramtypes", [aurelia_validation_1.ValidationController, userService_1.UserService])
        ], Signup);
        return Signup;
    }());
    exports.Signup = Signup;
});



define('viewmodels/user/actionTimeline/actionTimeline',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ActionTimeline = (function () {
        function ActionTimeline() {
        }
        return ActionTimeline;
    }());
    exports.ActionTimeline = ActionTimeline;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('viewmodels/user/friends/friend',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Friend = (function () {
        function Friend(user) {
            this.defaultFriendStyle = "ui label";
            this.user = user;
            this.styleClass = this.defaultFriendStyle;
            this.isActive = false;
        }
        Friend.prototype.setActive = function (status) {
            this.isActive = status;
            if (status) {
                this.styleClass = 'ui teal label';
            }
            else {
                this.styleClass = this.defaultFriendStyle;
            }
        };
        __decorate([
            aurelia_framework_1.observable(),
            __metadata("design:type", String)
        ], Friend.prototype, "styleClass", void 0);
        __decorate([
            aurelia_framework_1.observable(),
            __metadata("design:type", Object)
        ], Friend.prototype, "user", void 0);
        __decorate([
            aurelia_framework_1.observable(),
            __metadata("design:type", Boolean)
        ], Friend.prototype, "isActive", void 0);
        return Friend;
    }());
    exports.Friend = Friend;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('viewmodels/user/friends/friendsSidebar',["require", "exports", "aurelia-framework", "../../../services/svc/user/userData", "aurelia-event-aggregator", "../../../services/updateMessages", "../../../services/svc/user/userUtils", "../tweetTimeline/tweetTimeline", "../tweetTimeline/timelineDesc", "./friend", "../../../services/timelineMessage", "../../../services/svc/user/userService"], function (require, exports, aurelia_framework_1, userData_1, aurelia_event_aggregator_1, updateMessages_1, userUtils_1, tweetTimeline_1, timelineDesc_1, friend_1, timelineMessage_1, userService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var logger = aurelia_framework_1.LogManager.getLogger('FriendsSidebar');
    var FriendsSidebar = (function () {
        function FriendsSidebar(ea, userData, tweetTimeline, userService) {
            var _this = this;
            this.tweetTimeline = tweetTimeline;
            this.userService = userService;
            this.friends = [];
            this.userData = userData;
            ea.subscribe(updateMessages_1.UpdateSuccess, function () {
                _this.initFriendList();
            });
            ea.subscribe(timelineMessage_1.SwitchToFriend, function (switchToFriend) {
                if (!switchToFriend || !switchToFriend.friend) {
                    _this.deactivateFriends();
                    return;
                }
                if (!_this.canSwitchToFriend(switchToFriend.friend)) {
                    return;
                }
                _this.viewTimeline(switchToFriend.friend);
            });
        }
        FriendsSidebar.prototype.attached = function () {
            this.initFriendList();
        };
        FriendsSidebar.prototype.deactivateFriends = function () {
            for (var _i = 0, _a = this.friends; _i < _a.length; _i++) {
                var friend = _a[_i];
                friend.setActive(false);
            }
        };
        FriendsSidebar.prototype.canSwitchToFriend = function (friend) {
            var foundFriend = this.getFriend(friend);
            if (!foundFriend || foundFriend.isActive) {
                return false;
            }
            return true;
        };
        FriendsSidebar.prototype.initFriendList = function () {
            if (!Array.isArray(this.userData.userFriends)) {
                return;
            }
            this.friends = [];
            for (var _i = 0, _a = this.userData.userFriends; _i < _a.length; _i++) {
                var user = _a[_i];
                this.friends.push(new friend_1.Friend(user));
            }
        };
        FriendsSidebar.prototype.getFriend = function (friend) {
            var foundFriend = this.friends.find(function (registeredFriend) {
                return registeredFriend.user.id === friend.id;
            });
            if (!foundFriend) {
                return null;
            }
            return foundFriend;
        };
        FriendsSidebar.prototype.isFriendActive = function (friend) {
            var foundFriend;
            if (friend instanceof userUtils_1.User) {
                foundFriend = this.getFriend(friend);
            }
            else {
                foundFriend = friend;
            }
            if (!foundFriend) {
                return false;
            }
            return foundFriend.isActive;
        };
        FriendsSidebar.prototype.isAtLeastOneFriendActive = function () {
            var isActive = false;
            for (var _i = 0, _a = this.friends; _i < _a.length; _i++) {
                var friend = _a[_i];
                if (friend.isActive) {
                    isActive = true;
                    return isActive;
                }
            }
            return isActive;
        };
        FriendsSidebar.prototype.viewTimeline = function (friend) {
            if (!friend) {
                return;
            }
            var foundFriend = this.getFriend(friend);
            if (this.isFriendActive(foundFriend)) {
                this.tweetTimeline.removeUser(friend);
                foundFriend.setActive(false);
                return;
            }
            if (!this.isAtLeastOneFriendActive()) {
                foundFriend.setActive(true);
                var timeLineDesc = new timelineDesc_1.TimeLineDesc(false, "Timeline of " + friend.username);
                this.tweetTimeline.changeTimeline([friend], timeLineDesc);
                return;
            }
            foundFriend.setActive(true);
            this.tweetTimeline.addToCurrent([foundFriend.user], 'Timeline of Friends');
        };
        FriendsSidebar.prototype.unfollow = function (friend) {
            if (!friend) {
                return;
            }
            var friendIndex = this.userData.loggedInUser.following.indexOf(friend.id);
            this.userData.loggedInUser.following.splice(friendIndex, 1);
            this.userService.updateUser(this.userData.loggedInUser, false).then(function (updateResult) {
                logger.info('Received update result.');
            }).catch(function (err) {
                logger.error('Error while unfollowing friend.', err);
            });
        };
        FriendsSidebar.prototype.displayFirehose = function () {
            this.initFriendList();
            var timeLineDesc = new timelineDesc_1.TimeLineDesc(false, 'Firehose');
            this.tweetTimeline.changeTimeline(this.userData.allUsers, timeLineDesc);
        };
        FriendsSidebar = __decorate([
            aurelia_framework_1.inject(aurelia_event_aggregator_1.EventAggregator, userData_1.UserData, tweetTimeline_1.TweetTimeline, userService_1.UserService),
            __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator, userData_1.UserData, tweetTimeline_1.TweetTimeline, userService_1.UserService])
        ], FriendsSidebar);
        return FriendsSidebar;
    }());
    exports.FriendsSidebar = FriendsSidebar;
});



define('viewmodels/user/tweetTimeline/TweetWrapper',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TweetWrapper = (function () {
        function TweetWrapper(tweet, isLoggedInUser, isFriend) {
            this.tweet = tweet;
            this.isLoggedInUser = isLoggedInUser;
            this.isFriend = isFriend;
            this.isSelected = false;
        }
        TweetWrapper.prototype.invertSelection = function () {
            this.isSelected = !this.isSelected;
        };
        return TweetWrapper;
    }());
    exports.TweetWrapper = TweetWrapper;
});



define('viewmodels/user/tweetTimeline/asyncBindingBehavior',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var asyncBindingBehavior = (function () {
        function asyncBindingBehavior() {
        }
        asyncBindingBehavior.prototype.bind = function (binding, source, busymessage) {
            binding.originalupdateTarget = binding.updateTarget;
            binding.updateTarget = function (a) {
                if (typeof a.then === 'function') {
                    if (busymessage)
                        binding.originalupdateTarget(busymessage);
                    a.then(function (d) { binding.originalupdateTarget(d); });
                }
                else
                    binding.originalupdateTarget(a);
            };
        };
        asyncBindingBehavior.prototype.unbind = function (binding) {
            binding.updateTarget = binding.originalupdateTarget;
            binding.originalupdateTarget = null;
        };
        return asyncBindingBehavior;
    }());
    exports.asyncBindingBehavior = asyncBindingBehavior;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('viewmodels/user/tweetTimeline/currency-format',["require", "exports", "aurelia-framework", "../../../services/svc/imageService"], function (require, exports, aurelia_framework_1, imageService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CurrencyFormatValueConverter = (function () {
        function CurrencyFormatValueConverter(imageService) {
            this.imageService = imageService;
        }
        CurrencyFormatValueConverter.prototype.toView = function (value) {
            if (!value) {
                return '';
            }
            return this.imageService.getUrlForImageId(value.image);
        };
        CurrencyFormatValueConverter = __decorate([
            aurelia_framework_1.inject(imageService_1.ImageService),
            __metadata("design:paramtypes", [imageService_1.ImageService])
        ], CurrencyFormatValueConverter);
        return CurrencyFormatValueConverter;
    }());
    exports.CurrencyFormatValueConverter = CurrencyFormatValueConverter;
});



define('viewmodels/user/tweetTimeline/timelineDesc',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TimeLineDesc = (function () {
        function TimeLineDesc(isLoggedInUser, title) {
            this.isLoggedInUser = isLoggedInUser;
            this.title = title;
        }
        return TimeLineDesc;
    }());
    exports.TimeLineDesc = TimeLineDesc;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('viewmodels/user/tweetTimeline/tweetTimeline',["require", "exports", "aurelia-framework", "../../../services/svc/user/userData", "aurelia-binding", "./timelineDesc", "aurelia-validation", "../../../services/svc/tweet/tweetService", "../../../services/svc/imageService", "aurelia-event-aggregator", "../../../services/timelineMessage", "../../../services/svc/user/userService", "./TweetWrapper", "../../../services/svc/tweet/tweetDeleter", "../../../services/updateMessages"], function (require, exports, aurelia_framework_1, userData_1, aurelia_binding_1, timelineDesc_1, aurelia_validation_1, tweetService_1, imageService_1, aurelia_event_aggregator_1, timelineMessage_1, userService_1, TweetWrapper_1, tweetDeleter_1, updateMessages_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var logger = aurelia_framework_1.LogManager.getLogger('TweetTimeline');
    var TweetTimeline = (function () {
        function TweetTimeline(userData, be, vc, tweetService, imageService, eventAggregator, userService, tweetDeleter) {
            var _this = this;
            this.tweetService = tweetService;
            this.imageService = imageService;
            this.eventAggregator = eventAggregator;
            this.userService = userService;
            this.tweetDeleter = tweetDeleter;
            this.tweets = [];
            this.userData = userData;
            this.validationController = vc;
            aurelia_validation_1.ValidationRules
                .ensure(function (t) { return t.content; }).required().minLength(1).maxLength(140)
                .on(this);
            be.propertyObserver(this.userData, 'loggedInUser').subscribe(function (newValue) {
                logger.info('Logged in user changed.');
                _this.update();
            });
        }
        TweetTimeline_1 = TweetTimeline;
        TweetTimeline.prototype.attached = function () {
            this.update();
        };
        TweetTimeline.prototype.update = function () {
            if (this.userData && this.userData.loggedInUser) {
                this.updateTimeline([this.userData.loggedInUser]);
                this.updateSelectionFlag();
            }
        };
        TweetTimeline.prototype.changeTimeline = function (users, timelineDesc) {
            logger.info("Changeing timeline to: " + timelineDesc.title);
            this.updateTimeline(users);
            this.timelineDescription = timelineDesc;
        };
        TweetTimeline.prototype.updateTimeline = function (users) {
            logger.info('Updating timeline for users.');
            if (!Array.isArray(users)) {
                return;
            }
            this.tweets = [];
            this.timelineDescription = new timelineDesc_1.TimeLineDesc(true, 'Your Timeline');
            this.addToCurrent(users, null);
        };
        TweetTimeline.prototype.isTweetOfLoggedInUser = function (tweet) {
            if (!tweet || !tweet.poster || !tweet.poster.id || !this.userData.loggedInUser.id) {
                return false;
            }
            return this.userData.loggedInUser.id === tweet.poster.id;
        };
        TweetTimeline.prototype.isTweetOfUserFriend = function (tweet) {
            if (!tweet || !tweet.poster || !tweet.poster.id || !this.userData.loggedInUser.following) {
                return false;
            }
            for (var _i = 0, _a = this.userData.loggedInUser.following; _i < _a.length; _i++) {
                var userId = _a[_i];
                if (userId === tweet.poster.id) {
                    return true;
                }
            }
            return false;
        };
        TweetTimeline.prototype.addToCurrent = function (users, newTitle) {
            if (!Array.isArray(users)) {
                return;
            }
            for (var _i = 0, users_1 = users; _i < users_1.length; _i++) {
                var user = users_1[_i];
                if (user.tweets) {
                    for (var _a = 0, _b = user.tweets; _a < _b.length; _a++) {
                        var tweet = _b[_a];
                        this.tweets.push(new TweetWrapper_1.TweetWrapper(tweet, this.isTweetOfLoggedInUser(tweet), this.isTweetOfUserFriend(tweet)));
                    }
                }
            }
            this.tweets.sort(TweetTimeline_1.tweetUpdatedAtComparator);
            if (newTitle) {
                this.timelineDescription.title = newTitle;
            }
        };
        TweetTimeline.prototype.getSelected = function () {
            if (!Array.isArray(this.tweets)) {
                return [];
            }
            return this.tweets.filter(function (tw) {
                return tw.isSelected;
            });
        };
        TweetTimeline.prototype.deleteAll = function () {
            var _this = this;
            this.tweetDeleter.deleteTweets(this.userData.loggedInUser.tweets, true).then(function () {
                _this.eventAggregator.publish(new updateMessages_1.UpdateRequest(_this.userData.loggedInUser.id));
            }).catch(function (err) {
                logger.error('Error while deleting tweets.', err);
            });
        };
        TweetTimeline.prototype.deleteSelected = function () {
            var _this = this;
            var selected = this.getSelected();
            var tweets = selected.map(function (tw) {
                return tw.tweet;
            });
            this.tweetDeleter.deleteTweets(tweets, true).then(function () {
                _this.eventAggregator.publish(new updateMessages_1.UpdateRequest(_this.userData.loggedInUser.id));
            }).catch(function (err) {
                logger.error('Error while deleting tweets.', err);
            });
        };
        TweetTimeline.prototype.selectCard = function (tweetWrapper) {
            if (!tweetWrapper.isLoggedInUser) {
                return;
            }
            tweetWrapper.invertSelection();
            this.updateSelectionFlag();
        };
        TweetTimeline.prototype.updateSelectionFlag = function () {
            var selected = this.getSelected();
            if (selected.length <= 0) {
                this.oneSelected = false;
            }
            else {
                this.oneSelected = true;
            }
        };
        TweetTimeline.prototype.removeUser = function (user) {
            if (!user || !(Array.isArray(user.tweets))) {
                return;
            }
            this.tweets = this.tweets.filter(function (tweetWrapper) {
                var notOfUser = true;
                for (var _i = 0, _a = user.tweets; _i < _a.length; _i++) {
                    var userTweet = _a[_i];
                    if (userTweet.id === tweetWrapper.tweet.id) {
                        notOfUser = false;
                    }
                }
                return notOfUser;
            });
            this.tweets.sort(TweetTimeline_1.tweetUpdatedAtComparator);
            if (this.tweets.length <= 0) {
                this.updateTimeline([this.userData.loggedInUser]);
            }
        };
        TweetTimeline.prototype.toOwnTimeline = function () {
            this.eventAggregator.publish(new timelineMessage_1.SwitchToFriend(null));
            this.updateTimeline([this.userData.loggedInUser]);
        };
        TweetTimeline.tweetUpdatedAtComparator = function (tweet1, tweet2) {
            var date1 = Date.parse(tweet1.tweet.createdAt);
            var date2 = Date.parse(tweet2.tweet.createdAt);
            if (isNaN(date1) || isNaN(date2)) {
                logger.warn('Tweet dates could not be parsed to a number', date1, date2);
                return 0;
            }
            return date1 - date2;
        };
        TweetTimeline.prototype.followUser = function (user) {
            if (!user) {
                return;
            }
            var isUserFollowing = this.userData.loggedInUser.following.indexOf(user.id);
            if (isUserFollowing !== -1) {
                logger.warn('User already follows the given user', user.id);
                return;
            }
            this.userData.loggedInUser.following.push(user.id);
            this.userService.updateUser(this.userData.loggedInUser, null).then(function () {
                logger.info('Successfully following friend', user.username);
            }).catch(function (err) {
                logger.error('Could not follow friend.', err);
            });
        };
        TweetTimeline.prototype.switchToFriend = function (friend) {
            if (friend.id === this.userData.loggedInUser.id) {
                this.updateTimeline([this.userData.loggedInUser]);
                friend = null;
            }
            if (friend) {
                var friendIndex = this.userData.loggedInUser.following.indexOf(friend.id);
                if (friendIndex === -1) {
                    var description = new timelineDesc_1.TimeLineDesc(false, "Timeline of: " + friend.username);
                    this.changeTimeline([friend], description);
                }
            }
            this.eventAggregator.publish(new timelineMessage_1.SwitchToFriend(friend));
        };
        TweetTimeline.prototype.createTweet = function () {
            return __awaiter(this, void 0, void 0, function () {
                var file, newTweet;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.validate()) {
                                return [2];
                            }
                            file = null;
                            if (this.image) {
                                file = this.image.item(0);
                            }
                            return [4, this.tweetService.createTweet(file, this.content)];
                        case 1:
                            newTweet = _a.sent();
                            if (!newTweet) {
                                logger.error('Creation of tweet failed');
                                this.creationError = 'An unexpected error happened while we created your tweet. Please do some voodoo and try it again.';
                                return [2];
                            }
                            this.content = '';
                            this.image = null;
                            this.addTweetToLoggedInUser(newTweet);
                            return [2];
                    }
                });
            });
        };
        TweetTimeline.prototype.addTweetToLoggedInUser = function (tweet) {
            this.userData.loggedInUser.tweets.push(tweet);
            this.userService.updateUser(this.userData.loggedInUser, null).then(function () {
                logger.info('Finished updating user.');
            }).catch(function (err) {
                logger.error('Error during update of user.', err);
            });
        };
        TweetTimeline.prototype.validate = function () {
            return __awaiter(this, void 0, void 0, function () {
                var validationResult, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4, this.validationController.validate({ object: this })];
                        case 1:
                            validationResult = _a.sent();
                            return [2, validationResult.valid];
                        case 2:
                            err_1 = _a.sent();
                            logger.error('Error during tweet validation.', err_1);
                            return [2, false];
                        case 3: return [2];
                    }
                });
            });
        };
        TweetTimeline = TweetTimeline_1 = __decorate([
            aurelia_framework_1.inject(userData_1.UserData, aurelia_binding_1.BindingEngine, aurelia_validation_1.ValidationController, tweetService_1.TweetService, imageService_1.ImageService, aurelia_event_aggregator_1.EventAggregator, userService_1.UserService, tweetDeleter_1.TweetDeleter),
            __metadata("design:paramtypes", [userData_1.UserData, aurelia_binding_1.BindingEngine, aurelia_validation_1.ValidationController, tweetService_1.TweetService,
                imageService_1.ImageService, aurelia_event_aggregator_1.EventAggregator,
                userService_1.UserService, tweetDeleter_1.TweetDeleter])
        ], TweetTimeline);
        return TweetTimeline;
        var TweetTimeline_1;
    }());
    exports.TweetTimeline = TweetTimeline;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('viewmodels/user/userSettings/userSettings',["require", "exports", "aurelia-framework", "aurelia-validation", "../../../services/svc/user/userService", "../../../services/svc/user/userData", "aurelia-binding", "../tweetTimeline/tweetTimeline"], function (require, exports, aurelia_framework_1, aurelia_validation_1, userService_1, userData_1, aurelia_binding_1, tweetTimeline_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var logger = aurelia_framework_1.LogManager.getLogger('UserSettings');
    var UserSettings = (function () {
        function UserSettings(userData, userService, bindingEngine, tweetTimeline, vc) {
            var _this = this;
            this.userData = userData;
            this.userService = userService;
            this.bindingEngine = bindingEngine;
            this.tweetTimeline = tweetTimeline;
            this.controller = vc;
            bindingEngine.propertyObserver(this.userData, 'loggedInUser').subscribe(function (newValue) {
                _this.updateData();
            });
            if (this.userData.loggedInUser) {
                this.updateData();
            }
            aurelia_validation_1.ValidationRules
                .ensure(function (s) { return s.username; }).required().minLength(4)
                .ensure(function (s) { return s.password; }).required().minLength(5)
                .ensure(function (s) { return s.email; }).required().email()
                .ensure(function (s) { return s.firstName; }).required()
                .ensure(function (s) { return s.lastName; }).required()
                .on(this);
        }
        UserSettings.prototype.updateData = function () {
            this.username = this.userData.loggedInUser.username;
            this.password = this.userData.loggedInUser.password;
            this.email = this.userData.loggedInUser.email;
            this.firstName = this.userData.loggedInUser.firstName;
            this.lastName = this.userData.loggedInUser.lastName;
        };
        UserSettings.prototype.validate = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4, this.controller.validate({ object: this })];
                        case 1:
                            result = _a.sent();
                            return [2, result.valid];
                        case 2:
                            err_1 = _a.sent();
                            logger.warn('Validation failed with error.', err_1);
                            return [2, false];
                        case 3: return [2];
                    }
                });
            });
        };
        UserSettings.prototype.update = function () {
            return __awaiter(this, void 0, void 0, function () {
                var valid;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.validate()];
                        case 1:
                            valid = _a.sent();
                            if (!valid) {
                                return [2];
                            }
                            this.executeUpdate();
                            return [2];
                    }
                });
            });
        };
        UserSettings.prototype.executeUpdate = function () {
            var _this = this;
            var user = this.userData.loggedInUser;
            user.username = this.username;
            user.password = this.password;
            user.email = this.email;
            user.firstName = this.firstName;
            user.lastName = this.lastName;
            this.userService.updateUser(user, false).then(function () {
                logger.info('Successfully updated user.');
                _this.successMessage = 'Update was successful.';
                _this.tweetTimeline.toOwnTimeline();
            }).catch(function (err) {
                logger.error('Error updating user.', err);
                _this.successMessage = null;
                _this.errorMessage = 'An error happened during saving your changes.';
            });
        };
        UserSettings = __decorate([
            aurelia_framework_1.inject(userData_1.UserData, userService_1.UserService, aurelia_binding_1.BindingEngine, tweetTimeline_1.TweetTimeline, aurelia_validation_1.ValidationController),
            __metadata("design:paramtypes", [userData_1.UserData, userService_1.UserService, aurelia_binding_1.BindingEngine,
                tweetTimeline_1.TweetTimeline, aurelia_validation_1.ValidationController])
        ], UserSettings);
        return UserSettings;
    }());
    exports.UserSettings = UserSettings;
});



define('services/svc/admin/adminData',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AdminData = (function () {
        function AdminData() {
        }
        return AdminData;
    }());
    exports.AdminData = AdminData;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('services/svc/admin/adminService',["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "../../FetchClient", "../../fetchConfigLocal", "../../authMessages", "../user/userService", "./adminData", "../user/updateService"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, FetchClient_1, fetchConfigLocal_1, authMessages_1, userService_1, adminData_1, updateService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var logger = aurelia_framework_1.LogManager.getLogger('AdminService');
    var AdminService = (function () {
        function AdminService(ea, fetchClient, fetchConfig, userService, adminData, updateService) {
            this.userService = userService;
            this.adminData = adminData;
            this.updateService = updateService;
            this.eventAggregator = ea;
            this.fetchClient = fetchClient;
            this.fetchConfig = fetchConfig;
        }
        AdminService.prototype.authenticate = function (username, password) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var authBody, authUrl;
                return __generator(this, function (_a) {
                    authBody = {
                        username: username,
                        password: password
                    };
                    authUrl = this.fetchConfig.adminsPart + this.fetchConfig.authPart;
                    this.fetchClient.postJSON(authUrl, authBody).then(function (authResult) {
                        if (authResult.success && authResult.token) {
                            FetchClient_1.FetchClient.setAuthToken(authResult.token);
                            _this.updateService.updateAdminData().then(function () {
                                logger.info('Updated all users for admin data');
                            });
                            _this.eventAggregator.publish(new authMessages_1.LoginMessage(authMessages_1.AuthRole.ADMIN, true, false));
                        }
                        else {
                            var loginEvent = new authMessages_1.LoginMessage(authMessages_1.AuthRole.ADMIN, false, true);
                            if (authResult.message) {
                                loginEvent.message = authResult.message;
                            }
                            _this.eventAggregator.publish(loginEvent);
                            throw loginEvent;
                        }
                    }).catch(function (err) {
                        if (err) {
                            logger.error('Error during authentication', err);
                        }
                        var loginEvent = new authMessages_1.LoginMessage(authMessages_1.AuthRole.ADMIN, false, true);
                        if (err.message) {
                            loginEvent.message = err.message;
                        }
                        _this.eventAggregator.publish(loginEvent);
                        if (err) {
                            throw err;
                        }
                    });
                    return [2];
                });
            });
        };
        AdminService = __decorate([
            aurelia_framework_1.inject(aurelia_event_aggregator_1.EventAggregator, FetchClient_1.FetchClient, fetchConfigLocal_1.default, userService_1.UserService, adminData_1.AdminData, updateService_1.UpdateService),
            __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator, FetchClient_1.FetchClient, fetchConfigLocal_1.default, userService_1.UserService,
                adminData_1.AdminData, updateService_1.UpdateService])
        ], AdminService);
        return AdminService;
    }());
    exports.AdminService = AdminService;
});



define('viewmodels/admin/manageUsers/UserWrapper',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UserWrapper = (function () {
        function UserWrapper(user) {
            this.user = user;
            this.isSelected = false;
        }
        return UserWrapper;
    }());
    exports.UserWrapper = UserWrapper;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('services/svc/user/userDeleter',["require", "exports", "aurelia-framework", "../tweet/tweetDeleter", "./userService"], function (require, exports, aurelia_framework_1, tweetDeleter_1, userService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UserDeleter = (function () {
        function UserDeleter(tweetDeleter, userService) {
            this.tweetDeleter = tweetDeleter;
            this.userService = userService;
        }
        UserDeleter_1 = UserDeleter;
        UserDeleter.prototype.deleteUser = function (users) {
            return __awaiter(this, void 0, void 0, function () {
                var tweetsToDelete, deletionPromiseTweets, deletionPromiseUsers;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!Array.isArray(users)) {
                                return [2, false];
                            }
                            tweetsToDelete = UserDeleter_1.getTweetsToDelete(users);
                            deletionPromiseTweets = this.tweetDeleter.deleteTweets(tweetsToDelete, false);
                            deletionPromiseUsers = this.userService.deleteUsers(users);
                            return [4, deletionPromiseTweets];
                        case 1:
                            _a.sent();
                            return [4, deletionPromiseUsers];
                        case 2:
                            _a.sent();
                            return [2, true];
                    }
                });
            });
        };
        UserDeleter.getTweetsToDelete = function (users) {
            if (!Array.isArray(users)) {
                return [];
            }
            var tweets = [];
            for (var _i = 0, users_1 = users; _i < users_1.length; _i++) {
                var user = users_1[_i];
                if (!Array.isArray(user.tweets)) {
                    continue;
                }
                tweets = tweets.concat(user.tweets);
            }
            return tweets;
        };
        UserDeleter = UserDeleter_1 = __decorate([
            aurelia_framework_1.inject(tweetDeleter_1.TweetDeleter, userService_1.UserService),
            __metadata("design:paramtypes", [tweetDeleter_1.TweetDeleter, userService_1.UserService])
        ], UserDeleter);
        return UserDeleter;
        var UserDeleter_1;
    }());
    exports.UserDeleter = UserDeleter;
});



define('text!admin.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"nav-bar.html\"></require>\n  <div class=\"ui container page-host\">\n    <nav-bar router.bind=\"router\"></nav-bar>\n    <router-view></router-view>\n  </div>\n</template>\n"; });
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"nav-bar.html\"></require>\n  <div class=\"ui container page-host\">\n    <nav-bar router.bind=\"router\"></nav-bar>\n    <router-view></router-view>\n  </div>\n</template>\n\n"; });
define('text!nav-bar.html', ['module'], function(module) { module.exports = "<template bindable=\"router\">\n  <nav class=\"ui inverted pointing menu\">\n    <header class=\"header item\"><a href=\"#home\"> Twittr </a></header>\n    <div class=\"right menu\">\n      <div repeat.for=\"row of router.navigation\">\n        <a class=\"${row.isActive ? 'active' : ''} item\"  href.bind=\"row.href\">${row.title}</a>\n      </div>\n    </div>\n  </nav>\n</template>\n</template>\n\n"; });
define('text!user.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"nav-bar.html\"></require>\n  <div class=\"ui container page-host\">\n    <nav-bar router.bind=\"router\"></nav-bar>\n    <router-view></router-view>\n  </div>\n</template>\n"; });
define('text!viewmodels/logout/logout.html', ['module'], function(module) { module.exports = "<template>\n\n  <article class=\"ui padded segment container\" style=\"width: 60%; margin-top: 10%;\">\n    <div class=\"ui blue floating message\">\n      <div class=\"header\">Do you really want to logout?</div>\n      <button class=\"ui yellow centered button\" click.delegate=\"logout()\">Logout</button>\n    </div>\n  </article>\n\n</template>\n"; });
define('text!viewmodels/admin/manageTweets/manageTweets.html', ['module'], function(module) { module.exports = "<template>\n  <article class=\"ui padded segment container\">\n    <table class=\"ui celled compact definition table\">\n      <thead>\n        <tr>\n          <th></th>\n          <th>Poster</th>\n          <th>Content</th>\n        </tr>\n      </thead>\n\n      <tr class=\"collapsing\" repeat.for=\"tweet of tweets\">\n        <td><div class=\"ui center aligned\"><input class=\"ui checkbox\" type=\"checkbox\" model.bind=\"tweet\" checked.bind=\"selectedTweets\"></div></td>\n        <td>${tweet.poster.username}</td>\n        <td>${tweet.content}</td>\n      </tr>\n\n      <tfoot class=\"full-width\">\n      <tr>\n        <th colspan=\"4\">\n          <button class=\"ui right floated small negative labeled icon button\" click.delegate=\"deleteTweets()\">\n            <i class=\"trash icon\"></i> Delete Selected\n          </button>\n        </th>\n      </tr>\n      </tfoot>\n    </table>\n  </article>\n</template>\n"; });
define('text!viewmodels/admin/manageUsers/manageUsers.html', ['module'], function(module) { module.exports = "<template>\n  <article class=\"ui segment container\">\n\n    <article class=\"ui centered piled segment\">\n      <article class=\"ui divided list\">\n        <section class=\"ui item\" repeat.for=\"user of users\">\n          <div class=\"ui checkbox\">\n            <input type=\"checkbox\" model.bind=\"user\" checked.bind=\"selectedUsers\">\n            <label>${user.username}</label>\n          </div>\n        </section>\n      </article>\n    </article>\n    <div class=\"ui buttons\">\n      <button class=\"ui negative button\" click.delegate=\"deleteUsers()\">Delete</button>\n      <div class=\"or\"></div>\n      <button class=\"ui positive button\" onclick=\"$('#createUserDialog').modal('show')\">Create</button>\n    </div>\n\n    <section class=\"ui divided list\" if.bind=\"controller.errors\">\n      <div class=\"item error\" repeat.for=\"error of controller.errors\">\n        ${error.message}\n      </div>\n    </section>\n  </article>\n\n\n  <article id=\"createUserDialog\" class=\"ui modal\">\n    <i class=\"close icon\"></i>\n    <div class=\"ui header\">Crate a new user.</div>\n    <form class=\"ui form\">\n      <section class=\"content\">\n        <section class=\"ui field\">\n          <label>Username</label>\n          <div class=\"ui left icon input\">\n            <input value.bind=\"username\" type=\"text\" placeholder=\"Username\">\n            <i class=\"icon user\"></i>\n          </div>\n        </section>\n        <section class=\"ui field\">\n          <label>Email</label>\n          <div class=\"ui left icon input\">\n            <input value.bind=\"email\" type=\"email\" placeholder=\"Email\">\n            <i class=\"icon at\"></i>\n          </div>\n        </section>\n        <section class=\"ui field\">\n          <label>Password</label>\n          <div class=\"ui left icon input\">\n            <input value.bind=\"password\" type=\"password\" placeholder=\"Password\">\n            <i class=\"icon lock\"></i>\n          </div>\n        </section>\n        <section class=\"ui field\">\n          <label>First Name</label>\n          <div class=\"ui input\">\n            <input value.bind=\"firstName\" type=\"text\" placeholder=\"FirstName\">\n          </div>\n        </section>\n        <section class=\"ui field\">\n          <label>Surename</label>\n          <div class=\"ui input\">\n            <input value.bind=\"lastName\" type=\"text\" placeholder=\"Surname\">\n          </div>\n        </section>\n      </section>\n      <div class=\"actions\">\n        <button class=\"ui black deny button\">\n          I changed my mind\n        </button>\n        <button class=\"ui positive right labeled icon button\" click.delegate=\"createUser()\">\n          Create User\n          <i class=\"checkmark icon\"></i>\n        </button>\n      </div>\n    </form>\n  </article>\n</template>\n"; });
define('text!viewmodels/admin/statistics/statistics.html', ['module'], function(module) { module.exports = "<template>\n  <article class=\"ui segment container\">\n    <article class=\"ui centered statistics\">\n      <section class=\"ui padded statistic segment\" style=\"margin-left: auto\">\n        <div class=\"ui value\">\n          <i class=\"ui user icon\"></i>\n          ${userNumber}\n        </div>\n        <div class=\"ui label\">\n          Users\n        </div>\n      </section>\n      <section class=\"ui padded statistic segment\">\n        <div class=\"ui value\">\n          <i class=\"ui add user icon\"></i>\n          ${followingNumber}\n        </div>\n        <div class=\"ui label\">\n          Following\n        </div>\n      </section>\n      <section class=\"ui padded statistic segment\" style=\"margin-right: auto\">\n        <section class=\"ui statistic\">\n          <div class=\"ui value\">\n            <i class=\"ui newspaper icon\"></i>\n            ${tweetNumber}\n          </div>\n          <div class=\"ui label\">\n            Tweets\n          </div>\n        </section>\n      </section>\n    </article>\n  </article>\n</template>\n"; });
define('text!viewmodels/start/loginAdmin/loginAdmin.html', ['module'], function(module) { module.exports = "<template>\n  <article class=\"ui container\" style=\"width: 60%; margin-top: 10%;\">\n    <div class=\"ui icon attached warning message\">\n      <i class=\"ui unlock alternate icon\"></i>\n      This is the admin part of the application.\n      Please be responsible with your admin account credentials...<br/>\n      Bah nobody reads such warnings anyway. You are an admin. You know what to do.\n    </div>\n    <form class=\"ui form attached fluid segment\" submit.delegate=\"login($event)\" style=\"margin-top: 20px;\">\n      <section class=\"ui field\">\n        <label>Username</label>\n        <input type=\"text\" class=\"ui input\" value.bind=\"username\" placeholder=\"Username\">\n      </section>\n      <section class=\"ui field\">\n        <label>Password</label>\n        <input type=\"password\" class=\"ui input\" value.bind=\"password\" placeholder=\"Password\">\n      </section>\n      <button type=\"submit\" class=\"ui blue submit button\">Submit</button>\n      <section class=\"ui divided list\" if.bind=\"controller.errors\">\n        <div class=\"item error\" repeat.for=\"error of controller.errors\">\n          ${error.message}\n        </div>\n      </section>\n      <section if.bind=\"errorMessage\" class=\"ui padded section\">\n        <p class=\"error\">${errorMessage}</p>\n      </section>\n    </form>\n  </article>\n</template>\n"; });
define('text!viewmodels/start/notLoggedIn/notLoggedIn.html', ['module'], function(module) { module.exports = "<template>\n\n  <article id=\"welcome\" class=\"welcome-segment ui centered middle aligned raised segment container\">\n    <h1 class=\"ui centered header\">Welcome at Twittr</h1>\n    <article class=\"ui two column middle aligned very relaxed stackable grid\">\n      <article class=\"column\">\n        <form id=\"loginForm\" submit.delegate=\"login($event)\" class=\"ui form\">\n          <div class=\"ui field\">\n            <label>Email</label>\n            <div class=\"ui left icon input\">\n              <input name=\"email\" value.bind=\"email\" type=\"text\" placeholder=\"Email\">\n              <i class=\"at icon\"></i>\n            </div>\n          </div>\n          <div class=\"field\">\n            <label>Password</label>\n            <div class=\"ui left icon input\">\n              <input name=\"password\" value.bind=\"password\" type=\"password\" placeholder=\"Password\">\n              <i class=\"lock icon\"></i>\n            </div>\n          </div>\n          <button type=\"submit\" class=\"ui blue submit button\">Login</button>\n\n          <section class=\"ui divided list\" if.bind=\"controller.errors\">\n            <div class=\"item error\" repeat.for=\"error of controller.errors\">\n              ${error.message}\n            </div>\n          </section>\n\n          <section if.bind=\"errorMessage\" class=\"ui padded section\">\n            <p class=\"error\">${errorMessage}</p>\n          </section>\n        </form>\n      </article>\n      <div class=\"divider-column\">\n        <div class=\"ui vertical divider\">\n          Or\n        </div>\n      </div>\n      <article class=\"center aligned column\">\n        <a href=\"#/signup\" class=\"ui big green labeled icon button\">\n          <i class=\"signup icon\"></i>\n          Sign Up\n        </a>\n      </article>\n    </article>\n  </article>\n\n</template>\n"; });
define('text!viewmodels/start/signup/signup.html', ['module'], function(module) { module.exports = "<template>\n\n  <article class=\"signup-segment ui centered stacked segment container\">\n    <template id=\"signupContent\" if.bind=\"!signingUp\">\n      <form id=\"signupForm\" class=\"ui form\" submit.delegate=\"signup($event)\">\n        <section class=\"ui field\">\n          <label>Username</label>\n          <div class=\"ui left icon input\">\n            <input value.bind=\"username\" type=\"text\" placeholder=\"Username\">\n            <i class=\"icon user\"></i>\n          </div>\n        </section>\n        <section class=\"ui field\">\n          <label>Email</label>\n          <div class=\"ui left icon input\">\n            <input value.bind=\"email\" type=\"email\" placeholder=\"Email\">\n            <i class=\"icon at\"></i>\n          </div>\n        </section>\n        <section class=\"ui field\">\n          <label>Password</label>\n          <div class=\"ui left icon input\">\n            <input value.bind=\"password\" type=\"password\" placeholder=\"Password\">\n            <i class=\"icon lock\"></i>\n          </div>\n        </section>\n        <section class=\"ui field\">\n          <label>First Name</label>\n          <div class=\"ui input\">\n            <input value.bind=\"firstName\" type=\"text\" placeholder=\"FirstName\">\n          </div>\n        </section>\n        <section class=\"ui field\">\n          <label>Surename</label>\n          <div class=\"ui input\">\n            <input value.bind=\"lastName\" type=\"text\" placeholder=\"Surname\">\n          </div>\n        </section>\n\n        <button type=\"submit\" class=\"ui green labeled icon submit button\">Signup\n          <i class=\"icon add user\"></i>\n        </button>\n      </form>\n      <section class=\"ui divided list\" if.bind=\"controller.errors\">\n        <div class=\"item error\" repeat.for=\"error of controller.errors\">\n          ${error.message}\n        </div>\n      </section>\n    </template>\n    <template id=\"waitingContent\" if.bind=\"signingUp\">\n      <section class=\"ui header\">Welcome at Twittr</section>\n      <p style=\"color: limegreen; font-weight: bold;\">We are getting things done for you in the background<br/>\n        Please wait on us, while we are catching up to you shortly.</p>\n      <div class=\"ui ${errorMessage ? '' : 'active'} centered inline text loader\">Learning patience is the key...</div>\n      <p class=\"error\">${errorMessage}</p>\n    </template>\n  </article>\n\n\n</template>\n"; });
define('text!viewmodels/user/actionTimeline/actionTimeline.html', ['module'], function(module) { module.exports = "<template>\n  <h3 class=\"header\">Action Timeline</h3>\n\n  <div class=\"ui circular yellow label\">Unfortunately I could not finish this feature.</div>\n\n  <p><br/></p>\n  <section>\n    <p>This sidebar would have contained actions between users in a timeline.<br/>\n      Like user x is now following user y.</p>\n  </section>\n</template>\n"; });
define('text!viewmodels/user/friends/friendsSidebar.html', ['module'], function(module) { module.exports = "<template>\n\n  <article>\n    <div class=\"ui header\">Your Friends:</div>\n    <article class=\"ui items\">\n      <section class=\"ui item\" repeat.for=\"friend of friends\">\n        <a class.bind=\"friend.styleClass\" click.delegate=\"viewTimeline(friend.user)\">${friend.user.username}</a>\n        <button class=\"unfollow-button ui circular icon button\" click.delegate=\"unfollow(friend.user)\">\n          <i class=\"ui remove user icon\"></i>\n        </button>\n      </section>\n    </article>\n\n    <button class=\"ui secondary button\" type=\"button\" click.delegate=\"displayFirehose()\">Firehose</button>\n  </article>\n</template>\n"; });
define('text!viewmodels/user/tweetTimeline/tweetTimeline.html', ['module'], function(module) { module.exports = "<template>\n\n  <require from='./currency-format'></require>\n  <require from='./asyncBindingBehavior'></require>\n\n  <article class=\"ui raised three column segment stackable container relaxed grid\">\n    <article id=\"followersContent\" class=\"ui three wide left floated column\">\n      <button class=\"ui primary button\" click.delegate=\"toOwnTimeline()\">To Your Timeline</button>\n      <article class=\"ui segment\">\n        <compose view-model=\"../friends/friendsSidebar\"></compose>\n      </article>\n    </article>\n    <article id=\"tweetTimelineContent\" class=\"ui eight wide column piled padded segment\">\n      <section if.bind=\"creationError\">\n        <div class=\"ui big red label\">${creationError}</div>\n        <section class=\"ui divided list\" if.bind=\"validationController.errors\">\n          <div class=\"item error\" repeat.for=\"error of controller.errors\">\n            ${error.message}\n          </div>\n        </section>\n      </section>\n      <div class=\"ui big blue ribbon label\">${timelineDescription.title}</div>\n      <article repeat.for=\"tweetWrapper of tweets\"\n               class=\"ui ${tweetWrapper.isSelected ? 'red' : ''} raised link centered card\"\n               click.delegate=\"selectCard(tweetWrapper)\">\n        <a if.bind=\"!tweetWrapper.isLoggedInUser && !tweetWrapper.isFriend\"\n           click.delegate=\"followUser(tweetWrapper.tweet.poster)\" class=\"ui floating teal circular label\"><i\n          class=\"ui add user icon\"></i></a>\n        <section if.bind=\"tweetWrapper.tweet.image\" class=\"image\">\n          <img class=\"image\" src=\"${tweetWrapper.tweet | currencyFormat & async}\">\n        </section>\n        <section class=\"content\">\n          <a class=\"header\" click.delegate=\"switchToFriend(tweetWrapper.tweet.poster)\">${tweetWrapper.tweet.poster.username}</a>\n          <div class=\"description\">\n            ${tweetWrapper.tweet.content}\n          </div>\n        </section>\n      </article>\n    </article>\n    <article id=\"actionTimelineContent\" class=\"ui three wide right floated column\">\n      <button if.bind=\"!oneSelected\" type=\"button\" class=\"ui primary button\"\n              onclick=\"$('#createTweetDialog').modal('show')\">New Tweet\n      </button>\n      <div if.bind=\"oneSelected\" class=\"ui buttons\">\n        <button type=\"button\" class=\"ui negative icon button\" click.delegate=\"deleteSelected()\"><i\n          class=\"ui trash icon\"></i></button>\n        <div class=\"or\"></div>\n        <button type=\"button\" class=\"ui negative button\" click.delegate=\"deleteAll()\">Delete All</button>\n      </div>\n      <article class=\"ui segment\">\n        <compose view-model=\"../actionTimeline/actionTimeline\"></compose>\n      </article>\n    </article>\n  </article>\n\n  <article id=\"createTweetDialog\" class=\"ui modal\">\n    <i class=\"close icon\"></i>\n    <div class=\"ui header\">Crate an awesome tweet.</div>\n    <form class=\"ui form\">\n      <section class=\"content\">\n        <div class=\"ui field\">\n          <input class=\"ui primary button\" type=\"file\" accept=\"image/*\" files.bind=\"image\" name=\"Add an Image\">\n        </div>\n        <div class=\"ui field\">\n          <label class=\"ui teal label\">What do you want to say?</label>\n          <textarea value.bind=\"content\" rows=\"5\" cols=\"35\" class=\"ui left labeled input\"\n                    placeholder=\"But not longer than 140 chars ;)\"></textarea>\n        </div>\n      </section>\n      <div class=\"actions\">\n        <button class=\"ui black deny button\">\n          I changed my mind\n        </button>\n        <button class=\"ui positive right labeled icon button\" click.delegate=\"createTweet()\">\n          Post that!\n          <i class=\"checkmark icon\"></i>\n        </button>\n      </div>\n    </form>\n  </article>\n</template>\n"; });
define('text!viewmodels/user/userSettings/userSettings.html', ['module'], function(module) { module.exports = "<template>\n\n  <article class=\"ui centered stacked segment container\">\n    <article id=\"signupContent\">\n      <form id=\"changeSettings\" class=\"ui form\" submit.delegate=\"update($event)\">\n        <section class=\"ui field\">\n          <label>Username</label>\n          <div class=\"ui left icon input\">\n            <input value.bind=\"username\" type=\"text\" placeholder=\"Username\">\n            <i class=\"icon user\"></i>\n          </div>\n        </section>\n        <section class=\"ui field\">\n          <label>Email</label>\n          <div class=\"ui left icon input\">\n            <input value.bind=\"email\" type=\"email\" placeholder=\"Email\">\n            <i class=\"icon at\"></i>\n          </div>\n        </section>\n        <section class=\"ui field\">\n          <label>Password</label>\n          <div class=\"ui left icon input\">\n            <input value.bind=\"password\" type=\"password\" placeholder=\"Password\">\n            <i class=\"icon lock\"></i>\n          </div>\n        </section>\n        <section class=\"ui field\">\n          <label>First Name</label>\n          <div class=\"ui input\">\n            <input value.bind=\"firstName\" type=\"text\" placeholder=\"FirstName\">\n          </div>\n        </section>\n        <section class=\"ui field\">\n          <label>Surename</label>\n          <div class=\"ui input\">\n            <input value.bind=\"lastName\" type=\"text\" placeholder=\"Surname\">\n          </div>\n        </section>\n\n        <button type=\"submit\" class=\"ui green labeled icon submit button\">Update\n          <i class=\"icon edit\"></i>\n        </button>\n      </form>\n      <section class=\"ui divided list\" if.bind=\"controller.errors\">\n        <div class=\"item error\" repeat.for=\"error of controller.errors\">\n          ${error.message}\n        </div>\n      </section>\n      <section class=\"ui red label\"  if.bind=\"errorMessage\">\n        ${errorMessage}\n      </section>\n      <section class=\"ui green label\" if.bind=\"successMessage\">\n        ${successMessage}\n      </section>\n    </article>\n  </article>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map