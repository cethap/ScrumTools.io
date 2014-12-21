'use strict';

module.exports = {
	db: 'mongodb://​scrumtools:​scrumtools@kahana.mongohq.com:10003/meanio',
	app: {
		title: 'ScrumTools.io - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '391928577635539',
		clientSecret: process.env.FACEBOOK_SECRET || '05abbf5aff101a683d08fd600ad4e2f9',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '206773603697-m1qp8fa0hlh4ifa3thmaamblkko2tq0q.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || 'MKFygFR9_fdQv0xSAYaUST7F',
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
