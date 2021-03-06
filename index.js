var _ = require( 'lodash' );
var GitHub = require( 'github' );

module.exports = {
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var owner   = step.input( 'owner' ).first();
        var repo    = step.input( 'repo' ).first();
        var title   = step.input( 'title' ).first();
        var body    = step.input( 'body' ).first();

        var client  = new GitHub( { version: '3.0.0' } );

        var credentials = dexter.provider( 'github' ).credentials();

        client.authenticate( {
            type:    'oauth',
            token:   credentials.access_token
        } );

        client.issues.create( {
            user:     owner,
            repo:     repo,
            title:    title,
            body:     body
        }, function( err, res ) {
            if ( err ) return this.fail( err );

            var result = { 'url': res.html_url, number: res.number }
            return this.complete( result );
        }.bind( this ) );

    }
};
