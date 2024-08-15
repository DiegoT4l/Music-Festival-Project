import { src, dest, watch, series } from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import plumber from 'gulp-plumber';
import replace from 'gulp-replace';
import { deleteSync } from 'del';


const sass = gulpSass(dartSass);

export function js(done) {
    src('src/js/**/*.js', { sourcemaps: true })
        .pipe(plumber({
            errorHandler: function(err) {
                console.error(err.message);
                this.emit('end');
            }
        }))
        .pipe(dest('dist/js/', { sourcemaps: '.' }));

    done();
}

export function css(done) {
    src('src/scss/**/*.scss', { sourcemaps: true })
        .pipe(plumber({
            errorHandler: function(err) {
                console.error(err.message);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(dest('dist/css/', { sourcemaps: '.' }));

    done();
}

export function html(done) {
    src('index.html')
        .pipe(replace('./src/img/', 'assets/images/'))
        .pipe(replace('/video/', 'assets/video/'))
        .pipe(dest('dist/'));
    src('src/**/*.html')
        .pipe(replace('src/img/', 'assets/images/'))
        .pipe(replace('/video/', 'assets/video/'))
        .pipe(dest('dist/html/'));

    done();
}

export function assets(done) {
    src('src/img/**/*.{png,jpg,jpeg,gif,svg}', { encoding: false })
        .pipe(dest('dist/assets/images'));
    src('video/**/*.{mp4, webm, ogv, ogg}', { encoding: false })
        .pipe(dest('dist/assets/video'));

    done();
}

export function dev() {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', js);
}


export function clean(done) {
    deleteSync(['dist']);
    done();
}

export default series(js, css, dev);

export const build = series(clean, js, css, html, assets);