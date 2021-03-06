/**
 * Cache service
 * Singleton that keeps track of in memory data
 */
export default class Cache {
    cache = {};
    cacheObj = null;

    /**
     *	Get an instance of the cache service
     */
    static get instance() {
		if (this.cacheObj === null || this.cacheObj === undefined) {
		    this.cacheObj = new Cache();
		    this.cacheObj.cache = {};
		}

		// Check the cache for old data
		this.cacheObj.checkCacheAge();

		// Return the instance
		return this.cacheObj;
    }


    /**
     *	Check the age of all cache and remove if nessecary
     */
    checkCacheAge() {
		for (var key in this.cache) {
            if (this.cache[key].maxage > 0 && this.cache[key].maxage < new Date().getTime()) {
				delete this.cache[key];
	 	    }
		}
    }


    /**
     *	Get an object from the cache by name
     */
    get(key, def) {
    	def = def || null;

		// Get the value
		var value = def;
	 	if (key in this.cache)
		    value = this.cache[key].value;

		// Try parsin json data
		try {
	        return JSON.parse(value);
	    }
	    catch (e) {
	        return value;
	    }
    }


    /**
     *	Put new data in the cache
     *	Expiration time in minutes
     */
    put(key, time, value) {

    	// Make sure the value is a string
    	if (typeof value !== "string") {
    		value = JSON.stringify(value);
    	}

	 	this.cache[key] = {
		    value: value,
		    maxage: time === -1 ? -1 : new Date().getTime() + (time * 6e4)
		};
    }


    /**
     *	Get the value from cache or execute callback and put value in cache
     */
    remember(key, time, callback) {
		var value = this.get(key);

		// No value found, set value
		if (!value) {
		    value = callback();
		}

		// Refresh the time
		this.put(key, time, value);

		// Return the value
		return value;
    }


    /**
     *	Keep something in the cache forever
     */
    rememberForever(key, callback) {
		return this.remember(key, -1, callback);
    }

}
