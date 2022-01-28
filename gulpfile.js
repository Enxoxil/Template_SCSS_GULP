let proj_folders = "dist";
let src_folders = "#src";

let path = {
    build: {
        html: proj_folders + "/",
        css: proj_folders + "/css/",
        js: proj_folders + "/js/",
        img: proj_folders + "/img/",
        fonts: proj_folders + "/fonts/",
    },
    src: {
        html: src_folders + "/*.html",
        css: src_folders + "/scss/style.scss",
        js: src_folders + "/js/script.js",
        img: src_folders + "/img/**/*.{img,png,svg,gif,ico,webp}",
        fonts: src_folders + "/fonts/*.ttf",
    },
    watch: {
        html: src_folders + "/**/*.html",
        css: src_folders + "/scss/**/*.scss",
        js: src_folders + "/js/**/*.js",
        img: src_folders + "/img/**/*.{img,png,svg,gif,ico,webp}",
    },
    clean: "/" + proj_folders + "/",
};
let { src, dest } = require("gulp"),
    gulp = require("gulp"),
    browsersync = require("browser-sync").create(),
    fileinclude = require("gulp-file-include");

function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: "/" + proj_folders + "/"
        },
        port: 3000,
        notify: false
    });
}
function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}

let build = gulp.series(html);
let watch = gulp.parallel(build, browserSync);

exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
