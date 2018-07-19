'use strict';

/*
检查js语法: npm install grunt-contrib-jshint --save-dev
合并文件: npm install grunt-contrib-concat --save-dev
压缩文件: npm install grunt-contrib-uglify --save-dev
监控文件: npm install grunt-contrib-watch --save-dev
删除文件: npm install grunt-contrib-clean --save-dev
复制文件: npm install grunt-contril-copy --save-dev
图像压缩: npm insatll grunt-contril-imagemin --save-dev
压缩合并CSS ： npm install grunt-contril-cssmin --save-dev
*/
module.exports = function(grunt) {
  grunt.initConfig({

    sass: {
      build: {
        files: [{
          expand: true,
          cwd: 'scss/',
          src: ['**/*.scss'],
          dest: 'css',
          ext: '.css'
        }]
      }
    },

    watch: {
      sass: {
        files: ['scss/**/*.scss'],
        tasks: ['sass:build']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');

  // 默认被执行的任务列表。
  grunt.registerTask('default', ['sass', 'watch']);
};
