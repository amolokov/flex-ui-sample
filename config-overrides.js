const STATICS_PATH = "assets/";
const STATICS_SEARCH = "static/";

const suppressEPIPE = (stream) => {
    if (!stream) return;
    const onError = (err) => {
        if (err.code === "EPIPE" || err.errno === /*EPIPE*/32) {
            return process.exit(0);
        }

        const listenerCount = stream.listenerCount ? stream.listenerCount("error") : stream.listeners("error").length;
        if (listenerCount == 1) {
            stream.removeListener('error', onError);
            stream.emit('error', err);
            stream.on('error', onError);
        }
    };

    stream.on('error', onError);
};

// suppress EPIPE errors for CI integration, make process exit with code 0
if (typeof process !== 'undefined') {
    suppressEPIPE(process.stdout);
}

// Replace 'static/' folder references in default react scripts to use /assets folder.
const replaceIfStaticPath = (path) => {
    if (path.indexOf(STATICS_SEARCH) >= 0) {
        const lastPath = path.lastIndexOf("/");
        return STATICS_PATH + path.substr(lastPath + 1);
    }

    if (path === "service-worker.js") {
        return STATICS_PATH + path;
    }

    return path;
}

const processConfig = (configObj) => {
    if (typeof (configObj) === "object" && !!configObj) {
        Object.keys(configObj).forEach(key => {
            const val = configObj[key];
            if (typeof (val) === "string") {
                configObj[key] = replaceIfStaticPath(val);
            }
            else {
                processConfig(configObj[key]);
            }
        });
    }
}

module.exports = function override(config, env) {
    processConfig(config);
    return config;
}