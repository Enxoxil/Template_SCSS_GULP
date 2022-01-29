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

let { src, dest } = require("gulp"),
    gulp = require("gulp"),
    browsersync = require("browser-sync").create(),
    fileinclude = require("gulp-file-include"),
    del = require("del");

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
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}



function watchFiles(){
    gulp.watch([path.watch.html],html); // Ловим изменения файлов на лету
}

function clean(){
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(css, html)); // вначале удаляем папку dist потом пихаем туда собраный проект 
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;