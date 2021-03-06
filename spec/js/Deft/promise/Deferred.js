/*
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/
/*
Jasmine test suite for Deft.promise.Deferred
*/
describe('Deft.promise.Deferred', function() {
  beforeEach(function() {
    this.addMatchers({
      toBeInstanceOf: function(className) {
        return this.actual instanceof Ext.ClassManager.get(className);
      }
    });
  });
  describe('State Flow and Completion', function() {
    var cancelCallback, deferred, failureCallback, progressCallback, successCallback;
    deferred = null;
    successCallback = failureCallback = progressCallback = cancelCallback = null;
    beforeEach(function() {
      deferred = Ext.create('Deft.promise.Deferred');
      successCallback = jasmine.createSpy('success callback');
      failureCallback = jasmine.createSpy('failure callback');
      progressCallback = jasmine.createSpy('progress callback');
      cancelCallback = jasmine.createSpy('cancel callback');
    });
    it('should allow access to the associated Promise', function() {
      expect(deferred.getPromise()).toBeInstanceOf('Deft.promise.Promise');
    });
    it('should resolve', function() {
      deferred.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('expected value');
      expect(deferred.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('expected value');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject', function() {
      deferred.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      expect(deferred.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith('error message');
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should update', function() {
      deferred.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.update('progress');
      expect(deferred.getState()).toBe('pending');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).toHaveBeenCalledWith('progress');
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should cancel', function() {
      deferred.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      expect(deferred.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).toHaveBeenCalledWith('reason');
    });
    it('should allow resolution after update', function() {
      deferred.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.update('progress');
      expect(deferred.getState()).toBe('pending');
      deferred.resolve('expected value');
      expect(deferred.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('expected value');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).toHaveBeenCalledWith('progress');
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should allow rejection after update', function() {
      deferred.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.update('progress');
      expect(deferred.getState()).toBe('pending');
      deferred.reject('error message');
      expect(deferred.getState()).toBe('rejected');
    });
    it('should allow cancellation after update', function() {
      deferred.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.update('progress');
      expect(deferred.getState()).toBe('pending');
      deferred.cancel('reason');
      expect(deferred.getState()).toBe('cancelled');
    });
    it('should not allow resolution after resolution', function() {
      deferred.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('expected value');
      if (successCallback != null) successCallback.reset();
      expect(function() {
        deferred.resolve('expected value');
      }).toThrow(new Error('Error: this Deferred has already been completed and cannot be modified.'));
      expect(deferred.getState()).toBe('resolved');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should not allow rejection after resolution', function() {
      deferred.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('expected value');
      if (successCallback != null) successCallback.reset();
      expect(function() {
        deferred.reject('error message');
      }).toThrow(new Error('Error: this Deferred has already been completed and cannot be modified.'));
      expect(deferred.getState()).toBe('resolved');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should not allow update after resolution', function() {
      deferred.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('expected value');
      if (successCallback != null) successCallback.reset();
      expect(function() {
        deferred.update('progress');
      }).toThrow(new Error('Error: this Deferred has already been completed and cannot be modified.'));
      expect(deferred.getState()).toBe('resolved');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should not allow cancellation after resolution', function() {
      deferred.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('expected value');
      if (successCallback != null) successCallback.reset();
      expect(function() {
        deferred.cancel('reason');
      }).toThrow(new Error('Error: this Deferred has already been completed and cannot be modified.'));
      expect(deferred.getState()).toBe('resolved');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should not allow resolution after rejection', function() {
      deferred.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      if (failureCallback != null) failureCallback.reset();
      expect(function() {
        deferred.resolve('expected value');
      }).toThrow(new Error('Error: this Deferred has already been completed and cannot be modified.'));
      expect(deferred.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should not allow rejection after rejection', function() {
      deferred.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      if (failureCallback != null) failureCallback.reset();
      expect(function() {
        deferred.reject('error message');
      }).toThrow(new Error('Error: this Deferred has already been completed and cannot be modified.'));
      expect(deferred.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should not allow update after rejection', function() {
      deferred.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      if (failureCallback != null) failureCallback.reset();
      expect(function() {
        deferred.update('progress');
      }).toThrow(new Error('Error: this Deferred has already been completed and cannot be modified.'));
      expect(deferred.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should not allow cancellation after rejection', function() {
      deferred.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      if (failureCallback != null) failureCallback.reset();
      expect(function() {
        deferred.cancel('reason');
      }).toThrow(new Error('Error: this Deferred has already been completed and cannot be modified.'));
      expect(deferred.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should not allow resolution after cancellation', function() {
      deferred.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      if (cancelCallback != null) cancelCallback.reset();
      expect(function() {
        deferred.resolve('expected value');
      }).toThrow(new Error('Error: this Deferred has already been completed and cannot be modified.'));
      expect(deferred.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should not allow rejection after cancellation', function() {
      deferred.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      if (cancelCallback != null) cancelCallback.reset();
      expect(function() {
        deferred.reject('error message');
      }).toThrow(new Error('Error: this Deferred has already been completed and cannot be modified.'));
      expect(deferred.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should not allow update after cancellation', function() {
      deferred.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      cancelCallback.reset();
      expect(function() {
        deferred.update('progress');
      }).toThrow(new Error('Error: this Deferred has already been completed and cannot be modified.'));
      expect(deferred.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should not allow cancellation after cancellation', function() {
      deferred.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      if (cancelCallback != null) cancelCallback.reset();
      expect(function() {
        deferred.cancel('reason');
      }).toThrow(new Error('Error: this Deferred has already been completed and cannot be modified.'));
      expect(deferred.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
  });
  describe('Callback registration via then()', function() {
    var createSpecsForThen;
    createSpecsForThen = function(thenFunction, callbacksFactoryFunction) {
      var cancelCallback, deferred, failureCallback, progressCallback, successCallback;
      deferred = null;
      successCallback = failureCallback = progressCallback = cancelCallback = null;
      beforeEach(function() {
        var _ref;
        deferred = Ext.create('Deft.promise.Deferred');
        _ref = callbacksFactoryFunction(), successCallback = _ref.success, failureCallback = _ref.failure, progressCallback = _ref.progress, cancelCallback = _ref.cancel;
      });
      it('should call success callback (if specified) when resolved', function() {
        thenFunction(deferred, successCallback, failureCallback, progressCallback, cancelCallback);
        deferred.resolve('expected value');
        if (successCallback != null) {
          expect(successCallback).toHaveBeenCalledWith('expected value');
        }
        if (failureCallback != null) {
          expect(failureCallback).not.toHaveBeenCalled();
        }
        if (progressCallback != null) {
          expect(progressCallback).not.toHaveBeenCalled();
        }
        if (cancelCallback != null) expect(cancelCallback).not.toHaveBeenCalled();
      });
      it('should call failure callback (if specified) when rejected', function() {
        thenFunction(deferred, successCallback, failureCallback, progressCallback, cancelCallback);
        deferred.reject('error message');
        if (successCallback != null) {
          expect(successCallback).not.toHaveBeenCalled();
        }
        if (failureCallback != null) {
          expect(failureCallback).toHaveBeenCalledWith('error message');
        }
        if (progressCallback != null) {
          expect(progressCallback).not.toHaveBeenCalled();
        }
        if (cancelCallback != null) expect(cancelCallback).not.toHaveBeenCalled();
      });
      it('should call progress callback (if specified) when updated', function() {
        thenFunction(deferred, successCallback, failureCallback, progressCallback, cancelCallback);
        deferred.update('progress');
        if (successCallback != null) {
          expect(successCallback).not.toHaveBeenCalled();
        }
        if (failureCallback != null) {
          expect(failureCallback).not.toHaveBeenCalled();
        }
        if (progressCallback != null) {
          expect(progressCallback).toHaveBeenCalledWith('progress');
        }
        if (cancelCallback != null) expect(cancelCallback).not.toHaveBeenCalled();
      });
      it('should call cancel callback (if specified) when cancelled', function() {
        thenFunction(deferred, successCallback, failureCallback, progressCallback, cancelCallback);
        deferred.cancel('reason');
        if (successCallback != null) {
          expect(successCallback).not.toHaveBeenCalled();
        }
        if (failureCallback != null) {
          expect(failureCallback).not.toHaveBeenCalled();
        }
        if (progressCallback != null) {
          expect(progressCallback).not.toHaveBeenCalled();
        }
        if (cancelCallback != null) {
          expect(cancelCallback).toHaveBeenCalledWith('reason');
        }
      });
      it('should immediately call newly added success callback (if specified) when already resolved', function() {
        deferred.resolve('expected value');
        thenFunction(deferred, successCallback, failureCallback, progressCallback, cancelCallback);
        if (successCallback != null) {
          expect(successCallback).toHaveBeenCalledWith('expected value');
        }
        if (failureCallback != null) {
          expect(failureCallback).not.toHaveBeenCalled();
        }
        if (progressCallback != null) {
          expect(progressCallback).not.toHaveBeenCalled();
        }
        if (cancelCallback != null) expect(cancelCallback).not.toHaveBeenCalled();
      });
      it('should immediately call newly added failure callback (if specified) when already rejected', function() {
        deferred.reject('error message');
        thenFunction(deferred, successCallback, failureCallback, progressCallback, cancelCallback);
        if (successCallback != null) {
          expect(successCallback).not.toHaveBeenCalled();
        }
        if (failureCallback != null) {
          expect(failureCallback).toHaveBeenCalledWith('error message');
        }
        if (progressCallback != null) {
          expect(progressCallback).not.toHaveBeenCalled();
        }
        if (cancelCallback != null) expect(cancelCallback).not.toHaveBeenCalled();
      });
      it('should immediately call newly added progress callback (if specified) when already updated', function() {
        deferred.update('progress');
        thenFunction(deferred, successCallback, failureCallback, progressCallback, cancelCallback);
        if (successCallback != null) {
          expect(successCallback).not.toHaveBeenCalled();
        }
        if (failureCallback != null) {
          expect(failureCallback).not.toHaveBeenCalled();
        }
        if (progressCallback != null) {
          expect(progressCallback).toHaveBeenCalledWith('progress');
        }
        if (cancelCallback != null) expect(cancelCallback).not.toHaveBeenCalled();
      });
      it('should immediately call newly added cancel callback (if specified) when already cancelled', function() {
        deferred.cancel('reason');
        thenFunction(deferred, successCallback, failureCallback, progressCallback, cancelCallback);
        if (successCallback != null) {
          expect(successCallback).not.toHaveBeenCalled();
        }
        if (failureCallback != null) {
          expect(failureCallback).not.toHaveBeenCalled();
        }
        if (progressCallback != null) {
          expect(progressCallback).not.toHaveBeenCalled();
        }
        if (cancelCallback != null) {
          expect(cancelCallback).toHaveBeenCalledWith('reason');
        }
      });
      it('should throw an error when non-function callback(s) are specified', function() {
        if (successCallback || failureCallback || progressCallback || cancelCallback) {
          return expect(function() {
            thenFunction(deferred, successCallback ? 'value' : successCallback, failureCallback ? 'value' : failureCallback, progressCallback ? 'value' : progressCallback, cancelCallback ? 'value' : cancelCallback);
          }).toThrow(new Error('Error while configuring callback: a non-function specified.'));
        }
      });
      it('should return a new Promise', function() {
        var result;
        result = thenFunction(deferred, successCallback, failureCallback, progressCallback, cancelCallback);
        expect(result).toBeInstanceOf('Deft.promise.Promise');
        expect(result).not.toBe(deferred.promise);
      });
    };
    describe('with callbacks specified via method parameters', function() {
      var callbacksFactoryFunction, thenFunction;
      thenFunction = function(deferred, successCallback, failureCallback, progressCallback, cancelCallback) {
        return deferred.then(successCallback, failureCallback, progressCallback, cancelCallback);
      };
      callbacksFactoryFunction = function() {
        return {
          success: jasmine.createSpy('success callback'),
          failure: jasmine.createSpy('failure callback'),
          progress: jasmine.createSpy('progress callback'),
          cancel: jasmine.createSpy('cancel callback')
        };
      };
      createSpecsForThen(thenFunction, callbacksFactoryFunction);
    });
    describe('with callbacks specified via method parameters,', function() {
      var callbackNames, createCallbacksFactoryFunction, index, thenFunction;
      thenFunction = function(deferred, successCallback, failureCallback, progressCallback, cancelCallback) {
        return deferred.then(successCallback, failureCallback, progressCallback, cancelCallback);
      };
      createCallbacksFactoryFunction = function(index, valueWhenOmitted) {
        var callbacksFactoryFunction;
        callbacksFactoryFunction = function() {
          var callbacks;
          callbacks = {};
          callbacks.success = index === 0 ? jasmine.createSpy('success callback') : valueWhenOmitted;
          callbacks.failure = index === 1 ? jasmine.createSpy('failure callback') : valueWhenOmitted;
          callbacks.progress = index === 2 ? jasmine.createSpy('progress callback') : valueWhenOmitted;
          callbacks.cancel = index === 3 ? jasmine.createSpy('cancel callback') : valueWhenOmitted;
          return callbacks;
        };
        return callbacksFactoryFunction;
      };
      callbackNames = ['success', 'failure', 'progress', 'cancel'];
      for (index = 0; index <= 3; index++) {
        describe("omitting " + callbackNames[index] + " callback as null", function() {
          createSpecsForThen(thenFunction, createCallbacksFactoryFunction(index, null));
        });
        describe("omitting " + callbackNames[index] + " callback as undefined", function() {
          createSpecsForThen(thenFunction, createCallbacksFactoryFunction(index, void 0));
        });
      }
    });
    describe('with callbacks specified via configuration Object', function() {
      var callbacksFactoryFunction, thenFunction;
      thenFunction = function(deferred, successCallback, failureCallback, progressCallback, cancelCallback) {
        return deferred.then({
          success: successCallback,
          failure: failureCallback,
          progress: progressCallback,
          cancel: cancelCallback
        });
      };
      callbacksFactoryFunction = function() {
        return {
          success: jasmine.createSpy('success callback'),
          failure: jasmine.createSpy('failure callback'),
          progress: jasmine.createSpy('progress callback'),
          cancel: jasmine.createSpy('cancel callback')
        };
      };
      createSpecsForThen(thenFunction, callbacksFactoryFunction);
    });
    return describe('with callbacks specified via configuration Object,', function() {
      var callbackNames, createCallbacksFactoryFunction, index, thenFunction;
      thenFunction = function(deferred, successCallback, failureCallback, progressCallback, cancelCallback) {
        return deferred.then({
          success: successCallback,
          failure: failureCallback,
          progress: progressCallback,
          cancel: cancelCallback
        });
      };
      createCallbacksFactoryFunction = function(index, valueWhenOmitted) {
        var callbacksFactoryFunction;
        callbacksFactoryFunction = function() {
          var callbacks;
          callbacks = {};
          callbacks.success = index === 0 ? jasmine.createSpy('success callback') : valueWhenOmitted;
          callbacks.failure = index === 1 ? jasmine.createSpy('failure callback') : valueWhenOmitted;
          callbacks.progress = index === 2 ? jasmine.createSpy('progress callback') : valueWhenOmitted;
          callbacks.cancel = index === 3 ? jasmine.createSpy('cancel callback') : valueWhenOmitted;
          return callbacks;
        };
        return callbacksFactoryFunction;
      };
      callbackNames = ['success', 'failure', 'progress', 'cancel'];
      for (index = 0; index <= 3; index++) {
        describe("omitting " + callbackNames[index] + " callback as null", function() {
          createSpecsForThen(thenFunction, createCallbacksFactoryFunction(index, null));
        });
        describe("omitting " + callbackNames[index] + " callback as undefined", function() {
          createSpecsForThen(thenFunction, createCallbacksFactoryFunction(index, void 0));
        });
      }
    });
  });
  describe('Callback registration via always()', function() {
    var alwaysCallback, deferred;
    deferred = null;
    alwaysCallback = null;
    beforeEach(function() {
      deferred = Ext.create('Deft.promise.Deferred');
      alwaysCallback = jasmine.createSpy('always callback');
    });
    it('should call always callback when resolved', function() {
      deferred.always(alwaysCallback);
      deferred.resolve('expected value');
      expect(alwaysCallback).toHaveBeenCalled();
    });
    it('should call always callback when rejected', function() {
      deferred.always(alwaysCallback);
      deferred.reject('error message');
      expect(alwaysCallback).toHaveBeenCalled();
    });
    it('should not call always callback when updated', function() {
      deferred.always(alwaysCallback);
      deferred.update('progress');
      expect(alwaysCallback).not.toHaveBeenCalled();
    });
    it('should call always callback when cancelled', function() {
      deferred.always(alwaysCallback);
      deferred.cancel('reason');
      expect(alwaysCallback).toHaveBeenCalled();
    });
    it('should immediately call always callback when already resolved', function() {
      deferred.resolve('expected value');
      deferred.always(alwaysCallback);
      expect(alwaysCallback).toHaveBeenCalled();
    });
    it('should immediately call always callback when already rejected', function() {
      deferred.reject('error message');
      deferred.always(alwaysCallback);
      expect(alwaysCallback).toHaveBeenCalled();
    });
    it('should not immediately call always callback when already updated', function() {
      deferred.update('progress');
      deferred.always(alwaysCallback);
      expect(alwaysCallback).not.toHaveBeenCalled();
    });
    it('should immediately call always callback when already cancelled', function() {
      deferred.cancel('reason');
      deferred.always(alwaysCallback);
      expect(alwaysCallback).toHaveBeenCalled();
    });
    it('should allow a null callback to be specified', function() {
      expect(function() {
        deferred.always(null);
      }).not.toThrow();
    });
    it('should allow an undefined callback to be specified', function() {
      expect(function() {
        deferred.always(void 0);
      }).not.toThrow();
    });
    it('should throw an error when a non-function callback is specified', function() {
      expect(function() {
        deferred.always('value');
      }).toThrow(new Error('Error while configuring callback: a non-function specified.'));
    });
    it('should return a new Promise', function() {
      var promise;
      promise = deferred.always(alwaysCallback);
      expect(promise).toBeInstanceOf('Deft.promise.Promise');
      expect(promise).not.toBe(deferred.promise);
    });
    it('should return a new Promise when a null callback is specified', function() {
      var promise;
      promise = deferred.always(null);
      expect(promise).toBeInstanceOf('Deft.promise.Promise');
      expect(promise).not.toBe(deferred.promise);
    });
    return it('should return a new Promise when an undefined callback is specified', function() {
      var promise;
      promise = deferred.always(void 0);
      expect(promise).toBeInstanceOf('Deft.promise.Promise');
      expect(promise).not.toBe(deferred.promise);
    });
  });
  describe('Return value propagation for callback registered with the new Promise returned by then()', function() {
    var cancelCallback, deferred, failureCallback, progressCallback, successCallback;
    deferred = null;
    successCallback = failureCallback = progressCallback = cancelCallback = null;
    beforeEach(function() {
      deferred = Ext.create('Deft.promise.Deferred');
      successCallback = jasmine.createSpy('success callback');
      failureCallback = jasmine.createSpy('failure callback');
      progressCallback = jasmine.createSpy('progress callback');
      cancelCallback = jasmine.createSpy('cancel callback');
    });
    it('should resolve that new Promise when the Deferred is resolved and the success callback returns a value', function() {
      var promise;
      promise = deferred.then({
        success: function(value) {
          return "processed " + value;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('processed value');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is resolved and the success callback throws an error', function() {
      var error, promise;
      error = new Error('error message');
      promise = deferred.then({
        success: function(value) {
          throw error;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith(error);
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should resolve that new Promise when the Deferred is rejected and the failure callback returns a value', function() {
      var promise;
      promise = deferred.then({
        failure: function(value) {
          return "processed " + value;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('processed error message');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is rejected and the failure callback throws an error', function() {
      var error, promise;
      error = new Error('error message');
      promise = deferred.then({
        failure: function(value) {
          throw error;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('value');
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith(error);
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should resolve that new Promise when the Deferred is cancelled and the cancel callback returns a value', function() {
      var promise;
      promise = deferred.then({
        cancel: function(value) {
          return "processed " + value;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('processed reason');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is cancelled and the cancel callback throws an error', function() {
      var error, promise;
      error = new Error('error message');
      promise = deferred.then({
        cancel: function(value) {
          throw error;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith(error);
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should resolve that new Promise when the Deferred is resolved and the success callback returns a resolved Deferred', function() {
      var promise;
      promise = deferred.then({
        success: function(value) {
          var deferredReturnValue;
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          deferredReturnValue.resolve("resolved " + value);
          return deferredReturnValue;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('resolved value');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is resolved and the success callback returns a rejected Deferred', function() {
      var promise;
      promise = deferred.then({
        success: function(value) {
          var deferredReturnValue;
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          deferredReturnValue.reject("rejected " + value);
          return deferredReturnValue;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith('rejected value');
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should cancel that new Promise when the Deferred is resolved and the success callback returns a cancelled Deferred', function() {
      var promise;
      promise = deferred.then({
        success: function(value) {
          var deferredReturnValue;
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          deferredReturnValue.cancel("cancelled " + value);
          return deferredReturnValue;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      expect(promise.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).toHaveBeenCalledWith('cancelled value');
    });
    it('should resolve that new Promise when the Deferred is rejected and the failure callback returns a resolved Deferred', function() {
      var promise;
      promise = deferred.then({
        failure: function(value) {
          var deferredReturnValue;
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          deferredReturnValue.resolve("resolved " + value);
          return deferredReturnValue;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('resolved error message');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is rejected and the failure callback returns a rejected Deferred', function() {
      var promise;
      promise = deferred.then({
        failure: function(value) {
          var deferredReturnValue;
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          deferredReturnValue.reject("rejected " + value);
          return deferredReturnValue;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith('rejected error message');
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should cancel that new Promise when the Deferred is rejected and the failure callback returns a cancelled Deferred', function() {
      var promise;
      promise = deferred.then({
        failure: function(value) {
          var deferredReturnValue;
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          deferredReturnValue.cancel("cancelled " + value);
          return deferredReturnValue;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      expect(promise.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).toHaveBeenCalledWith('cancelled error message');
    });
    it('should resolve that new Promise when the Deferred is cancelled and the cancel callback returns a resolved Deferred', function() {
      var promise;
      promise = deferred.then({
        cancel: function(value) {
          var deferredReturnValue;
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          deferredReturnValue.resolve("resolved " + value);
          return deferredReturnValue;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('resolved reason');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is cancelled and the cancel callback returns a rejected Deferred', function() {
      var promise;
      promise = deferred.then({
        cancel: function(value) {
          var deferredReturnValue;
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          deferredReturnValue.reject("rejected " + value);
          return deferredReturnValue;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith('rejected reason');
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should cancel that new Promise when the Deferred is cancelled and the cancel callback returns a cancelled Deferred', function() {
      var promise;
      promise = deferred.then({
        cancel: function(value) {
          var deferredReturnValue;
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          deferredReturnValue.cancel("cancelled " + value);
          return deferredReturnValue;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      expect(promise.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).toHaveBeenCalledWith('cancelled reason');
    });
    it('should resolve that new Promise when the Deferred is resolved and the success callback returns a Deferred that is later resolved', function() {
      var promise;
      promise = deferred.then({
        success: function(value) {
          var deferredReturnValue;
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          deferredReturnValue.resolve("resolved " + value);
          return deferredReturnValue;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('resolved value');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is resolved and the success callback returns a Deferred that is later rejected', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.then({
        success: function(value) {
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          return deferredReturnValue;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      deferredReturnValue.reject("rejected value");
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith('rejected value');
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should cancel that new Promise when the Deferred is resolved and the success callback returns a Deferred that is later cancelled', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.then({
        success: function(value) {
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          return deferredReturnValue;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      deferredReturnValue.cancel("cancelled value");
      expect(promise.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).toHaveBeenCalledWith('cancelled value');
    });
    it('should resolve that new Promise when the Deferred is rejected and the failure callback returns a Deferred that is later resolved', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.then({
        failure: function(value) {
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          return deferredReturnValue;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      deferredReturnValue.resolve("resolved error message");
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('resolved error message');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is rejected and the failure callback returns a Deferred that is later rejected', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.then({
        failure: function(value) {
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          return deferredReturnValue;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      deferredReturnValue.reject("rejected error message");
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith('rejected error message');
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should cancel that new Promise when the Deferred is rejected and the failure callback returns a Deferred that is later cancelled', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.then({
        failure: function(value) {
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          return deferredReturnValue;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      deferredReturnValue.cancel("cancelled error message");
      expect(promise.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).toHaveBeenCalledWith('cancelled error message');
    });
    it('should resolve that new Promise when the Deferred is cancelled and the cancel callback returns a Deferred that is later resolved', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.then({
        cancel: function(value) {
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          return deferredReturnValue;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      deferredReturnValue.resolve("resolved reason");
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('resolved reason');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is cancelled and the cancel callback returns a Deferred that is later rejected', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.then({
        cancel: function(value) {
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          return deferredReturnValue;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      deferredReturnValue.reject("rejected reason");
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith('rejected reason');
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should cancel that new Promise when the Deferred is cancelled and the cancel callback returns a Deferred that is later cancelled', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.then({
        cancel: function(value) {
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          return deferredReturnValue;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      deferredReturnValue.cancel("cancelled reason");
      expect(promise.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).toHaveBeenCalledWith('cancelled reason');
    });
    it('should resolve that new Promise when the Deferred is resolved and the success callback returns a resolved Promise', function() {
      var promise;
      promise = deferred.then({
        success: function(value) {
          var deferredReturnValue;
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          deferredReturnValue.resolve("resolved " + value);
          return deferredReturnValue.promise;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('resolved value');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is resolved and the success callback returns a rejected Promise', function() {
      var promise;
      promise = deferred.then({
        success: function(value) {
          var deferredReturnValue;
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          deferredReturnValue.reject("rejected " + value);
          return deferredReturnValue.promise;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith('rejected value');
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should cancel that new Promise when the Deferred is resolved and the success callback returns a cancelled Promise', function() {
      var promise;
      promise = deferred.then({
        success: function(value) {
          var deferredReturnValue;
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          deferredReturnValue.cancel("cancelled " + value);
          return deferredReturnValue.promise;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      expect(promise.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).toHaveBeenCalledWith('cancelled value');
    });
    it('should resolve that new Promise when the Deferred is rejected and the failure callback returns a resolved Promise', function() {
      var promise;
      promise = deferred.then({
        failure: function(value) {
          var deferredReturnValue;
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          deferredReturnValue.resolve("resolved " + value);
          return deferredReturnValue.promise;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('resolved error message');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is rejected and the failure callback returns a rejected Promise', function() {
      var promise;
      promise = deferred.then({
        failure: function(value) {
          var deferredReturnValue;
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          deferredReturnValue.reject("rejected " + value);
          return deferredReturnValue.promise;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith('rejected error message');
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should cancel that new Promise when the Deferred is rejected and the failure callback returns a cancelled Promise', function() {
      var promise;
      promise = deferred.then({
        failure: function(value) {
          var deferredReturnValue;
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          deferredReturnValue.cancel("cancelled " + value);
          return deferredReturnValue.promise;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      expect(promise.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).toHaveBeenCalledWith('cancelled error message');
    });
    it('should resolve that new Promise when the Deferred is cancelled and the cancel callback returns a resolved Promise', function() {
      var promise;
      promise = deferred.then({
        cancel: function(value) {
          var deferredReturnValue;
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          deferredReturnValue.resolve("resolved " + value);
          return deferredReturnValue.promise;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('resolved reason');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is cancelled and the cancel callback returns a rejected Promise', function() {
      var promise;
      promise = deferred.then({
        cancel: function(value) {
          var deferredReturnValue;
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          deferredReturnValue.reject("rejected " + value);
          return deferredReturnValue.promise;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith('rejected reason');
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should cancel that new Promise when the Deferred is cancelled and the cancel callback returns a cancelled Promise', function() {
      var promise;
      promise = deferred.then({
        cancel: function(value) {
          var deferredReturnValue;
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          deferredReturnValue.cancel("cancelled " + value);
          return deferredReturnValue.promise;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      expect(promise.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).toHaveBeenCalledWith('cancelled reason');
    });
    it('should resolve that new Promise when the Deferred is resolved and the success callback returns a Promise that is later resolved', function() {
      var promise;
      promise = deferred.then({
        success: function(value) {
          var deferredReturnValue;
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          deferredReturnValue.resolve("resolved " + value);
          return deferredReturnValue.promise;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('resolved value');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is resolved and the success callback returns a Promise that is later rejected', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.then({
        success: function(value) {
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          return deferredReturnValue.promise;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      deferredReturnValue.reject("rejected value");
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith('rejected value');
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should cancel that new Promise when the Deferred is resolved and the success callback returns a Promise that is later cancelled', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.then({
        success: function(value) {
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          return deferredReturnValue.promise;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      deferredReturnValue.cancel("cancelled value");
      expect(promise.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).toHaveBeenCalledWith('cancelled value');
    });
    it('should resolve that new Promise when the Deferred is rejected and the failure callback returns a Promise that is later resolved', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.then({
        failure: function(value) {
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          return deferredReturnValue.promise;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      deferredReturnValue.resolve("resolved error message");
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('resolved error message');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is rejected and the failure callback returns a Promise that is later rejected', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.then({
        failure: function(value) {
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          return deferredReturnValue.promise;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      deferredReturnValue.reject("rejected error message");
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith('rejected error message');
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should cancel that new Promise when the Deferred is rejected and the failure callback returns a Promise that is later cancelled', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.then({
        failure: function(value) {
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          return deferredReturnValue.promise;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      deferredReturnValue.cancel("cancelled error message");
      expect(promise.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).toHaveBeenCalledWith('cancelled error message');
    });
    it('should resolve that new Promise when the Deferred is cancelled and the cancel callback returns a Promise that is later resolved', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.then({
        cancel: function(value) {
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          return deferredReturnValue.promise;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      deferredReturnValue.resolve("resolved reason");
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('resolved reason');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is cancelled and the cancel callback returns a Promise that is later rejected', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.then({
        cancel: function(value) {
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          return deferredReturnValue.promise;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      deferredReturnValue.reject("rejected reason");
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith('rejected reason');
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is cancelled and the cancel callback returns a Promise that is later rejected', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.then({
        cancel: function(value) {
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          return deferredReturnValue.promise;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      deferredReturnValue.cancel("cancelled reason");
      expect(promise.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).toHaveBeenCalledWith('cancelled reason');
    });
    it('should update with the value and not complete that new Promise when the Deferred is updated and the callback returns a value', function() {
      var promise;
      promise = deferred.then({
        progress: function(value) {
          return "processed " + value;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.update('progress');
      expect(promise.getState()).toBe('pending');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).toHaveBeenCalledWith('processed progress');
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should update with the value and not complete that new Promise when the Deferred is updated and the callback returns a Deferred', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.then({
        progress: function(value) {
          deferredReturnValue = Ext.create('Deft.promise.Deferred');
          return deferredReturnValue;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.update('progress');
      expect(promise.getState()).toBe('pending');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).toHaveBeenCalledWith(deferredReturnValue);
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    return it('should update with the value and not complete that new Promise when the Deferred is updated and the callback returns a Promise', function() {
      var promise, promiseReturnValue;
      promiseReturnValue = null;
      promise = deferred.then({
        progress: function(value) {
          promiseReturnValue = Ext.create('Deft.promise.Deferred').promise;
          return promiseReturnValue;
        }
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.update('progress');
      expect(promise.getState()).toBe('pending');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).toHaveBeenCalledWith(promiseReturnValue);
      expect(cancelCallback).not.toHaveBeenCalled();
    });
  });
  return describe('Return value propagation for callback registered with the new Promise returned by always()', function() {
    var cancelCallback, deferred, failureCallback, progressCallback, successCallback;
    deferred = null;
    successCallback = failureCallback = progressCallback = cancelCallback = null;
    beforeEach(function() {
      deferred = Ext.create('Deft.promise.Deferred');
      successCallback = jasmine.createSpy('success callback');
      failureCallback = jasmine.createSpy('failure callback');
      progressCallback = jasmine.createSpy('progress callback');
      cancelCallback = jasmine.createSpy('cancel callback');
    });
    it('should resolve that new Promise when the Deferred is resolved and the callback returns a value', function() {
      var promise;
      promise = deferred.always(function(value) {
        return "processed " + value;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('processed value');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is resolved and the callback throws an error', function() {
      var error, promise;
      error = new Error('error message');
      promise = deferred.always(function(value) {
        throw error;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith(error);
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should resolve that new Promise when the Deferred is rejected and the callback returns a value', function() {
      var promise;
      promise = deferred.always(function(value) {
        return "processed " + value;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('processed error message');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is rejected and the callback throws an error', function() {
      var error, promise;
      error = new Error('error message');
      promise = deferred.always(function(value) {
        throw error;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('value');
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith(error);
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should resolve that new Promise when the Deferred is cancelled and the callback returns a value', function() {
      var promise;
      promise = deferred.always(function(value) {
        return "processed " + value;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('processed reason');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is cancelled and the callback throws an error', function() {
      var error, promise;
      error = new Error('error message');
      promise = deferred.always(function(value) {
        throw error;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith(error);
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should resolve that new Promise when the Deferred is resolved and the callback returns a resolved Deferred', function() {
      var promise;
      promise = deferred.always(function(value) {
        var deferredReturnValue;
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        deferredReturnValue.resolve("resolved " + value);
        return deferredReturnValue;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('resolved value');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is resolved and the callback returns a rejected Deferred', function() {
      var promise;
      promise = deferred.always(function(value) {
        var deferredReturnValue;
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        deferredReturnValue.reject("rejected " + value);
        return deferredReturnValue;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith('rejected value');
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should cancel that new Promise when the Deferred is resolved and the callback returns a cancelled Deferred', function() {
      var promise;
      promise = deferred.always(function(value) {
        var deferredReturnValue;
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        deferredReturnValue.cancel("cancelled " + value);
        return deferredReturnValue;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      expect(promise.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).toHaveBeenCalledWith('cancelled value');
    });
    it('should resolve that new Promise when the Deferred is rejected and the callback returns a resolved Deferred', function() {
      var promise;
      promise = deferred.always(function(value) {
        var deferredReturnValue;
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        deferredReturnValue.resolve("resolved " + value);
        return deferredReturnValue;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('resolved error message');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is rejected and the callback returns a rejected Deferred', function() {
      var promise;
      promise = deferred.always(function(value) {
        var deferredReturnValue;
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        deferredReturnValue.reject("rejected " + value);
        return deferredReturnValue;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith('rejected error message');
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should cancel that new Promise when the Deferred is rejected and the callback returns a cancelled Deferred', function() {
      var promise;
      promise = deferred.always(function(value) {
        var deferredReturnValue;
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        deferredReturnValue.cancel("cancelled " + value);
        return deferredReturnValue;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      expect(promise.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).toHaveBeenCalledWith('cancelled error message');
    });
    it('should resolve that new Promise when the Deferred is cancelled and the callback returns a resolved Deferred', function() {
      var promise;
      promise = deferred.always(function(value) {
        var deferredReturnValue;
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        deferredReturnValue.resolve("resolved " + value);
        return deferredReturnValue;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('resolved reason');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is cancelled and the callback returns a rejected Deferred', function() {
      var promise;
      promise = deferred.always(function(value) {
        var deferredReturnValue;
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        deferredReturnValue.reject("rejected " + value);
        return deferredReturnValue;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith('rejected reason');
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should cancel that new Promise when the Deferred is cancelled and the callback returns a cancelled Deferred', function() {
      var promise;
      promise = deferred.always(function(value) {
        var deferredReturnValue;
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        deferredReturnValue.cancel("cancelled " + value);
        return deferredReturnValue;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      expect(promise.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).toHaveBeenCalledWith('cancelled reason');
    });
    it('should resolve that new Promise when the Deferred is resolved and the callback returns a Deferred that is later resolved', function() {
      var promise;
      promise = deferred.always(function(value) {
        var deferredReturnValue;
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        deferredReturnValue.resolve("resolved " + value);
        return deferredReturnValue;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('resolved value');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is resolved and the callback returns a Deferred that is later rejected', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.always(function(value) {
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        return deferredReturnValue;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      deferredReturnValue.reject("rejected value");
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith('rejected value');
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should cancel that new Promise when the Deferred is resolved and the callback returns a Deferred that is later cancelled', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.always(function(value) {
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        return deferredReturnValue;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      deferredReturnValue.cancel("cancelled value");
      expect(promise.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).toHaveBeenCalledWith('cancelled value');
    });
    it('should resolve that new Promise when the Deferred is rejected and the callback returns a Deferred that is later resolved', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.always(function(value) {
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        return deferredReturnValue;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      deferredReturnValue.resolve("resolved error message");
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('resolved error message');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is rejected and the callback returns a Deferred that is later rejected', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.always(function(value) {
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        return deferredReturnValue;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      deferredReturnValue.reject("rejected error message");
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith('rejected error message');
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should cancel that new Promise when the Deferred is rejected and the callback returns a Deferred that is later cancelled', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.always(function(value) {
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        return deferredReturnValue;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      deferredReturnValue.cancel("cancelled error message");
      expect(promise.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).toHaveBeenCalledWith('cancelled error message');
    });
    it('should resolve that new Promise when the Deferred is cancelled and the callback returns a Deferred that is later resolved', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.always(function(value) {
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        return deferredReturnValue;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      deferredReturnValue.resolve("resolved reason");
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('resolved reason');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is cancelled and the callback returns a Deferred that is later rejected', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.always(function(value) {
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        return deferredReturnValue;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      deferredReturnValue.reject("rejected reason");
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith('rejected reason');
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should cancel that new Promise when the Deferred is cancelled and the callback returns a Deferred that is later cancelled', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.always(function(value) {
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        return deferredReturnValue;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      deferredReturnValue.cancel("cancelled reason");
      expect(promise.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).toHaveBeenCalledWith('cancelled reason');
    });
    it('should resolve that new Promise when the Deferred is resolved and the callback returns a resolved Promise', function() {
      var promise;
      promise = deferred.always(function(value) {
        var deferredReturnValue;
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        deferredReturnValue.resolve("resolved " + value);
        return deferredReturnValue.promise;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('resolved value');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is resolved and the callback returns a rejected Promise', function() {
      var promise;
      promise = deferred.always(function(value) {
        var deferredReturnValue;
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        deferredReturnValue.reject("rejected " + value);
        return deferredReturnValue.promise;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith('rejected value');
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should cancel that new Promise when the Deferred is resolved and the callback returns a cancelled Promise', function() {
      var promise;
      promise = deferred.always(function(value) {
        var deferredReturnValue;
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        deferredReturnValue.cancel("cancelled " + value);
        return deferredReturnValue.promise;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      expect(promise.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).toHaveBeenCalledWith('cancelled value');
    });
    it('should resolve that new Promise when the Deferred is rejected and the callback returns a resolved Promise', function() {
      var promise;
      promise = deferred.always(function(value) {
        var deferredReturnValue;
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        deferredReturnValue.resolve("resolved " + value);
        return deferredReturnValue.promise;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('resolved error message');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is rejected and the callback returns a rejected Promise', function() {
      var promise;
      promise = deferred.always(function(value) {
        var deferredReturnValue;
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        deferredReturnValue.reject("rejected " + value);
        return deferredReturnValue.promise;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith('rejected error message');
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should cancel that new Promise when the Deferred is rejected and the callback returns a cancelled Promise', function() {
      var promise;
      promise = deferred.always(function(value) {
        var deferredReturnValue;
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        deferredReturnValue.cancel("cancelled " + value);
        return deferredReturnValue.promise;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      expect(promise.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).toHaveBeenCalledWith('cancelled error message');
    });
    it('should resolve that new Promise when the Deferred is cancelled and the callback returns a resolved Promise', function() {
      var promise;
      promise = deferred.always(function(value) {
        var deferredReturnValue;
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        deferredReturnValue.resolve("resolved " + value);
        return deferredReturnValue.promise;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('resolved reason');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is cancelled and the callback returns a rejected Promise', function() {
      var promise;
      promise = deferred.always(function(value) {
        var deferredReturnValue;
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        deferredReturnValue.reject("rejected " + value);
        return deferredReturnValue.promise;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith('rejected reason');
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should cancel that new Promise when the Deferred is cancelled and the callback returns a cancelled Promise', function() {
      var promise;
      promise = deferred.always(function(value) {
        var deferredReturnValue;
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        deferredReturnValue.cancel("cancelled " + value);
        return deferredReturnValue.promise;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      expect(promise.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).toHaveBeenCalledWith('cancelled reason');
    });
    it('should resolve that new Promise when the Deferred is resolved and the callback returns a Promise that is later resolved', function() {
      var promise;
      promise = deferred.always(function(value) {
        var deferredReturnValue;
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        deferredReturnValue.resolve("resolved " + value);
        return deferredReturnValue.promise;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('resolved value');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is resolved and the callback returns a Promise that is later rejected', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.always(function(value) {
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        return deferredReturnValue.promise;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      deferredReturnValue.reject("rejected value");
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith('rejected value');
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should cancel that new Promise when the Deferred is resolved and the callback returns a Promise that is later cancelled', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.always(function(value) {
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        return deferredReturnValue.promise;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.resolve('value');
      deferredReturnValue.cancel("cancelled value");
      expect(promise.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).toHaveBeenCalledWith('cancelled value');
    });
    it('should resolve that new Promise when the Deferred is rejected and the callback returns a Promise that is later resolved', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.always(function(value) {
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        return deferredReturnValue.promise;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      deferredReturnValue.resolve("resolved error message");
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('resolved error message');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is rejected and the callback returns a Promise that is later rejected', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.always(function(value) {
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        return deferredReturnValue.promise;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      deferredReturnValue.reject("rejected error message");
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith('rejected error message');
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should cancel that new Promise when the Deferred is rejected and the callback returns a Promise that is later cancelled', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.always(function(value) {
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        return deferredReturnValue.promise;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.reject('error message');
      deferredReturnValue.cancel("cancelled error message");
      expect(promise.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).toHaveBeenCalledWith('cancelled error message');
    });
    it('should resolve that new Promise when the Deferred is cancelled and the callback returns a Promise that is later resolved', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.always(function(value) {
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        return deferredReturnValue.promise;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      deferredReturnValue.resolve("resolved reason");
      expect(promise.getState()).toBe('resolved');
      expect(successCallback).toHaveBeenCalledWith('resolved reason');
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    it('should reject that new Promise when the Deferred is cancelled and the callback returns a Promise that is later rejected', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.always(function(value) {
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        return deferredReturnValue.promise;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      deferredReturnValue.reject("rejected reason");
      expect(promise.getState()).toBe('rejected');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledWith('rejected reason');
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).not.toHaveBeenCalled();
    });
    return it('should cancel that new Promise when the Deferred is cancelled and the callback returns a Promise that is later cancelled', function() {
      var deferredReturnValue, promise;
      deferredReturnValue = null;
      promise = deferred.always(function(value) {
        deferredReturnValue = Ext.create('Deft.promise.Deferred');
        return deferredReturnValue.promise;
      });
      promise.then(successCallback, failureCallback, progressCallback, cancelCallback);
      deferred.cancel('reason');
      deferredReturnValue.cancel("cancelled reason");
      expect(promise.getState()).toBe('cancelled');
      expect(successCallback).not.toHaveBeenCalled();
      expect(failureCallback).not.toHaveBeenCalled();
      expect(progressCallback).not.toHaveBeenCalled();
      expect(cancelCallback).toHaveBeenCalledWith('cancelled reason');
    });
  });
});
