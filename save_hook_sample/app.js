(function() {

  // Hook reference: http://developer.zendesk.com/documentation/apps/reference/hooks.html

  return {

    defaultState: 'showCase',

    requests: {
      heartQuote: {
        url: 'http://iheartquotes.com/api/v1/random',
        data: {
          format: 'json'
        }
      }
    },

    events: {

      'app.activated': 'init',
      'ticket.save':   'hookHandler',

      // Switch to different hook handlers
      'click .simplePass':  'useSimplePass',  // pass
      'click .simpleFail':  'useSimpleFail',  // fail
      'click .stringFail':  'useStringFail',  // fail with an error message
      'click .delayedPass': 'useDelayedPass', // pass 3s after clicking submit
      'click .delayedFail': 'useDelayedFail', // fail 3s after clicking submit
      'click .ajaxPass':    'useAjaxPass',    // pass after getting a quote through ajax
      'click .ajaxFail':    'useAjaxFail'     // fail after getting a quote through ajax

    },

    init: function() {
      this.currentHandler = this.useSimplePass;
    },

    hookHandler: function() {
      return this.currentHandler();
    },

    // Switches

    useSimplePass: function() {
      this.currentHandler = this.simplePass;
      console.log('Using simple pass');
    },

    useSimpleFail: function() {
      this.currentHandler = this.simpleFail;
      console.log('Using simple fail');
    },

    useStringFail: function() {
      this.currentHandler = this.stringFail;
      console.log('Using string fail');
    },

    useDelayedPass: function() {
      this.currentHandler = this.delayedPass;
      console.log('Using delayed pass');
    },

    useDelayedFail: function() {
      this.currentHandler = this.delayedFail;
      console.log('Using delayed fail');
    },

    useAjaxPass: function() {
      this.currentHandler = this.ajaxPass;
      console.log('Using ajax pass');
    },

    useAjaxFail: function() {
      this.currentHandler = this.ajaxFail;
      console.log('Using ajax fail');
    },

    // Handles

    simplePass: function() {
      return true;
    },

    simpleFail: function() {
      return false;
    },

    stringFail: function() {
      return this.I18n.t('fail_string');
    },

    delayedPass: function() {
      return this.promise(function(done, fail) {
        setTimeout(function() {
          done();
        }, 3000);
      });
    },

    delayedFail: function() {
      return this.promise(function(done, fail) {
        setTimeout(function() {
          fail();
        }, 3000);
      });
    },

    ajaxPass: function() {
      return this.promise(function(done, fail) {
        this.ajax('heartQuote').then(
          function(data) {
            console.log(data.quote);
            done();
          },
          function() {
            console.log('ajax failed, but ticket.save shall pass');
            done();
          }
        );
      });
    },

    ajaxFail: function() {
      return this.promise(function(done, fail) {
        this.ajax('heartQuote').then(
          function(data) {
            console.log(data.quote);
            fail();
          },
          function() {
            console.log('ajax failed, ticket.save shall fail anyway');
            fail();
          }
        );
      });
    }

  };

}());
