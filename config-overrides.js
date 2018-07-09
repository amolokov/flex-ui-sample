const STATICS_PATH = "assets/";
const STATICS_SEARCH = "static/";

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
    if (typeof(configObj) === "object" && !!configObj) {
        Object.keys(configObj).forEach(key => {
            const val = configObj[key];
            if (typeof(val) === "string") {
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