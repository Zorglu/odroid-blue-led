module.exports = function(grunt) {
	
	grunt.initConfig({
		jshint: {
			dist: ['lib/*.js']
		},
		watch: {
			js: {
				files: ['lib/*.js'],
				tasks: ['jshint'],
				options: {
					spawn: false,
				}
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.registerTask('default', ['jshint','watch']);
};