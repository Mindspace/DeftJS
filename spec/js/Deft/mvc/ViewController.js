/*
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/
/*
Jasmine test suite for Deft.mvc.ViewController
*/
describe('Deft.mvc.ViewController', function() {
  describe('Configuration', function() {
    it('should be configurable with a reference to the view it controls', function() {
      var view, viewController;
      view = Ext.create('Ext.Container');
      viewController = Ext.create('Deft.mvc.ViewController', {
        view: view
      });
      return expect(viewController.getView()).toBe(view);
    });
    it('should throw an error if created without being configured for a view', function() {
      return expect(function() {
        return Ext.create('Deft.mvc.ViewController');
      }).toThrow(new Error('Error constructing ViewController: the configured \'view\' is not an Ext.Component.'));
    });
    return it('should throw an error if created and configured with a non-Ext.Component as the view', function() {
      return expect(function() {
        return Ext.create('Deft.mvc.ViewController', {
          view: new Object()
        });
      }).toThrow(new Error("Error constructing ViewController: the configured 'view' is not an Ext.Component."));
    });
  });
  describe('Creation of getters and event listeners using the \'control\' property', function() {
    beforeEach(function() {
      Ext.define('ExampleComponent', {
        extend: 'Ext.Component',
        alias: 'widget.example',
        initComponent: function(config) {
          this.addEvents({
            exampleevent: true
          });
          return this.callParent(arguments);
        },
        fireExampleEvent: function(value) {
          this.fireEvent('exampleevent', value);
        }
      });
      Ext.define('ExampleView', {
        extend: 'Ext.Container',
        renderTo: 'componentTestArea',
        items: [
          {
            xtype: 'example',
            itemId: 'example'
          }
        ],
        config: {
          items: [
            {
              xtype: 'example',
              itemId: 'example'
            }
          ]
        },
        initComponent: function(config) {
          this.addEvents({
            exampleevent: true
          });
          return this.callParent(arguments);
        },
        fireExampleEvent: function(value) {
          this.fireEvent('exampleevent', value);
        }
      });
      return Ext.DomHelper.append(Ext.getBody(), '<div id="componentTestArea" style="visibility: hidden"></div>');
    });
    afterEach(function() {
      return Ext.removeNode(Ext.get('componentTestArea').dom);
    });
    it('should attach view controller scoped event listeners to events for the view', function() {
      var view, viewController;
      Ext.define('ExampleViewController', {
        extend: 'Deft.mvc.ViewController',
        control: {
          view: {
            exampleevent: 'onExampleViewExampleEvent'
          }
        },
        onExampleViewExampleEvent: function(event) {}
      });
      spyOn(ExampleViewController.prototype, 'onExampleViewExampleEvent').andCallFake(function(value) {
        expect(this).toBe(viewController);
        return expect(value).toBe('expected value');
      });
      view = Ext.create('ExampleView');
      viewController = Ext.create('ExampleViewController', {
        view: view
      });
      expect(viewController.getView()).toBe(view);
      expect(view.hasListener('exampleevent')).toBe(true);
      view.fireExampleEvent('expected value');
      expect(viewController.onExampleViewExampleEvent).toHaveBeenCalled();
      return expect(viewController.onExampleViewExampleEvent.callCount).toBe(1);
    });
    it('should attach view controller scoped event listeners (with options) to events for the view', function() {
      var view, viewController;
      Ext.define('ExampleViewController', {
        extend: 'Deft.mvc.ViewController',
        control: {
          view: {
            exampleevent: {
              fn: 'onExampleViewExampleEvent',
              single: true
            }
          }
        },
        onExampleViewExampleEvent: function(event) {}
      });
      spyOn(ExampleViewController.prototype, 'onExampleViewExampleEvent').andCallFake(function(value) {
        expect(this).toBe(viewController);
        return expect(value).toBe('expected value');
      });
      view = Ext.create('ExampleView');
      viewController = Ext.create('ExampleViewController', {
        view: view
      });
      expect(viewController.getView()).toBe(view);
      expect(view.hasListener('exampleevent')).toBe(true);
      view.fireExampleEvent('expected value');
      view.fireExampleEvent('expected value');
      expect(viewController.onExampleViewExampleEvent).toHaveBeenCalled();
      return expect(viewController.onExampleViewExampleEvent.callCount).toBe(1);
    });
    it('should attach event listeners (with options) to events for the view', function() {
      var eventListenerFunction, expectedScope, view, viewController;
      expectedScope = {};
      eventListenerFunction = jasmine.createSpy('event listener').andCallFake(function(value) {
        expect(this).toBe(expectedScope);
        return expect(value).toBe('expected value');
      });
      Ext.define('ExampleViewController', {
        extend: 'Deft.mvc.ViewController',
        control: {
          view: {
            exampleevent: {
              fn: eventListenerFunction,
              scope: expectedScope,
              single: true
            }
          }
        }
      });
      view = Ext.create('ExampleView');
      viewController = Ext.create('ExampleViewController', {
        view: view
      });
      expect(viewController.getView()).toBe(view);
      expect(view.hasListener('exampleevent')).toBe(true);
      view.fireExampleEvent('expected value');
      view.fireExampleEvent('expected value');
      expect(eventListenerFunction).toHaveBeenCalled();
      return expect(eventListenerFunction.callCount).toBe(1);
    });
    it('should throw an error when attaching a non-existing view controller scoped event listener for the view', function() {
      var view;
      Ext.define('ExampleViewController', {
        extend: 'Deft.mvc.ViewController',
        control: {
          view: {
            exampleevent: 'onExampleViewExampleEvent'
          }
        }
      });
      view = Ext.create('ExampleView');
      return expect(function() {
        var viewController;
        return viewController = Ext.create('ExampleViewController', {
          view: view
        });
      }).toThrow('Error adding \'exampleevent\' listener: the specified handler \'onExampleViewExampleEvent\' is not a Function or does not exist.');
    });
    it('should create a view controller getter for a view component referenced implicitly by itemId', function() {
      var component, view, viewController;
      Ext.define('ExampleViewController', {
        extend: 'Deft.mvc.ViewController',
        control: {
          example: true
        }
      });
      view = Ext.create('ExampleView');
      viewController = Ext.create('ExampleViewController', {
        view: view
      });
      component = view.query('#example')[0];
      expect(viewController.getView()).toBe(view);
      return expect(viewController.getExample()).toBe(component);
    });
    it('should throw an error when referencing a non-existent component implicitly by itemId', function() {
      var view;
      Ext.define('ExampleViewController', {
        extend: 'Deft.mvc.ViewController',
        control: {
          doesntexist: true
        }
      });
      view = Ext.create('ExampleView');
      return expect(function() {
        var viewController;
        return viewController = Ext.create('ExampleViewController', {
          view: view
        });
      }).toThrow('Error locating component: no component found with an itemId of \'doesntexist\'.');
    });
    it('should create a view controller getter for a view component referenced implicitly by selector', function() {
      var component, view, viewController;
      Ext.define('ExampleViewController', {
        extend: 'Deft.mvc.ViewController',
        control: {
          example: "#example"
        }
      });
      view = Ext.create('ExampleView');
      viewController = Ext.create('ExampleViewController', {
        view: view
      });
      component = view.query('#example')[0];
      expect(viewController.getView()).toBe(view);
      return expect(viewController.getExample()).toBe(component);
    });
    it('should throw an error when referencing a non-existent component implicitly by selector', function() {
      var view;
      Ext.define('ExampleViewController', {
        extend: 'Deft.mvc.ViewController',
        control: {
          example: '#doesntexist'
        }
      });
      view = Ext.create('ExampleView');
      return expect(function() {
        var viewController;
        return viewController = Ext.create('ExampleViewController', {
          view: view
        });
      }).toThrow('Error locating component: no component found matching \'#doesntexist\'.');
    });
    it('should create a view controller getter for a view component referenced explicitly by selector', function() {
      var component, view, viewController;
      Ext.define('ExampleViewController', {
        extend: 'Deft.mvc.ViewController',
        control: {
          example: {
            selector: "#example"
          }
        }
      });
      view = Ext.create('ExampleView');
      viewController = Ext.create('ExampleViewController', {
        view: view
      });
      component = view.query('#example')[0];
      expect(viewController.getView()).toBe(view);
      return expect(viewController.getExample()).toBe(component);
    });
    it('should throw an error when referencing a non-existent component explicitly by selector', function() {
      var view;
      Ext.define('ExampleViewController', {
        extend: 'Deft.mvc.ViewController',
        control: {
          example: {
            selector: '#doesntexist'
          }
        }
      });
      view = Ext.create('ExampleView');
      return expect(function() {
        var viewController;
        return viewController = Ext.create('ExampleViewController', {
          view: view
        });
      }).toThrow('Error locating component: no component found matching \'#doesntexist\'.');
    });
    it('should create a view controller getter and attach view controller scoped event listeners to events for a view component referenced implicitly by itemId', function() {
      var component, view, viewController;
      Ext.define('ExampleViewController', {
        extend: 'Deft.mvc.ViewController',
        control: {
          example: {
            exampleevent: 'onExampleComponentExampleEvent'
          }
        },
        onExampleComponentExampleEvent: function() {}
      });
      spyOn(ExampleViewController.prototype, 'onExampleComponentExampleEvent').andCallFake(function(value) {
        expect(this).toBe(viewController);
        return expect(value).toBe('expected value');
      });
      view = Ext.create('ExampleView');
      viewController = Ext.create('ExampleViewController', {
        view: view
      });
      component = view.query('#example')[0];
      expect(viewController.getView()).toBe(view);
      expect(viewController.getExample()).toBe(component);
      expect(component.hasListener('exampleevent')).toBe(true);
      component.fireExampleEvent('expected value');
      expect(viewController.onExampleComponentExampleEvent).toHaveBeenCalled();
      return expect(viewController.onExampleComponentExampleEvent.callCount).toBe(1);
    });
    it('should create a view controller getter and attach view controller scoped event listeners (with options) to events for a view component referenced implicitly by itemId', function() {
      var component, view, viewController;
      Ext.define('ExampleViewController', {
        extend: 'Deft.mvc.ViewController',
        control: {
          example: {
            exampleevent: {
              fn: 'onExampleComponentExampleEvent',
              single: true
            }
          }
        },
        onExampleComponentExampleEvent: function() {}
      });
      spyOn(ExampleViewController.prototype, 'onExampleComponentExampleEvent').andCallFake(function(value) {
        expect(this).toBe(viewController);
        return expect(value).toBe('expected value');
      });
      view = Ext.create('ExampleView');
      viewController = Ext.create('ExampleViewController', {
        view: view
      });
      component = view.query('#example')[0];
      expect(viewController.getView()).toBe(view);
      expect(viewController.getExample()).toBe(component);
      expect(component.hasListener('exampleevent')).toBe(true);
      component.fireExampleEvent('expected value');
      component.fireExampleEvent('expected value');
      expect(viewController.onExampleComponentExampleEvent).toHaveBeenCalled();
      return expect(viewController.onExampleComponentExampleEvent.callCount).toBe(1);
    });
    it('should create a view controller getter and attach event listeners (with options) to events for a view component referenced implicitly by itemId', function() {
      var component, eventListenerFunction, expectedScope, view, viewController;
      expectedScope = {};
      eventListenerFunction = jasmine.createSpy('event listener').andCallFake(function(value) {
        expect(this).toBe(expectedScope);
        return expect(value).toBe('expected value');
      });
      Ext.define('ExampleViewController', {
        extend: 'Deft.mvc.ViewController',
        control: {
          example: {
            exampleevent: {
              fn: eventListenerFunction,
              scope: expectedScope,
              single: true
            }
          }
        }
      });
      view = Ext.create('ExampleView');
      viewController = Ext.create('ExampleViewController', {
        view: view
      });
      component = view.query('#example')[0];
      expect(viewController.getView()).toBe(view);
      expect(viewController.getExample()).toBe(component);
      expect(component.hasListener('exampleevent')).toBe(true);
      component.fireExampleEvent('expected value');
      component.fireExampleEvent('expected value');
      expect(eventListenerFunction).toHaveBeenCalled();
      return expect(eventListenerFunction.callCount).toBe(1);
    });
    it('should throw an error when attaching a non-existing view controller scoped event listener for a view component referenced implicitly by itemId', function() {
      var view;
      Ext.define('ExampleViewController', {
        extend: 'Deft.mvc.ViewController',
        control: {
          example: {
            exampleevent: 'onExampleComponentExampleEvent'
          }
        }
      });
      view = Ext.create('ExampleView');
      return expect(function() {
        var viewController;
        return viewController = Ext.create('ExampleViewController', {
          view: view
        });
      }).toThrow('Error adding \'exampleevent\' listener: the specified handler \'onExampleComponentExampleEvent\' is not a Function or does not exist.');
    });
    it('should create a view controller getter and attach view controller scoped event listeners to events for a view component referenced by selector', function() {
      var component, view, viewController;
      Ext.define('ExampleViewController', {
        extend: 'Deft.mvc.ViewController',
        control: {
          example: {
            selector: '#example',
            listeners: {
              exampleevent: 'onExampleComponentExampleEvent'
            }
          }
        },
        onExampleComponentExampleEvent: function() {}
      });
      spyOn(ExampleViewController.prototype, 'onExampleComponentExampleEvent').andCallFake(function(value) {
        expect(this).toBe(viewController);
        return expect(value).toBe('expected value');
      });
      view = Ext.create('ExampleView');
      viewController = Ext.create('ExampleViewController', {
        view: view
      });
      component = view.query('#example')[0];
      expect(viewController.getView()).toBe(view);
      expect(viewController.getExample()).toBe(component);
      expect(component.hasListener('exampleevent')).toBe(true);
      component.fireExampleEvent('expected value');
      expect(viewController.onExampleComponentExampleEvent).toHaveBeenCalled();
      return expect(viewController.onExampleComponentExampleEvent.callCount).toBe(1);
    });
    it('should create a view controller getter and attach view controller scoped event listeners (with options) to events for a view component referenced by selector', function() {
      var component, view, viewController;
      Ext.define('ExampleViewController', {
        extend: 'Deft.mvc.ViewController',
        control: {
          example: {
            selector: '#example',
            listeners: {
              exampleevent: {
                fn: 'onExampleComponentExampleEvent',
                single: true
              }
            }
          }
        },
        onExampleComponentExampleEvent: function() {}
      });
      spyOn(ExampleViewController.prototype, 'onExampleComponentExampleEvent').andCallFake(function(value) {
        expect(this).toBe(viewController);
        return expect(value).toBe('expected value');
      });
      view = Ext.create('ExampleView');
      viewController = Ext.create('ExampleViewController', {
        view: view
      });
      component = view.query('#example')[0];
      expect(viewController.getView()).toBe(view);
      expect(viewController.getExample()).toBe(component);
      expect(component.hasListener('exampleevent')).toBe(true);
      component.fireExampleEvent('expected value');
      component.fireExampleEvent('expected value');
      expect(viewController.onExampleComponentExampleEvent).toHaveBeenCalled();
      return expect(viewController.onExampleComponentExampleEvent.callCount).toBe(1);
    });
    it('should create a view controller getter and attach event listeners (with options) to events for a view component referenced by selector', function() {
      var component, eventListenerFunction, expectedScope, view, viewController;
      expectedScope = {};
      eventListenerFunction = jasmine.createSpy('event listener').andCallFake(function(value) {
        expect(this).toBe(expectedScope);
        return expect(value).toBe('expected value');
      });
      Ext.define('ExampleViewController', {
        extend: 'Deft.mvc.ViewController',
        control: {
          example: {
            selector: '#example',
            listeners: {
              exampleevent: {
                fn: eventListenerFunction,
                scope: expectedScope,
                single: true
              }
            }
          }
        }
      });
      view = Ext.create('ExampleView');
      viewController = Ext.create('ExampleViewController', {
        view: view
      });
      component = view.query('#example')[0];
      expect(viewController.getView()).toBe(view);
      expect(viewController.getExample()).toBe(component);
      expect(component.hasListener('exampleevent')).toBe(true);
      component.fireExampleEvent('expected value');
      component.fireExampleEvent('expected value');
      expect(eventListenerFunction).toHaveBeenCalled();
      return expect(eventListenerFunction.callCount).toBe(1);
    });
    return it('should throw an error when attaching a non-existing view controller scoped event listener for a view component referenced implicitly by selector', function() {
      var view;
      Ext.define('ExampleViewController', {
        extend: 'Deft.mvc.ViewController',
        control: {
          example: {
            selector: '#example',
            listeners: {
              exampleevent: 'onExampleComponentExampleEvent'
            }
          }
        }
      });
      view = Ext.create('ExampleView');
      return expect(function() {
        var viewController;
        return viewController = Ext.create('ExampleViewController', {
          view: view
        });
      }).toThrow('Error adding \'exampleevent\' listener: the specified handler \'onExampleComponentExampleEvent\' is not a Function or does not exist.');
    });
  });
  return describe('Destruction and clean-up', function() {
    beforeEach(function() {
      Ext.define('ExampleComponent', {
        extend: 'Ext.Component',
        alias: 'widget.example',
        initComponent: function(config) {
          this.addEvents({
            exampleevent: true
          });
          return this.callParent(arguments);
        }
      });
      Ext.define('ExampleView', {
        extend: 'Ext.Container',
        renderTo: 'componentTestArea',
        items: [
          {
            xtype: 'example',
            itemId: 'example'
          }
        ],
        config: {
          items: [
            {
              xtype: 'example',
              itemId: 'example'
            }
          ]
        },
        initComponent: function(config) {
          this.addEvents({
            exampleevent: true
          });
          return this.callParent(arguments);
        }
      });
      return Ext.DomHelper.append(Ext.getBody(), '<div id="componentTestArea" style="visibility: hidden"></div>');
    });
    afterEach(function() {
      return Ext.removeNode(Ext.get('componentTestArea').dom);
    });
    it('should be called to destroy() when the associated view is destroyed', function() {
      var isViewDestroyed, view, viewController;
      Ext.define('ExampleViewController', {
        extend: 'Deft.mvc.ViewController'
      });
      view = Ext.create('ExampleView');
      viewController = Ext.create('ExampleViewController', {
        view: view
      });
      spyOn(viewController, 'destroy').andCallThrough();
      isViewDestroyed = false;
      view.on('destroy', function() {
        return isViewDestroyed = true;
      });
      view.destroy();
      expect(viewController.destroy).toHaveBeenCalled();
      return expect(isViewDestroyed).toBe(true);
    });
    it('should cancel view destruction if the view controller\'s destroy() returns false', function() {
      var isViewDestroyed, view, viewController;
      Ext.define('ExampleViewController', {
        extend: 'Deft.mvc.ViewController',
        destroy: function() {
          return false;
        }
      });
      view = Ext.create('ExampleView');
      viewController = Ext.create('ExampleViewController', {
        view: view
      });
      spyOn(viewController, 'destroy').andCallThrough();
      isViewDestroyed = false;
      view.on('destroy', function() {
        return isViewDestroyed = true;
      });
      view.destroy();
      expect(viewController.destroy).toHaveBeenCalled();
      return expect(isViewDestroyed).toBe(false);
    });
    it('should remove event listeners it attached to the view when the associated view (and view controller) is destroyed', function() {
      var isViewDestroyed, view, viewController;
      Ext.define('ExampleViewController', {
        extend: 'Deft.mvc.ViewController',
        control: {
          view: {
            exampleevent: 'onExampleViewExampleEvent'
          }
        },
        onExampleViewExampleEvent: function(event) {}
      });
      view = Ext.create('ExampleView');
      viewController = Ext.create('ExampleViewController', {
        view: view
      });
      expect(view.hasListener('exampleevent')).toBe(true);
      spyOn(viewController, 'destroy').andCallThrough();
      isViewDestroyed = false;
      view.on('destroy', function() {
        return isViewDestroyed = true;
      });
      view.destroy();
      expect(viewController.destroy).toHaveBeenCalled();
      expect(isViewDestroyed).toBe(true);
      return expect(view.hasListener('exampleevent')).toBe(false);
    });
    return it('should remove event listeners it attached to view components when the associated view (and view controller) is destroyed', function() {
      var component, isViewDestroyed, view, viewController;
      Ext.define('ExampleViewController', {
        extend: 'Deft.mvc.ViewController',
        control: {
          example: {
            selector: '#example',
            listeners: {
              exampleevent: 'onExampleComponentExampleEvent'
            }
          }
        },
        onExampleComponentExampleEvent: function() {}
      });
      view = Ext.create('ExampleView');
      viewController = Ext.create('ExampleViewController', {
        view: view
      });
      component = view.query('#example')[0];
      expect(component.hasListener('exampleevent')).toBe(true);
      spyOn(viewController, 'destroy').andCallThrough();
      isViewDestroyed = false;
      view.on('destroy', function() {
        return isViewDestroyed = true;
      });
      view.destroy();
      expect(viewController.destroy).toHaveBeenCalled();
      expect(isViewDestroyed).toBe(true);
      return expect(component.hasListener('exampleevent')).toBe(false);
    });
  });
});
