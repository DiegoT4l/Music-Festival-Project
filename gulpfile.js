import { src, dest, watch, series } from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import plumber from 'gulp-plumber';
import ghPages from 'gulp-gh-pages';

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

export function dev() {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', js);
}

export function deploy() {
    return src('./dist/**/*')
        .pipe(ghPages());
}

export default series(js, css, dev);
