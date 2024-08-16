import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { src, dest, watch, series } from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import plumber from 'gulp-plumber';
import replace from 'gulp-replace';
import { deleteSync } from 'del';
import terser from 'gulp-terser';
import sharp from 'sharp';


const sass = gulpSass(dartSass);

export function js(done) {
    src('src/js/**/*.js', { sourcemaps: true })
        .pipe(plumber({
            errorHandler: function(err) {
                console.error(err.message);
                this.emit('end');
            }
        }))
        .pipe(replace('src/img/gallery/', 'assets/images/gallery/'))
        .pipe(terser())
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
        .pipe(sass({
            outputStyle: 'compressed',
        }))
        .pipe(dest('dist/css/', { sourcemaps: '.' }));

    done();
}

export async function crop(done) {
    const inputFolder = 'src/img/gallery/full'
    const outputFolder = 'src/img/gallery/thumb';
    const width = 250;
    const height = 180;
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true })
    }
    const images = fs.readdirSync(inputFolder).filter(file => {
        return /\.(jpg)$/i.test(path.extname(file));
    });
    try {
        images.forEach(file => {
            const inputFile = path.join(inputFolder, file)
            const outputFile = path.join(outputFolder, file)
            sharp(inputFile)
                .resize(width, height, {
                    position: 'centre'
                })
                .toFile(outputFile)
        });

        done()
    } catch (error) {
        console.log(error)
    }
}

export async function images( done ) {
    const srcDir = './src/img';
    const buildDir = './dist/assets/images';
    const images =  await glob('./src/img/**/*{jpg,png}')

    images.forEach(file => {
        const relativePath = path.relative(srcDir, path.dirname(file));
        const outputSubDir = path.join(buildDir, relativePath);
        processImages(file, outputSubDir);
        processVideo();
    });
    done();
}

function processImages(file, outputSubDir) {
    if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true })
    }
    const baseName = path.basename(file, path.extname(file))
    const extName = path.extname(file)
    const outputFile = path.join(outputSubDir, `${baseName}${extName}`)
    const outputFileWebp = path.join(outputSubDir, `${baseName}.webp`)
    const outputFileAvif = path.join(outputSubDir, `${baseName}.avif`)


    const options = { quality: 80 }
    sharp(file).jpeg(options).toFile(outputFile)
    sharp(file).webp(options).toFile(outputFileWebp)
    sharp(file).avif().toFile(outputFileAvif)
}

export function html(done) {
    src('index.html')
        .pipe(replace('./src/img/', 'assets/images/'))
        .pipe(replace('/video/', 'assets/video/'))
        .pipe(dest('dist/'));

    done();
}

export function processVideo() {
    src('video/**/*.{mp4, webm, ogv, ogg}', { encoding: false })
        .pipe(dest('dist/assets/video'));
}

export function dev() {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', js);
    watch('src/img/**/*.{png,jpg}', images);
}


export function clean(done) {
    deleteSync(['dist']);
    done();
}

export default series(crop, js, css, images, dev);

export const build = series(clean, js, css, html, images);