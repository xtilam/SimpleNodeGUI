const path = require("path");
const { existsSync, rmSync } = require("fs");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const IS_DEV = process.argv.findIndex((v) => v === 'development') !== -1
const BUILD_DIR = path.resolve(__dirname, "dist")

if (existsSync(BUILD_DIR) && !IS_DEV) rmSync(BUILD_DIR, { recursive: true })

const defaultConfig = commonConfig()

const buildExport = [mainJS()]

module.exports = buildExport;


function mainJS() {
    return {
        ...defaultConfig,
        entry: "./src/main.ts",
        externals: {
            ...IS_DEV && {
                '@nodegui/nodegui': 'require("@nodegui/nodegui")'
            },
            ...defaultConfig.externals,
        },
        target: 'node',
        resolve: {
            extensions: [".ts", ".mjs", ".js", ".tsx", ".scss", ".css", ".json"],
            conditionNames: ['require'],
        },
        module: {
            rules: [...defaultConfig.module.rules,
            {
                test: /\.(ts)x?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc: false,
                        configFile: false,
                        presets: ['@babel/preset-env', '@babel/preset-typescript', 'solid'],
                    }
                }
            }
            ]
        }
    };
}

function commonConfig(_isDev = IS_DEV) {
    const coreModule = require("module").builtinModules.reduce((acc, cur) => (acc[cur] = `require("${cur}")`, acc), {})

    const config = {
        mode: _isDev ? "development" : "production",
        target: "node",
        output: {
            path: BUILD_DIR,
            filename: '[name].js',
        },
        // devtool: isDev ? 'inline-sources-map' : false, 
        module: {
            rules: [
                {
                    test: /\.(png|jpe?g|gif|svg|bmp|otf)$/i,
                    use: [
                        {
                            loader: "file-loader",
                            options: { publicPath: "dist" }
                        }
                    ]
                },
                {
                    test: /\.(js|ts|tsx)?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            configFile: false,
                            presets: ['@babel/preset-env', '@babel/preset-typescript'],
                        }
                    }
                },
                {
                    test: /\.node/i,
                    use: [
                        {
                            loader: "native-addon-loader",
                            options: { name: "[name].[ext]" }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                url: false, // necessary if you use url('/path/to/some/asset.png|jpg|gif')
                            }
                        }
                    ]
                },
            ]
        },
        externals: coreModule,
        plugins: [
            new MiniCssExtractPlugin({ filename: 'styles.css' })
        ],
    };

    if (_isDev) {
        config.mode = "development";
        config.devtool = "source-map";
        config.watch = true;
    }

    return config;
}