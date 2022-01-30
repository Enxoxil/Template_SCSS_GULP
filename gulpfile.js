let p_Fold = "dist";
let s_Fold = "#src";

let path = {
    build: {
        // Пути к папкам для продакшена
        html: p_Fold + "/",
        css: p_Fold + "/css/",
        js: p_Fold + "/js/",
        img: p_Fold + "/img/",
        fonts: p_Fold + "/fonts/",
    },
    src: {
        //Пути к папкам с исходниками
        html: [s_Fold + "/*.html", "!" + s_Fold + "/_*.html"], // Ловим все файлы с .html и исключаем все файли с _.html
        css: s_Fold + "/scss/style.scss",
        js: s_Fold + "/js/script.js",
        img: s_Fold + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: s_Fold + "/fonts/*.ttf",
    },
    watch: {
        //Следим за исходниками
        html: s_Fold + "/**/*.html",
        css: s_Fold + "/scss/**/*.scss",
        js: s_Fold + "/js/**/*.js",
        img: s_Fold + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    },
    clean: "./" + p_Fold + "/", // Удаление папки проекта при запуске галпа
};

let { src, dest } = require("gulp"), // инициализация переменных
    gulp = require("gulp"),
    browsersync = require("browser-sync").create(),
    fileinclude = require("gulp-file-include"),
    del = require("del"),
    autoprefixer = require('gulp-autoprefixer'),
    group_media = require("gulp-group-css-media-queries"),
    clean_css = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify-es').default,
    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    webphtml = require('gulp-webp-html'),
    webpcss = require('gulp-webpcss');


const scss = require('gulp-sass')(require('sass'));

function browserSync() { // функция запуска сервера
    browsersync.init({
        server: {
            baseDir: "./" + p_Fold + "/",
        },
        port: 3000,
        notify: false,
    });
}



function html (){ // функция 
    return src(path.src.html)
    .pipe(fileinclude())
    .pipe(webphtml())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function css(){
    return src(path.src.css)
    .pipe(
        scss({
            outputStyle: "expanded"
        })
    )
    .pipe(
        group_media()
    )
    .pipe(
        autoprefixer({
            overrideBrowserslist: ["last 5 versions"], // Автопрефиксер для всех браузеров последние 5 версий
            cascade: true // стиль написания
        })
    )
    .pipe(webpcss({
        webpClass: '.webp',
        noWebpClass: '.no-webp'
    }))
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(
        rename({
            extname: ".min.css"
        })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

function js (){ // функция 
    return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(
        uglify()
    )
    .pipe(
        rename({
            extname: ".min.js"
        })
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}

function images (){ // функция 
    return src(path.src.img)
    .pipe(
        webp({
            quality: 70
        })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
        imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true,
            optimizationLevel: 3
        })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}

function watchFiles(){
    gulp.watch([path.watch.html],html); // Ловим изменения в html и запускаем ф-ю html
    gulp.watch([path.watch.js],js); 
    gulp.watch([path.watch.css],css); // ловим изменения в css и запускаем ф-ю css
    gulp.watch([path.watch.img],images);
}

function clean(){
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(css, html, js, images)); // вначале удаляем папку dist потом пихаем туда собраный проект 
let watch = gulp.parallel(build, watchFiles, browserSync);


exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;