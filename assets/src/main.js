import { v4 as uuidv4 } from 'uuid';

const version = 1
const hostCount = window.location.host.split(".").length
console.log('ver', version, hostCount)

window.PancakeAnalytics = (function() {
	// Specify the metadata of this Analytics library
	var metadata = {
    "version": "1.0",
		"tags": ["es2015"]
	}

	var wa = {}

  var init = function(tid) {
		wa.tracking_id = tid
    Behavior.visit()
	}

	/*
	 * Global declaration. These declarations will be used in this module scope
	 */

	/*
	 * Utility functions
	 */

	var Tools = {
		// Set cookie to client
    setCookie: function(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toUTCString();
      var value = cname + "=" + cvalue + ";" + expires + ";path=/";
      console.log('val', value)
      document.cookie = value
    },
		getCookie: function(name) {
			var cookie = document.cookie
			var cobj = {}

			var splitted = cookie.split(";")
			for (var i = 0; i < splitted.length; i++) {
				var keyVal = splitted[i].trim().split("=")
				cobj[keyVal[0]] = keyVal[1]
			}

			return cobj[name] || ""
		},
		request: function(method, url, data, cb) {
			var xhttp = new XMLHttpRequest()
			xhttp.open(method, url, true)
			xhttp.onreadystatechange = function() {
				if (this.readyState === 4) {
					if (this.status === 200) {
						var response = {
							response: this.response,
							responseText: this.responseText,
							responseUrl: this.responseUrl,
							responseType: this.responseType,
							status: this.status
						}
						if (typeof cb === "function") cb(response)
					} else {
						var detail = "status: " + this.status + "\n" +
							"statusText: " + this.statusText + "\n" +
							"response: " + this.response + "\n"
						
						throw("Can not make " + method + " request to " + url + "\n" + detail)
					}
				}
			}
			xhttp.send()
		},
		createRequestViaImg: function(query) {
      let host = NODE_ENV === "production" ? "https://statistics.freelp.xyz/" : "http://localhost:1998"
			var img = document.createElement('img')	
			img.width = "1"
			img.height = "1"
			img.src = `${host}/collect?` + (query || "")
			img.style.position = "absolute"
			return img
		}
	}

	/*
	 * Pancake Analytics will use a 1x1 transparent gif file with minimun 43 bytes that is compared with other extensions
	 * Use image/gif content-type will prevent cross domain request restrictions.
	 */
	var Behavior = {
		visit: function() {
      let _pa = Tools.getCookie("_pa")
      let _pid = Tools.getCookie("_pid")
      let _pat = Tools.getCookie("_pat")
      if (!_pa) Tools.setCookie("_pa", `CPA${version}.${new Date().getTime()}.${hostCount}.${uuidv4()}`, 365)
      if (!_pid) Tools.setCookie("_pid", `CPID${version}.${new Date().getTime()}.${hostCount}.${uuidv4()}`, 1)
      if (!_pat) Tools.setCookie("_pat", `CPAT${version}.${new Date().getTime()}.${hostCount}.${uuidv4()}`, 1 / 24 / 60)

			var query = "dl=" + encodeURIComponent(document.location.href) +
				"&sc=" + encodeURIComponent(document.location.protocol) +
				"&sr=" + encodeURIComponent(window.screen.width + "x" + window.screen.height) +
				"&vp=" + encodeURIComponent(document.documentElement.clientWidth + "x" + document.documentElement.clientHeight) +
				"&dt=" + encodeURIComponent(document.title) +
				"&tid=" + encodeURIComponent(wa.tracking_id) +
				"&dh=" + encodeURIComponent(window.location.hostname) +
				"&ts=" + Date.now() +
        "&_v=" + metadata.version +
        "&fr=" + document.referrer +
        "&_pa=" + Tools.getCookie("_pa") +
        "&_pid=" + Tools.getCookie("_pid") +
        "&_pat=" + Tools.getCookie("_pat")

			Tools.createRequestViaImg(query)
		}
	}

	var interative = {
		test: function() {
        console.log(wa.tracking_id)
        console.log(Tools.getCookie("_pid"))
        console.log(Tools.getCookie("_pa"))
        console.log(Tools.request("GET", "/error", null, function(result) {
				console.log(result)
			}))
		}
	}

	return {
		init: init,
		interative: interative,
		Behavior: Behavior
	}
})()