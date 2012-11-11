(function(){
    console.log("IndexedDB Experiment-- Start");

    if (! window.indexedDB) {
	console.log("indexedDB is not known without a browser prefix");
	window.indexedDB = window.webkitIndexedDB || window.mozIndexedDB;
	if (window.indexedDB) {
	    console.log("indexedDB is now known");
	} else {
	    console.log("unable to use indexedDB");
	}
    };

    console.log("Creating a namespace");
    var experiment = {};

    experiment.indexeddb = {};
    experiment.indexeddb.open = function(callback){
	console.log("Opening Database 'experiment'");
	var request = indexedDB.open("experiment");
	
	request.onsuccess = function(event){
	    console.log("Database 'experiment' opened succesfully");
	    var version = "1.0";
	    var db = request.result;
	    if (version != db.version) {
		console.log("Version discrepency: create a new object store");
		var versionChangeRequest = db.setVersion(version);
		
		versionChangeRequest.onfailure = function(){
		    console.log("unable to create a new object store");
		};
		versionChangeRequest.onsuccess = function(){
 		    console.log("creating store 'messages'");
		    var store = db.createObjectStore("messages");
 		    console.log("object store 'messages' created");
		};
	    }
	    experiment.indexeddb.db = db;
	    callback.call(db);
	};

	request.onfailure = function(){
	    console.log("Failed to open database 'experiment'");
	}
    };

    experiment.indexeddb.open(function(){
	console.log("open callback called");
	var transaction = this.transaction(["messages", "readwrite"]);
	var store = transaction.objectStore("messages");
	
	var request = store.put({ 
	    "text" : "accessed page", 
	    "timestamp" : (new Date()).getTime()
	});
	request.onsuccess = function(){
	    console.log("successfully stored object");
	}
	request.onfailure = function(){
	    console.log("unable to store object");
	}
    });

    

    console.log("IndexedDB Experiment -- End");
})();
