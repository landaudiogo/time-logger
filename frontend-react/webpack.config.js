const path = require('path');

module.exports = {
    resolve: {
        extensions: [".ts", ".tsx"],
        alias: {
            "@": path.resolve(__dirname, 'src')
        },
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|mp3)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
        ],
    },
};
