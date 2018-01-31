var execSync = require("child_process").execSync;
var gulp     = require("gulp");
var eslint   = require("gulp-eslint");
var gutil    = require("gulp-util");
var path     = require("path");
var webpack  = require("webpack");

var build = function (minify, callback) {
    webpack({
        entry: "./src/asteroid-oauth.js",
        module: {
            loaders: [{
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel"
            }]
        },
        output: {
            libraryTarget: "umd",
            library: "AsteroidOauthMixin",
            path: path.join(__dirname, "/dist"),
            filename: (minify ? "asteroid-oauth-mixin.min.js" : "asteroid-oauth-mixin.js")
        },
        plugins: minify ? [
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })
        ] : null
    }, function (err, stats) {
        if (err) {
            throw new gutil.PluginError("webpack", err);
        }
        gutil.log("[webpack]", stats.toString({colors: true}));
        callback();
    });
};

gulp.task("build", function (callback) {
    build(false, function () {
        build(true, callback);
    });
});

gulp.task("test", function () {
    execSync("npm test", {
        stdio: [null, process.stdout]
    });
});

gulp.task("lint", function () {
    return gulp.src(["src/**/*.js"])
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task("default", ["test", "lint"], function () {
    return gulp.watch(["src/**/*.js", "test/unit/**/*.js"], ["test", "lint"]);
});
