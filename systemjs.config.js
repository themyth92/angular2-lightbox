(function wrapper() {
  'use strict';
  SystemJS.config({
    transpiler: 'typescript',
    typescriptOptions: {
      emitDecoratorMetadata: true,
      experimentalDecorators: true
    },
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },

    // map tells the System loader where to look for things
    map: {
      main: 'demo',

      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      'angular2-lightbox': 'npm:angular2-lightbox',
      rxjs: 'npm:rxjs'
    },

    packages: {
      main: {
        main: './main',
        defaultExtension: 'ts'
      },
      rxjs: {
        defaultExtension: 'js'
      },
      'angular2-lightbox': {
        main: './index.js',
        defaultExtension: 'js'
      }
    }
  });
})();
