var gulp = require('gulp');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var gulpif = require('gulp-if');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var templatecache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var addstream = require('add-stream');
var addsrc = require('gulp-add-src');
var minifyHtml = require('gulp-minify-html');
var changed = require('gulp-changed');
var del = require('del');
var fileExists = require('file-exists');

//function renderTemplates(){
//	return gulp.src(['ui/app/component/**/*.html',
//	                 'ui/app/widget/**/*.html'])
//      .pipe(templatecache())
//	  .pipe(addstream('app.min.js'))
//	  .pipe(concat('app.min.js'))
//	  .pipe(gulp.dest('public/js'));
//}

gulp.task('scripts', function(){
	console.log('scripts');
//	del(['public/js/app.min.js']).then(function(){
//		return gulp.src(['ui/app/*.js',
//		                 'ui/app/component/**/*.js', 
//		                 'ui/app/service/**/*.js',
//		                 'ui/app/widget/**/*.js'])
//			.pipe(concat('app.js'))
//			.pipe(rename({suffix: '.min'}))
////	        .pipe(uglify())
//			.pipe(gulp.dest('public/js'));
//	});
//	del(['public/js/vendor.min.js']).then(function(){
//		return gulp.src(['ui/vendor/**/*.min.js'])
//			.pipe(concat('vendor.js'))
//			.pipe(rename({suffix: '.min'}))
////	        .pipe(uglify())
//			.pipe(gulp.dest('public/js'));
//	});
	
	del(['public/js/vendor.min.js']).then(function(){
		return gulp.src('ui/*.html')
		.pipe(useref())
	//    .pipe(gulpif('*.js', uglify()))
	    .pipe(gulpif('*.css', uglifycss()))
		.pipe(gulp.dest('public'))
	//	.pipe(renderTemplates());
	});
});

gulp.task('useref', function(){
	console.log('useref');
	return gulp.src('ui/*.html')
		.pipe(useref())
//	    .pipe(gulpif('*.js', uglify()))
	    .pipe(gulpif('*.css', uglifycss()))
		.pipe(gulp.dest('public'))
//		.pipe(renderTemplates());
});

gulp.task('componentTemplate', function() {
	console.log('componentTemplate');
	  return gulp.src('ui/app/component/**/*.html')
	    .pipe(minifyHtml({empty: true}))
	    .pipe(templatecache(
    		'componentTemplate.js', {
	        module: 'cca',
	        standAlone: false,
	        root: 'app/component'
	      }
	    ))
	    .pipe(gulp.dest('public/js/temp'));
});

gulp.task('widgetTemplate', function() {
	console.log('widgetTemplate');
	  return gulp.src('ui/app/widget/**/*.html')
	    .pipe(minifyHtml({empty: true}))
	    .pipe(templatecache(
    		'widgetTemplates.js', {
	        module: 'cca',
	        standAlone: false,
	        root: 'app/widget'
	      }
	    ))
	    .pipe(gulp.dest('public/js/temp'));
});

gulp.task('templateChange', ['componentTemplate', 'widgetTemplate'], function(){
	console.log('templateChange');
//	return gulp.src(['public/js/app.min.js', 'public/js/temp/componentTemplate.js', 'public/js/temp/widgetTemplates.js'])
//    .pipe(concat('app.min.js'))
////    .pipe(uglify())
//    .pipe(changed('public/js/'))
//    .pipe(gulp.dest('public/js/'))
////	.pipe(del(['public/js/temp/componentTemplate.js', 'public/js/temp/widgetTemplates.js']));
	
	var concatFiles =  gulp.src(['public/js/app.min.js', 
	                             'public/js/temp/componentTemplate.js', 
	                             'public/js/temp/widgetTemplates.js'])
		.pipe(concat('app.min.js'))
		.pipe(gulp.dest('public/js/'))
		fileExists('public/js/temp/componentTemplate.js', function(cErr, cExists){
			console.log('in file exists cExists : ', cExists);
			if(cExists){
				fileExists('public/js/temp/widgetTemplates.js', function(wErr, wExists){
					console.log('in file exists wExists : ', wExists);
					if(wExists){
						del(['public/js/temp']).then(function(){
							console.log('in del');
							return concatFiles;
						});
					}
				});
			}
		});
});

