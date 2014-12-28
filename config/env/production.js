'use strict';

module.exports = {
	db: 'mongodb://st:st@ds027761.mongolab.com:27761/srumtools' || process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/scrumtoolsio',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
				'public/lib/Bootflat/bootflat/css/bootflat.min.css',
				//'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
			],
			js: [
				'public/lib/angular/angular.min.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js'
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '391928577635539',
		clientSecret: process.env.FACEBOOK_SECRET || '05abbf5aff101a683d08fd600ad4e2f9',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'i1QEhtDE8QLyxaHXkw5gw3wA7',
		clientSecret: process.env.TWITTER_SECRET || '2BZXZAlC9YqrTxJCSpX5nI2Bw2S3ZVf1MvybIaXjo3q0JMwN3Q',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '206773603697-d90dkt7832b5guc9d5u38oq6nuartlh1.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || '_SBk6hsn-ttdSwUv6isWKNSu',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || '954e52c0a6de38d93c1f',
		clientSecret: process.env.GITHUB_SECRET || '0740a2224161a4c2dcf9339611b2bee9a6c58b86',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'scrumtools@outlook.com',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'hotmail',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'scrumtools@outlook.com',
				pass: process.env.MAILER_PASSWORD || 'SScrrumtoools123'
			}
		}
	}
};
