'use strict';

const Code = require('code');
const Lab = require('lab');
const sinon = require('sinon');
const middleware = require('../');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const beforeEach = lab.beforeEach;
const afterEach = lab.afterEach;
const expect = Code.expect;

let webClient, sandbox, groupResponse, channelResponse;

describe('list', () => {
  beforeEach(done => {
    sandbox = sinon.sandbox.create();
    groupResponse = {
      ok: true,
      group: {
        name: 'name'
      }
    };
    channelResponse = {
      ok: true,
      channel: {
        name: 'name'
      }
    };
    webClient = {
      groups: {
        info: function (id, callback) {
          callback(null, groupResponse);
        }
      },
      channels: {
        info: function (id, callback) {
          callback(null, channelResponse);
        }
      }
    };

    done();
  });

  afterEach(done => {
    sandbox.restore();

    done();
  });

  describe('channel', () => {
    describe('whitelist', () => {
      it('calls next if the current channel name is in the given whitelist', done => {
        const event = 'event';
        const data = {
          channel: '123'
        };
        middleware.whitelist(['name'], webClient)(() => {
          done();
        }, event, data);
      });

      it('does not call next if the current channel name is not in the given whitelist', done => {
        const spy = sandbox.spy();
        const event = 'event';
        const data = {
          channel: '123'
        };

        middleware.whitelist(['other'], webClient)(spy, event, data);
        expect(spy.called).to.equal(false);
        done();
      });
    });

    describe('blacklist', () => {
      it('calls next if the current channel name is not in the given blacklist', done => {
        const event = 'event';
        const data = {
          channel: '123'
        };
        middleware.blacklist(['other'], webClient)(() => {
          done();
        }, event, data);
      });

      it('does not call next if the current channel name is in the given blacklist', done => {
        const spy = sandbox.spy();
        const event = 'event';
        const data = {
          channel: '123'
        };

        middleware.blacklist(['name'], webClient)(spy, event, data);
        expect(spy.called).to.equal(false);
        done();
      });
    });

    it('stops if there is an error', done => {
      const spy = sandbox.spy(webClient.groups, 'info');
      sandbox.stub(webClient.channels, 'info', function (channel, callback) {
        callback('error');
      });
      const event = 'event';
      const data = {
        channel: '123'
      };

      middleware.whitelist(['name'], webClient)(() => {}, event, data);
      expect(spy.called).to.equal(false);
      done();
    });
  });

  describe('group', () => {
    beforeEach(done => {
      channelResponse.ok = false;

      done();
    });

    describe('whitelist', () => {
      it('calls next if the current group name is in the given whitelist', done => {
        const event = 'event';
        const data = {
          channel: '123'
        };
        middleware.whitelist(['name'], webClient)(() => {
          done();
        }, event, data);
      });

      it('does not call next if the current group name is not in the given whitelist', done => {
        const spy = sandbox.spy();
        const event = 'event';
        const data = {
          channel: '123'
        };

        middleware.whitelist(['other'], webClient)(spy, event, data);
        expect(spy.called).to.equal(false);
        done();
      });
    });

    describe('blacklist', () => {
      it('calls next if the current group name is not in the given blacklist', done => {
        const event = 'event';
        const data = {
          channel: '123'
        };
        middleware.blacklist(['other'], webClient)(() => {
          done();
        }, event, data);
      });

      it('does not call next if the current group name is in the given blacklist', done => {
        const spy = sandbox.spy();
        const event = 'event';
        const data = {
          channel: '123'
        };

        middleware.blacklist(['name'], webClient)(spy, event, data);
        expect(spy.called).to.equal(false);
        done();
      });
    });

    it('stops if there is an error', done => {
      const spy = sandbox.spy();
      sandbox.stub(webClient.groups, 'info', function (channel, callback) {
        callback('error');
      });
      const event = 'event';
      const data = {
        channel: '123'
      };

      middleware.whitelist(['name'], webClient)(() => {}, event, data);
      expect(spy.called).to.equal(false);
      done();
    });

    it('calls next if not in a channel or group', done => {
      const spy = sandbox.spy();
      groupResponse.ok = false;
      const event = 'event';
      const data = {
        channel: '123'
      };

      middleware.whitelist(['name'], webClient)(() => {
        done();
      }, event, data);
    });
  });

});
