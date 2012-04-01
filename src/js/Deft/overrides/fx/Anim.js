
/*
  @author Thomas Burleson

  Consider the scenario where we get a promise for user details (loaded from server):

		function loadPage() {

			// Build proxy and operation

			var proxy = Ext.create('Ext.data.proxy.Ajax',
							{
								url : 'userDetails.php'
							}
						),
				operation = Ext.create('Ext.data.Operation',
					{
						action : 'read',
						params : { id : 21323 }
					}
				);

			// Issue the Ajax/XHR request, then return
			// a promise to allow extra response notifications

			return proxy.doRequest( operation )
				 .promise()
				 .then (
					// intercept response and extract data
					function (response) {
						return (response.success) ?
							   response.data      :
							   throw new Error("Call failed!");
					},
					// extract fault message
					function (fault){
						return fault.message;
					}
				 );

		}
*/

(function() {

  Ext.define('Deft.overrides.fx.Anim', {
    override: 'Ext.fx.Anim',
    /*
    		Override construction to intercept the animation complete {Function} callback
    		which is replaced with a notification wrapper to a promise resolve and original
    		callback trigger (if defined).
    
    		Note that here we expose the promise instance as a flyweight accessor for 1x reference.
    */
    constructor: function(config) {
      var me,
        _this = this;
      Deft.defer(function(dfd) {
        config.callback = Deft.ajax.fxCallback(dfd, config.callback, config.scope);
        return _this.promise = function() {
          var token;
          token = dfd.promise;
          delete _this.promise;
          return token;
        };
      });
      me = this.callOverridden([config]) || this;
      me.promise = this.promise;
      return me;
    }
  });

}).call(this);
