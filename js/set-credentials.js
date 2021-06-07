/**
 * Credentials
 *
 * @package ShareThisReactionButtons
 */

/* exported Credentials */
var Credentials = ( function( $, wp ) {
	'use strict';

	return {
		/**
		 * Holds data.
		 */
		data: {},

		/**
		 * Boot plugin.
		 *
		 * @param data
		 */
		boot: function( data ) {
			this.data = data;

			$( document ).ready( function() {
				this.init();
			}.bind( this ) );
		},

		/**
		 * Initialize plugin.
		 */
		init: function() {
			this.$connection = $( '.sharethis-connection-wrap' );
			this.$createConfig = '';
			this.listen();
			this.loadPreview( 'initial' );
		},

		/**
		 * Listener.
		 */
		listen: function() {
			var self = this;

			// Create new account.
			this.$connection.on( 'click', '.create-account', function() {
				var email = $( '#st-email' ).val(),
					pw = $( '#st-password' ).val();

				$( '.st-loading-gif' ).fadeIn();

				// Set default WP config.
				wp.ajax.post( 'set_reaction_default_settings', {
					nonce: self.data.nonce
				} ).always( function( link ) {
					self.registerAccount( email, pw );
				}.bind( self ) );
			} );

			// Login to account.
			this.$connection.on( 'click', '.login-account', function( e ) {
				e.preventDefault();

				var email = $( '#st-login-email' ).val(),
					pw = $( '#st-login-password' ).val();

				// Set default WP config.
				wp.ajax.post( 'set_reaction_default_settings', {
					nonce: self.data.nonce
				} ).always( function( link ) {
					self.loginAccount( email, pw );
				}.bind( self ) );
			} );

			this.$connection.on( 'click', '#connect-property', function( e ) {
				e.preventDefault();

				$( '.st-loading-gif' ).fadeIn();

				var secret = $( '#sharethis-properties option:selected' ).val(),
					property = $( '#sharethis-properties option:selected' ).attr( 'data-prop' ),
					token = $( '#st-user-cred' ).val(),
					config = $( '#sharethis-properties option:selected' ).attr( 'data-config' ).replace( /'/g, '"' ),
					button = $( '#sharethis-properties option:selected' ).attr( 'data-first' ).replace( '-share-buttons', '' ),
					theData = JSON.stringify( { is_wordpress: true } );

				wp.ajax.post( 'set_reaction_button_config', {
					button: button,
					config: config,
					type: 'login',
					nonce: self.data.nonce
				} ).always( function() {
					$.ajax( {
						url: 'https://platform-api.sharethis.com/v1.0/property/?id=' + property + '&secret=' + secret,
						method: 'PUT',
						async: false,
						contentType: 'application/json; charset=utf-8',
						data: theData,
						success: function() {
							self.setCredentials( secret, property, token, 'login' );
						}
					} );
				} );
			} );

			// Create property based on site url.
			this.$connection.on( 'click', '#create-new-property', function( e ) {
				e.preventDefault();

				$( '.st-loading-gif' ).fadeIn();

				var secret = $( '#sharethis-properties option:selected' ).val(),
					property = $( '#sharethis-properties option:selected' ).attr( 'data-prop' ),
					token = $( '#st-user-cred' ).val(),
					config = $( '#sharethis-properties option:selected' ).attr( 'data-config' ).replace( /'/g, '"' ),
					button = $( '#sharethis-properties option:selected' ).attr( 'data-first' ).replace( '-share-buttons', '' ),
					theData = JSON.stringify( { is_wordpress: true } );

				wp.ajax.post( 'set_reaction_button_config', {
					button: button,
					config: config,
					type: 'login',
					nonce: self.data.nonce
				} ).always( function( results ) {
					$.ajax( {
						url: 'https://platform-api.sharethis.com/v1.0/property/?id=' + property + '&secret=' + secret,
						method: 'PUT',
						async: false,
						contentType: 'application/json; charset=utf-8',
						data: theData,
						success: function() {
							self.$createConfig = JSON.parse( config );
							self.$createButton = button;
							self.createProperty( token, self.data.url, 'create' );
						}
					} );
				} );
			} );

			$( 'body' ).on( 'click', '.item label', function() {
				var checked = $( this ).siblings( 'input' ).is( ':checked' );

				$( '.sharethis-inline-reaction-buttons' ).removeClass( 'st-has-labels' );

				if ( ! checked ) {
					$( this ).closest( '.st-radio-config' ).find( '.item' ).each( function() {
						$( this ).find( 'input' ).prop( 'checked', false );
					} );

					$( this ).siblings( 'input' ).prop( 'checked', true );
				}

				self.loadPreview( '' );
			} );

			// Button alignment.
			this.$connection.on( 'click', '.button-alignment .alignment-button', function() {
				$( '.button-alignment .alignment-button[data-selected="true"]' )
					.attr( 'data-selected', 'false' );
				$( this ).attr( 'data-selected', 'true' );

				self.loadPreview( '' );
			} );

			// Select or deselect a network.
			this.$connection.on( 'click', '.reaction-buttons .reaction-button', function() {
				var selection = $( this ).attr( 'data-selected' ),
					reaction = $( this ).attr( 'data-reaction' );

				if ( 'true' === selection ) {
					$( this ).attr( 'data-selected', 'false' );
					$( '.sharethis-selected-reactions > div > div[data-reaction="' + reaction + '"]' ).remove();
				} else {
					$( this ).attr( 'data-selected', 'true' );
					$( '.sharethis-selected-reactions > div' ).append( '<div class="st-btn" data-reaction="' + reaction + '" style="display: inline-block;"></div>' );
				}

				self.loadPreview( '' );
			} );

			// Add class to preview when scrolled to.
			$( window ).on( 'scroll', function() {
				if ( undefined === $( '.selected-button' ).offset() ) {
					return;
				}

				var stickyTop = $( '.selected-button' ).offset().top;

				if ( $( window ).scrollTop() >= stickyTop ) {
					$( '.sharethis-selected-reactions' ).addClass( 'sharethis-prev-stick' );
				} else {
					$( '.sharethis-selected-reactions' ).removeClass( 'sharethis-prev-stick' );
				}
			} );

			// If register button is clicked. submit button configurations.
			this.$connection.on( 'click', '#sharethis-step-one-wrap .st-rc-link', function() {
				$( '.st-loading-gif' ).fadeIn();
				self.loadPreview( 'submit' );
			} );

			// When reacting with preview.
			this.$connection.on( 'click', '.st-btn', function() {
				var timer = '';

				clearTimeout( timer );

				timer = setTimeout( function() {
					self.loadPreview( '' );
				}.bind( this ), 1000 );
			} );

			// Lanuage change.
			this.$connection.on( 'change', '#st-language', function() {
				self.loadPreview();
			} );
		},

		/**
		 * Send hash data to credential setting.
		 *
		 * @param secret
		 * @param propertyid
		 * @param token
		 * @param type
		 */

		setCredentials: function( secret, propertyid, token, type ) {
			var propSecret = propertyid + '-' + secret;

			// If hash exists send it to credential setting.
			wp.ajax.post( 'set_reaction_credentials', {
				data: propSecret,
				token: token,
				nonce: this.data.nonce
			} ).always( function( link ) {
				if ( 'login' !== type ) {
					this.setButtonConfig( secret, propertyid, token, type );
				} else {
					window.location = '?page=sharethis-reaction-buttons';
				}
			}.bind( this ) );
		},

		/**
		 * Login to your account.
		 *
		 * @param email
		 * @param pw
		 */
		loginAccount: function( email, pw ) {
			var self = this,
				theData = JSON.stringify( {
					email: email,
					password: pw
				} );

			$.ajax( {
				url: 'https://sso.sharethis.com/login',
				method: 'POST',
				async: false,
				contentType: 'application/json; charset=utf-8',
				data: theData,
				success: function( results ) {
					$( '#st-user-cred' ).val( results.token );

					// Get full info.
					self.getProperty( results.token );
				},
				error: function( xhr, status, error ) {
					var message = xhr.responseJSON.message;

					$( '.st-loading-gif' ).hide();
					$( 'div.error-message' ).html( '' );
					$( '.login-account.st-rc-link' ).after(
						'<div class="error-message" style="text-align: center; margin: 1rem 0;">' +
						message +
						'</div>'
					);
				}
			} );
		},

		/**
		 * Register new account.
		 *
		 * @param email
		 * @param pw
		 */
		registerAccount: function( email, pw ) {
			var result = null,
				self = this,
				url = this.data.url,
				button = this.data.firstButton,
				theData = JSON.stringify( {
					email: email,
					password: pw,
					custom: {
						onboarding_product: 'inline-reaction-buttons',
						onboarding_domain: url,
						is_wordpress: true
					}
				} );

			$.ajax( {
				url: 'https://sso.sharethis.com/register',
				method: 'POST',
				async: false,
				contentType: 'application/json; charset=utf-8',
				data: theData,
				success: function( results ) {
					result = results;

					// Create property.
					self.createProperty( result, url, '' );
				},
				error: function( xhr, status, error ) {
					var message = xhr.responseJSON.message;

					$( '.st-loading-gif' ).hide();
					$( 'div.error-message' ).html( '' );
					$( '.sharethis-account-creation small' ).after(
						'<div class="error-message" style="text-align: center; margin: 1rem 0;">' +
						message +
						'</div>'
					);
				}
			} );
		},

		/**
		 * Create property for new account.
		 *
		 * @param accountInfo
		 * @param url
		 */
		createProperty: function( accountInfo, url, type ) {
			var result = null,
				self = this,
				token = accountInfo.token,
				button = this.data.firstButton,
				theData;

			if ( 'string' === typeof accountInfo ) {
				token = accountInfo;
			}

			theData = JSON.stringify( {
				token: token,
				product: 'inline-reaction-buttons',
				domain: url,
				is_wordpress: true
			} );

			$.ajax( {
				url: 'https://platform-api.sharethis.com/v1.0/property',
				method: 'POST',
				async: false,
				contentType: 'application/json; charset=utf-8',
				data: theData,
				success: function( results ) {
					result = results;

					self.setCredentials( result.secret, result._id, token, type );
				}
			} );
		},

		/**
		 * Load preview buttons.
		 *
		 * @param type
		 */
		loadPreview: function( type ) {
			var bAlignment = $( '.button-alignment .alignment-button[data-selected="true"]' ).attr( 'data-alignment' ),
				language = $( '#st-language option:selected' ).val(),
				self = this,
				reactions = [],
				config;

			if ( 'initial' === type ) {
				$( '.reaction-buttons .reaction-button[data-selected="true"]' ).each( function( index ) {
					reactions[ index ] = $( this ).attr( 'data-reaction' );
				} );
			} else {
				$( '.sharethis-selected-reactions > div .st-btn' ).each( function( index ) {
					reactions[ index ] = $( this ).attr( 'data-reaction' );
				} );
			}

			config = {
				alignment: bAlignment,
				reactions: reactions,
				language: language,
				enabled: true,
				fade_in: false
			};

			if ( 'submit' === type ) {
				wp.ajax.post( 'set_reaction_button_config', {
					button: 'inline-reaction',
					config: config,
					nonce: this.data.nonce
				} ).always( function( results ) {
					window.location.href = '?page=sharethis-general&s=2';
				} );
			} else {
				$( '.st-inline-reaction-buttons' ).html( '' );

				window.__sharethis__.href = 'https://www.sharethis.com/';
				__sharethis__.storage.set( 'st_reaction_' + __sharethis__.href, null );
				window.__sharethis__.load( 'inline-reaction-buttons', config );
				$( '.sharethis-inline-reaction-buttons' ).removeClass( 'st-reacted' );

				$( '.sharethis-selected-reactions > div' ).sortable( {
					stop: function( event, ui ) {
						self.loadPreview( '' );
					}
				} );
			}
		},

		/**
		 * Get user information and property
		 *
		 * @param token
		 */
		getProperty: function( token ) {
			$.ajax( {
				url: 'https://platform-api.sharethis.com/v1.0/me?token=' + token,
				method: 'GET',
				async: false,
				contentType: 'application/json; charset=utf-8',
				success: function( result ) {
					$( '#sharethis-login-wrap' ).hide();
					$( '#sharethis-property-select-wrap' ).show();
					$( '#sharethis-properties' ).html( '' );

					$.each( result.properties, function( index, value ) {
						var config = { 'inline-reaction': value[ 'inline-reaction-buttons' ] },
							firstProduct = value[ 'onboarding_product' ],
							reaction = value[ 'inline-reaction-buttons' ];

						if ( 'sop' === firstProduct ) {
							firstProduct = 'inline-reaction';
						}

						if ( undefined === reaction ) {
							firstProduct = 'inline-reaction';
							config = {
								'inline-reaction': {
									alignment: 'center',
									enabled: true,
									reactions: [ 'slight_smile', 'heart_eyes', 'laughing', 'astonished', 'sob', 'rage' ]
								}
							};
						}

						$( '#sharethis-properties' ).append( '<option data-first="' + firstProduct + '" data-config="' + JSON.stringify( config ).replace( /"/g, "'" ) + '" data-prop="' + value._id + '" value="' + value.secret + '">' + value.domain + '</option>' );
					} );
				}
			} );
		},

		/**
		 * Set button configurations
		 */
		setButtonConfig: function( secret, propertyid, token, type ) {
			var button = this.data.firstButton,
				config = this.data.buttonConfig;

			if ( 'create' === type ) {
				config = this.$createConfig;
				button = 'inline-reaction';
			}

			// Send new button status value.
			$.ajax( {
				url: 'https://platform-api.sharethis.com/v1.0/property/product',
				method: 'POST',
				async: false,
				contentType: 'application/json; charset=utf-8',
				data: JSON.stringify( {
					'secret': secret,
					'id': propertyid,
					'product': 'inline-reaction-buttons',
					'config': config[ button ]
				} )
			} ).always( function( results ) {
				window.location = '?page=sharethis-reaction-buttons';
			} );
		}
	};
} )( window.jQuery, window.wp );
