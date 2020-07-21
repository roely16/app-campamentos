module.exports = {
	"transpileDependencies": [
		"vuetify"
	],
	publicPath: process.env.NODE_ENV === 'production' ? '/apps/campamentos/app-campamentos/' : '/',
	pwa: {
		workboxOptions: {
			skipWaiting: true
		}
	}
}