/*gulp.task('templatecache', ['componentTemplate', 'widgetTemplate'], function() {
	  return gulp.src(['public/js/componentTemplate.js', 'public/js/widgetTemplates.js'])
	    .pipe(concat('template.js'))
	    .pipe(gulp.dest('public/js'));
});*/

gulp.task('minifyjs', ['useref', 'templateChange']);//, function(){
//	console.log('minifyjs');
////	  return gulp.src(['public/js/app.min.js', 'public/js/temp/componentTemplate.js', 'public/js/temp/widgetTemplates.js'])
////	    .pipe(concat('app.min.js'))
//////	    .pipe(uglify())
//////	    .pipe(changed('public/js/'))
//////	  	.pipe(del(['public/js/componentTemplate.js', 'public/js/widgetTemplates.js']))
////	  	.pipe(gulp.dest('public/js/'))
//////	  	.pipe(gulpif('./public/js/temp/componentTemplate.js', del(['public/js/temp/componentTemplate.js'])))
//	  	
////	  	fileExists('public/js/temp/componentTemplate.js', function(){
//	  		
//	  		var concatFiles =  gulp.src(['public/js/app.min.js', 'public/js/temp/componentTemplate.js', 'public/js/temp/widgetTemplates.js'])
//	  			.pipe(concat('app.min.js'))
//	  			.pipe(gulp.dest('public/js/'))
//	  			fileExists('public/js/temp/componentTemplate.js', function(){
//	  				console.log('in file exists');
//	  				del(['public/js/temp']).then(function(){
//	  					console.log('in del');
//	  					return concatFiles;
//	  				});
//	  			});
////	  		del(['public/js/temp/componentTemplate.js', 'public/js/temp/widgetTemplates.js']);
//	  		
////	  	});
//});

/*gulp.task('delTempTemplates', function(){
	console.log('delTempTemplates');
	return del('public/js/temp/**', {force:true});
});*/

//gulp.task('partialCSS', function(){
//	return gulp.src(['ui/app/component/**/*.css',
//	                 'ui/app/widget/**/*.css'])
//	       .pipe(concat('partial.css'))
////	       .pipe(rename({suffix: '.min'}))
////	        .pipe(uglifycss())
//	       .pipe(gulp.dest('public/assets/css'));
//});
//
//gulp.task('css', ['useref', 'partialCSS'], function(){
//	return gulp.src(['public/assets/css/app.css', 'public/assets/css/partial.css'])
//		.pipe(concat('app.css'))
//		.pipe(rename({suffix: '.min'}))
////        .pipe(uglifycss())
//		.pipe(gulp.dest('public/assets/css'));
//});

gulp.task('images', function(){
	return gulp.src('ui/app/assets/images/**/*')
		.pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
	    .pipe(gulp.dest('public/assets/images'));
});

gulp.task('clearImage', function(){
	 return cache.clearAll();
});

gulp.task('imageChange', ['clearImage', 'images']);

gulp.task('scriptChange', ['scripts','templateChange']);

gulp.task('watch', function(){
	gulp.watch(['ui/app/*.js',
                'ui/app/component/**/*.js', 
                'ui/app/service/**/*.js',
                'ui/app/widget/**/*.js'], ['scriptChange']);
	gulp.watch(['ui/app/component/**/*.html', 'ui/app/widget/**/*.html'], ['templateChange']);
	gulp.watch('ui/app/assets/images/**/*', ['imageChange']);
});

gulp.task('default', ['minifyjs', 'images', 'watch']);