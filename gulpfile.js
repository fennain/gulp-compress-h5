const gulp = require('gulp');
const del = require('del');
const cleancss = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin'); // 替换为 gulp-htmlmin
const autoprefixer = require('gulp-autoprefixer');
const useref = require('gulp-useref');
const gulpif = require('gulp-if');
const lazypipe = require('lazypipe');
// const uglify = require('gulp-uglify');
const terser = require('gulp-terser');
const rev = require('gulp-rev');
const filter = require('gulp-filter');
const revreplace = require('gulp-rev-replace');

const outDir = "dist"

const indexHtmlFilter = filter(['**/*', '!**/index.html'], { restore: true });

const csstasks = lazypipe()
  .pipe(autoprefixer, {
    browsers: ['last 2 versions'],
    cascade: false
  })
  .pipe(cleancss);

// 图片处理任务
function doimages() {
  return gulp.src('src/assets/imgs/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest(`${outDir}/assets/imgs`));
}

// HTML, CSS, JS 处理任务
function douseref() {
  return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(gulpif('*.html', htmlmin({ collapseWhitespace: true }))) // 使用 gulp-htmlmin
    .pipe(gulpif('*.css', csstasks()))
    .pipe(gulpif('*.js', terser({
      mangle: {
        toplevel: true
      },
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      },
      format: {
        comments: false
      }
    })))
    .pipe(indexHtmlFilter)
    .pipe(rev())
    .pipe(indexHtmlFilter.restore)
    .pipe(revreplace())
    .pipe(gulp.dest(`${outDir}`));
}

// 删除任务
function delcss() {
  return del(`${outDir}/assets/css`);
}
function deljs() {
  return del(`${outDir}/assets/js`);
}
function delimages() {
  return del(`${outDir}/assets/imgs`);
}
function delhtml() {
  return del(`${outDir}/*.html`);
}
const delall = gulp.parallel(delcss, deljs, delimages, delhtml);

// 组合任务
const doall = gulp.series(delall, gulp.parallel(douseref, doimages));

// 定义公开任务
gulp.task('doimages', doimages);
gulp.task('douseref', douseref);
gulp.task('delcss', delcss);
gulp.task('deljs', deljs);
gulp.task('delimages', delimages);
gulp.task('delhtml', delhtml);
gulp.task('delall', delall);
gulp.task('doall', doall);

// 默认任务
gulp.task('default', doall);
