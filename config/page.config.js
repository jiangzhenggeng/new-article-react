var path = require('path')

function getTplPath(module) {
	return path.resolve(__dirname, `../src/pages/${module}/block_tpl/index.ejs.js`)
}

module.exports = [
	{
		name: 'article',
		main: './src/pages/article/main.js',
		options: {
			filename: path.resolve(__dirname, '../dist/index.html'),
			template: getTplPath('article'),
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: false
			},
			chunksSortMode: function (a, b) {
				if (a.names == 'manifest') {
					return -1
				}
				if (b.names == 'manifest') {
					return 1
				}
				if (a.names == 'vendor') {
					if (b.names != 'manifest') {
						return -1
					} else {
						return 1
					}
				}
				if (b.names == 'vendor') {
					if (a.names != 'manifest') {
						return 1
					} else {
						return -1
					}
				}
				return a.names[0] > b.names[0] ? 1 : -1;
			}
		},
		//不允许集体打包方案
		notpackage: true,
		externals: {
			'jquery': '$'
		},
		subModel: {
			'UEditor': './static/UEditor/index.js'
		}
	},
	{
		name: 'editor',
		main: './src/pages/editor/main.js',
		options: {
			filename: path.resolve(__dirname, '../dist/index.html'),
			template: getTplPath('editor'),
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: false
			},
			chunksSortMode: function (a, b) {
				if (a.names == 'manifest') {
					return -1
				}
				if (b.names == 'manifest') {
					return 1
				}
				if (a.names == 'vendor') {
					if (b.names != 'manifest') {
						return -1
					} else {
						return 1
					}
				}
				if (b.names == 'vendor') {
					if (a.names != 'manifest') {
						return 1
					} else {
						return -1
					}
				}
				return a.names[0] > b.names[0] ? 1 : -1;
			}
		},
		//不允许集体打包方案
		notpackage: true,
		externals: {
			'jquery': '$'
		},
		subModel: {
			'UEditor': './static/UEditor/index.js'
		}
	}
]













