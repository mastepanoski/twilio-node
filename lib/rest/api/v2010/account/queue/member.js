'use strict';

var Q = require('q');  /* jshint ignore:line */
var _ = require('lodash');  /* jshint ignore:line */
var Page = require('../../../../../base/Page');  /* jshint ignore:line */
var deserialize = require(
    '../../../../../base/deserialize');  /* jshint ignore:line */
var values = require('../../../../../base/values');  /* jshint ignore:line */

var MemberList;
var MemberPage;
var MemberInstance;
var MemberContext;

/* jshint ignore:start */
/**
 * @constructor Twilio.Api.V2010.AccountContext.QueueContext.MemberList
 * @description Initialize the MemberList
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {string} accountSid - The account_sid
 * @param {string} queueSid - A string that uniquely identifies this queue
 */
/* jshint ignore:end */
MemberList = function MemberList(version, accountSid, queueSid) {
  /* jshint ignore:start */
  /**
   * @function members
   * @memberof Twilio.Api.V2010.AccountContext.QueueContext
   * @instance
   *
   * @param {string} sid - sid of instance
   *
   * @returns {Twilio.Api.V2010.AccountContext.QueueContext.MemberContext}
   */
  /* jshint ignore:end */
  function MemberListInstance(sid) {
    return MemberListInstance.get(sid);
  }

  MemberListInstance._version = version;
  // Path Solution
  MemberListInstance._solution = {
    accountSid: accountSid,
    queueSid: queueSid
  };
  MemberListInstance._uri = _.template(
    '/Accounts/<%= accountSid %>/Queues/<%= queueSid %>/Members.json' // jshint ignore:line
  )(MemberListInstance._solution);
  /* jshint ignore:start */
  /**
   * Streams MemberInstance records from the API.
   *
   * This operation lazily loads records as efficiently as possible until the limit
   * is reached.
   *
   * The results are passed into the callback function, so this operation is memory efficient.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function each
   * @memberof Twilio.Api.V2010.AccountContext.QueueContext.MemberList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {number} [opts.limit] -
   *         Upper limit for the number of records to return.
   *         each() guarantees never to return more than limit.
   *         Default is no limit
   * @param {number} [opts.pageSize=50] -
   *         Number of records to fetch per request,
   *         when not set will use the default value of 50 records.
   *         If no pageSize is defined but a limit is defined,
   *         each() will attempt to read the limit with the most efficient
   *         page size, i.e. min(limit, 1000)
   * @param {Function} [opts.callback] -
   *         Function to process each record. If this and a positional
   * callback are passed, this one will be used
   * @param {Function} [opts.done] -
   *          Function to be called upon completion of streaming
   * @param {Function} [callback] - Function to process each record
   */
  /* jshint ignore:end */
  MemberListInstance.each = function each(opts, callback) {
    opts = opts || {};
    if (_.isFunction(opts)) {
      opts = { callback: opts };
    } else if (_.isFunction(callback) && !_.isFunction(opts.callback)) {
      opts.callback = callback;
    }

    if (_.isUndefined(opts.callback)) {
      throw new Error('Callback function must be provided');
    }

    var done = false;
    var currentPage = 1;
    var currentResource = 0;
    var limits = this._version.readLimits({
      limit: opts.limit,
      pageSize: opts.pageSize
    });

    function onComplete(error) {
      done = true;
      if (_.isFunction(opts.done)) {
        opts.done(error);
      }
    }

    function fetchNextPage(fn) {
      var promise = fn();
      if (_.isUndefined(promise)) {
        onComplete();
        return;
      }

      promise.then(function(page) {
        _.each(page.instances, function(instance) {
          if (done || (!_.isUndefined(opts.limit) && currentResource >= opts.limit)) {
            done = true;
            return false;
          }

          currentResource++;
          opts.callback(instance, onComplete);
        });

        if ((limits.pageLimit && limits.pageLimit <= currentPage)) {
          onComplete();
        } else if (!done) {
          currentPage++;
          fetchNextPage(_.bind(page.nextPage, page));
        }
      });

      promise.catch(onComplete);
    }

    fetchNextPage(_.bind(this.page, this, _.merge(opts, limits)));
  };

  /* jshint ignore:start */
  /**
   * @description Lists MemberInstance records from the API as a list.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function list
   * @memberof Twilio.Api.V2010.AccountContext.QueueContext.MemberList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {number} [opts.limit] -
   *         Upper limit for the number of records to return.
   *         list() guarantees never to return more than limit.
   *         Default is no limit
   * @param {number} [opts.pageSize] -
   *         Number of records to fetch per request,
   *         when not set will use the default value of 50 records.
   *         If no page_size is defined but a limit is defined,
   *         list() will attempt to read the limit with the most
   *         efficient page size, i.e. min(limit, 1000)
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  /* jshint ignore:end */
  MemberListInstance.list = function list(opts, callback) {
    if (_.isFunction(opts)) {
      callback = opts;
      opts = {};
    }
    opts = opts || {};
    var deferred = Q.defer();
    var allResources = [];
    opts.callback = function(resource, done) {
      allResources.push(resource);

      if (!_.isUndefined(opts.limit) && allResources.length === opts.limit) {
        done();
      }
    };

    opts.done = function(error) {
      if (_.isUndefined(error)) {
        deferred.resolve(allResources);
      } else {
        deferred.reject(error);
      }
    };

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    this.each(opts);
    return deferred.promise;
  };

  /* jshint ignore:start */
  /**
   * Retrieve a single page of MemberInstance records from the API.
   * Request is executed immediately
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function page
   * @memberof Twilio.Api.V2010.AccountContext.QueueContext.MemberList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {string} [opts.pageToken] - PageToken provided by the API
   * @param {number} [opts.pageNumber] -
   *          Page Number, this value is simply for client state
   * @param {number} [opts.pageSize] - Number of records to return, defaults to 50
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  /* jshint ignore:end */
  MemberListInstance.page = function page(opts, callback) {
    opts = opts || {};

    var deferred = Q.defer();
    var data = values.of({
      'PageToken': opts.pageToken,
      'Page': opts.pageNumber,
      'PageSize': opts.pageSize
    });

    var promise = this._version.page({
      uri: this._uri,
      method: 'GET',
      params: data
    });

    promise = promise.then(function(payload) {
      deferred.resolve(new MemberPage(
        this._version,
        payload,
        this._solution
      ));
    }.bind(this));

    promise.catch(function(error) {
      deferred.reject(error);
    });

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    return deferred.promise;
  };

  /* jshint ignore:start */
  /**
   * Constructs a member
   *
   * @function get
   * @memberof Twilio.Api.V2010.AccountContext.QueueContext.MemberList
   * @instance
   *
   * @param {string} callSid - The call_sid
   *
   * @returns {Twilio.Api.V2010.AccountContext.QueueContext.MemberContext}
   */
  /* jshint ignore:end */
  MemberListInstance.get = function get(callSid) {
    return new MemberContext(
      this._version,
      this._solution.accountSid,
      this._solution.queueSid,
      callSid
    );
  };

  return MemberListInstance;
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Api.V2010.AccountContext.QueueContext.MemberPage
 * @augments Page
 * @description Initialize the MemberPage
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {object} response - Response from the API
 * @param {object} solution - Path solution
 *
 * @returns MemberPage
 */
/* jshint ignore:end */
MemberPage = function MemberPage(version, response, solution) {
  // Path Solution
  this._solution = solution;

  Page.prototype.constructor.call(this, version, response, this._solution);
};

_.extend(MemberPage.prototype, Page.prototype);
MemberPage.prototype.constructor = MemberPage;

/* jshint ignore:start */
/**
 * Build an instance of MemberInstance
 *
 * @function getInstance
 * @memberof Twilio.Api.V2010.AccountContext.QueueContext.MemberPage
 * @instance
 *
 * @param {object} payload - Payload response from the API
 *
 * @returns MemberInstance
 */
/* jshint ignore:end */
MemberPage.prototype.getInstance = function getInstance(payload) {
  return new MemberInstance(
    this._version,
    payload,
    this._solution.accountSid,
    this._solution.queueSid
  );
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Api.V2010.AccountContext.QueueContext.MemberInstance
 * @description Initialize the MemberContext
 *
 * @property {string} callSid - Unique string that identifies this resource
 * @property {Date} dateEnqueued - The date the member was enqueued
 * @property {number} position - This member's current position in the queue.
 * @property {string} uri - The uri
 * @property {number} waitTime -
 *          The number of seconds the member has been in the queue.
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {object} payload - The instance payload
 * @param {sid} accountSid - The account_sid
 * @param {sid} queueSid - The Queue in which to find the members
 * @param {sid} callSid - The call_sid
 */
/* jshint ignore:end */
MemberInstance = function MemberInstance(version, payload, accountSid, queueSid,
                                          callSid) {
  this._version = version;

  // Marshaled Properties
  this.callSid = payload.call_sid; // jshint ignore:line
  this.dateEnqueued = deserialize.rfc2822DateTime(payload.date_enqueued); // jshint ignore:line
  this.position = deserialize.integer(payload.position); // jshint ignore:line
  this.uri = payload.uri; // jshint ignore:line
  this.waitTime = deserialize.integer(payload.wait_time); // jshint ignore:line

  // Context
  this._context = undefined;
  this._solution = {
    accountSid: accountSid,
    queueSid: queueSid,
    callSid: callSid || this.callSid,
  };
};

Object.defineProperty(MemberInstance.prototype,
  '_proxy', {
  get: function() {
    if (!this._context) {
      this._context = new MemberContext(
        this._version,
        this._solution.accountSid,
        this._solution.queueSid,
        this._solution.callSid
      );
    }

    return this._context;
  }
});

/* jshint ignore:start */
/**
 * fetch a MemberInstance
 *
 * @function fetch
 * @memberof Twilio.Api.V2010.AccountContext.QueueContext.MemberInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed MemberInstance
 */
/* jshint ignore:end */
MemberInstance.prototype.fetch = function fetch(callback) {
  return this._proxy.fetch(callback);
};

/* jshint ignore:start */
/**
 * update a MemberInstance
 *
 * @function update
 * @memberof Twilio.Api.V2010.AccountContext.QueueContext.MemberInstance
 * @instance
 *
 * @param {object} opts - ...
 * @param {string} opts.url - The url
 * @param {string} opts.method - The method
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed MemberInstance
 */
/* jshint ignore:end */
MemberInstance.prototype.update = function update(opts, callback) {
  return this._proxy.update(opts, callback);
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Api.V2010.AccountContext.QueueContext.MemberContext
 * @description Initialize the MemberContext
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {sid} accountSid - The account_sid
 * @param {sid} queueSid - The Queue in which to find the members
 * @param {sid} callSid - The call_sid
 */
/* jshint ignore:end */
MemberContext = function MemberContext(version, accountSid, queueSid, callSid) {
  this._version = version;

  // Path Solution
  this._solution = {
    accountSid: accountSid,
    queueSid: queueSid,
    callSid: callSid,
  };
  this._uri = _.template(
    '/Accounts/<%= accountSid %>/Queues/<%= queueSid %>/Members/<%= callSid %>.json' // jshint ignore:line
  )(this._solution);
};

/* jshint ignore:start */
/**
 * fetch a MemberInstance
 *
 * @function fetch
 * @memberof Twilio.Api.V2010.AccountContext.QueueContext.MemberContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed MemberInstance
 */
/* jshint ignore:end */
MemberContext.prototype.fetch = function fetch(callback) {
  var deferred = Q.defer();
  var promise = this._version.fetch({
    uri: this._uri,
    method: 'GET'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new MemberInstance(
      this._version,
      payload,
      this._solution.accountSid,
      this._solution.queueSid,
      this._solution.callSid
    ));
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};

/* jshint ignore:start */
/**
 * update a MemberInstance
 *
 * @function update
 * @memberof Twilio.Api.V2010.AccountContext.QueueContext.MemberContext
 * @instance
 *
 * @param {object} opts - ...
 * @param {string} opts.url - The url
 * @param {string} opts.method - The method
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed MemberInstance
 */
/* jshint ignore:end */
MemberContext.prototype.update = function update(opts, callback) {
  if (_.isUndefined(opts)) {
    throw new Error('Required parameter "opts" missing.');
  }
  if (_.isUndefined(opts.url)) {
    throw new Error('Required parameter "opts.url" missing.');
  }
  if (_.isUndefined(opts.method)) {
    throw new Error('Required parameter "opts.method" missing.');
  }

  var deferred = Q.defer();
  var data = values.of({
    'Url': _.get(opts, 'url'),
    'Method': _.get(opts, 'method')
  });

  var promise = this._version.update({
    uri: this._uri,
    method: 'POST',
    data: data
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new MemberInstance(
      this._version,
      payload,
      this._solution.accountSid,
      this._solution.queueSid,
      this._solution.callSid
    ));
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};

module.exports = {
  MemberList: MemberList,
  MemberPage: MemberPage,
  MemberInstance: MemberInstance,
  MemberContext: MemberContext
};
