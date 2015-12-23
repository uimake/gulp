/**
 * Created by admin on 15/11/16.
 */
var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    browserSync = require('browser-sync'),
    $ = gulpLoadPlugins(),
    reload = browserSync.reload;

var paths = {
    src: {
        scripts: 'src/scripts/*.js',
        scss: 'src/sass/*.scss',
        images: 'src/images/*',
        html: 'src/*.html'
    },
    dist: {
        js: 'dist/js',
        css: 'dist/css',
        images: 'dist/images',
        html: 'dist'
    }
};
gulp.task('styles', function () {
    return gulp.src(paths.src.scss)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision:10
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer({browsers: ['last 2 version']}))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(paths.dist.css));
});

gulp.task('lint', function() {
    return gulp.src(paths.src.scripts)
        .pipe(reload({stream: true, once: true}))
        .pipe($.jshint())
        .pipe($.jshint.reporter('default'));
});

gulp.task('html',['styles'], function() {
    var opts = {
        conditionals: true,
        spare:true
    };
    return gulp.src(paths.src.html)
        .pipe($.minifyHtml(opts))
        .pipe(gulp.dest(paths.dist.html));
});

gulp.task('images', function () {
    return gulp.src(paths.src.images)
        .pipe($.plumber())
        .pipe($.imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{cleanupIDs: false}]
        }))
        .pipe(gulp.dest(paths.dist.images));
});

gulp.task('js', function () {
    return gulp.src(paths.src.scripts)
        .pipe($.concat('all.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(paths.dist.js));
});

gulp.task('css', function () {
    return gulp.src('dist/css/*')   //字母顺序
        .pipe($.concat('all.min.css'))
        .pipe($.minifyCss({compatibility: '*'}))
        .pipe(gulp.dest(paths.dist.css));
});

gulp.task('serve', function() {
    browserSync({
        notify: false,
        port: 9000,
        server: {
            baseDir: ['dist']
        }
    });
});

gulp.task('watch', function () {
    gulp.watch(paths.src.scss, ['styles']);
    gulp.watch(paths.src.scripts, ['lint']);
    gulp.watch(paths.src.images, ['images']);
});

gulp.watch([
    'dist/*.html',
    'dist/**/*'
]).on('change', reload);

gulp.task('build',['html','image','js','css'], function () {
    return gulp.src('dist/**/*').pipe($.size({title:'build',gzip:true}));
});

gulp.task('default', function () {
    return gulp.src('dist/css/main.css')
        .pipe($.uncss({
            html: ['index.html', 'dist/*.html']
        }))
        .pipe(gulp.dest('./out'));
});