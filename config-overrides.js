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
// if (typeof process !== 'undefined') {
//     suppressEPIPE(process.stdout);
// }

var eoepipe = function eoepipeit(S/*:events$EventEmitter*/, bail/*:?()=>any*/) {
	if(!S || !S.on) return;
	if(!bail && typeof process !== 'undefined') bail = process.exit;
	var eoe = function eoeit(err/*:ErrnoError*/) {
		if(err.code === 'EPIPE' || err.errno === /*EPIPE*/32) { if(bail) bail(0); else return; }
		var cnt = S.listenerCount ? S.listenerCount('error') : S.listeners('error').length;
		if(cnt == 1) {
			S.removeListener('error', eoe);
			S.emit('error', err);
			S.on('error', eoe);
		}
	};
	S.on('error', eoe);
};

//if(typeof module !== 'undefined') module.exports = eoepipe;
// if(typeof process !== 'undefined') eoepipe(process.stdout);

function epipeBomb(stream, callback) {
    if (stream == null) stream = process.stdout
    if (callback == null) callback = process.exit

    function epipeFilter(err) {
      if (err.code === 'EPIPE') return callback()

      // If there's more than one error handler (ie, us),
      // then the error won't be bubbled up anyway
      if (stream.listeners('error').length <= 1) {
        stream.removeAllListeners()     // Pretend we were never here
        stream.emit('error', err)       // Then emit as if we were never here
        stream.on('error', epipeFilter) // Then reattach, ready for the next error!
      }
    }

    stream.on('error', epipeFilter)
}
epipeBomb(process.stdout, process.exit);

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