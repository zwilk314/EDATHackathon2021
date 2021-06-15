//To use these functions, include the following in your html file header:
//	<script type='text/javascript' src='https://npmcdn.com/parse@2.1.0/dist/parse.min.js'></script>
// <script src='database.js'></script>

//NOTE: session storage may run into race conditions; if so, we need to discuss workarounds

var applicationID = "Bm7ROpC6yNg64Kc2n9CovsUEHfhr0UW9tAw2RCJw"
var javascriptKey = "JIMPkxp1LnuZytN4t9DtZkQ4TFmlshEO2eiMHY85"
var serverID = "https://parseapi.back4app.com"

//Takes username and password and adds new user account to the database with that information
// function addNewUser(username, password){
// 	Parse.initialize(applicationID, javascriptKey)
// 	Parse.serverURL = serverID
// 	var user = new Parse.User()
// 	user.set("username", username)
// 	user.set("password", password)
// 	user.set("Groups" , "")
// 	user.signUp().then(function(user){
// 		alert("New user " + username + " successfully added.")
// 	})
// }

var user
var groups

function addNewUser(username, password){
	Parse.initialize(applicationID, javascriptKey)
	Parse.serverURL = serverID
	var entry = [
		username,
		password,
		""
	]
	var titles = [
		"username",
		"password",
		"Groups"
	]
	var nImport = Parse.Object.extend("customUser")
	var newEntry = new nImport()
	for(i=0; i<titles.length; i++){
		newEntry.set(titles[i], entry[i])
		if(i == (titles.length - 1)){
			newEntry.save().then(
				function(result){
					alert("Added " + result.get("username") + " successfully.")
					window.open("../login/login.html", "_self")
				}
			).catch(function(error){
				alert(error)
			})
		}
	}
}

//Attempts to login with the provided username and password
//If successful, the groups list (comma-separated string) will be added to localStorage for later use in the application
function loginUser(username, password){
	Parse.initialize(applicationID, javascriptKey)
	Parse.serverURL = serverID
	var query = new Parse.Query(Parse.Object.extend("customUser"))
	query.equalTo("username", username)
	query.equalTo("password", password)
	query.find().then(function(result){
		if(result.length == 0){
			alert("Invalid username or password")
			return
		}
		else{
			// alert("Successful login " + result[0].get("username"))
			user = result[0].get("username")
			groups = result[0].get("Groups")
			window.open("../frame/groups.html?username=" + user +"&groups=" + groups, "_self")
		}
	})
}

//Adds group with provided username and group description to the database, and also updates the username's groups (since the user must be part of a group they created)
//NOTE: may need to implement a uniqueness check, with time permitting
function addNewGroup(username, groupName, groupDescription){
	Parse.initialize(applicationID, javascriptKey)
	Parse.serverURL = serverID
	var entry = [
		groupName,
		groupDescription,
		""
	]
	var titles = [
		"Name",
		"Description",
		"Meetings"
	]
	var nImport = Parse.Object.extend("GroupInfo")
	var newEntry = new nImport()
	for(i=0; i<titles.length; i++){
		newEntry.set(titles[i], entry[i])
		if(i == (titles.length - 1)){
			newEntry.save().then(
				function(result){
					var query = new Parse.Query(Parse.Object.extend("customUser"))
					query.equalTo("username", username) //TODO: username in session storage!!!
					query.find().then(function(result2){
						var oldList = result2[0].get("Groups")
						var id = result2[0].id
						nImport2 = Parse.Object.extend("customUser")
						newEntry2 = new nImport2()
						newEntry2.set("objectId", id)
						if(oldList == ""){
							newEntry2.set("Groups", groupName)
						}
						else{
							newEntry2.set("Groups", oldList + "," + groupName)
						}
						newEntry2.save().then(function(result3){
							alert("Group successfully created")
						})
					})
				}
			)
		}
	}
}

function joinGroup(username, groupName){
	Parse.initialize(applicationID, javascriptKey)
	Parse.serverURL = serverID
	var query = new Parse.Query(Parse.Object.extend("customUser"))
	query.equalTo("username", username)
	query.find().then(function(result){
		var oldList = result[0].get("Groups")
		var id = result[0].id
		nImport2 = Parse.Object.extend("customUser")
		newEntry2 = new nImport2()
		newEntry2.set("objectId", id)
		if(oldList == ""){
			var newList = groupName
		}
		else{
			var newList = oldList + "," + groupName
		}
		newEntry2.set("Groups", newList)
		newEntry2.save().then(function(result3){
			alert("Successfully Joined Group")
			localStorage.setItem("groups", newList)
		})
	})
}

//Finds the meetings for a given group name and adds them to session storage
function queryGroup(groupName){
	Parse.initialize(applicationID, javascriptKey)
	Parse.serverURL = serverID
	var query = new Parse.Query(Parse.Object.extend("GroupInfo"))
	query.equalTo("Name", groupName)
	query.find().then(function(result){
		if(result.length == 0){
			alert("Invalid group name")
			return
		}
		else{
			if(localStorage.getItem("groups").includes(result[0].get("Name"))){
				document.getElementById("modal").innerHTML = '\
					<span\
						class="close"\
						onclick="document.getElementById(\'modal\').style.display = \'none\'">\
						&times;\
					</span>\
					<h1>' + result[0].get("Name") + '\
					</h1>\
					<br>\
					<p>' + result[0].get("Description") + '\
					<br>\
					<table class="table loadTable">\
						<thead><tr><th onclick="sortTable(0)">Event</th><th onclick="sortTable(1)">Description</th><th>Date</th><th>Time</th><th>Location</th></tr></thead>\
						<tbody id="dataTable">\
						</tbody>\
					</table>\
					<p id="recommendation"></p>\
				'
				eventsList = result[0].get("Meetings").split(",")
				for(i=0; i<eventsList.length; i++){
					temp = eventsList[i].split(" | ")
					$('#dataTable').append(
						'<tr><td>'
						+ temp[0]
						+ '</td><td>'
						+ temp[1]
						+ '</td><td>'
						+ temp[2]
						+ '</td><td>'
						+ temp[3]
						+ '</td><td>'
						+ temp[4]
						+ '</td></tr>'
			
					)
				}
				recommend()
				document.getElementById("modal").style.display = "block"
			}
			else{
				document.getElementById("modal").innerHTML = '\
					<span\
						class="close"\
						onclick="document.getElementById(\'modal\').style.display = \'none\'">\
						&times;\
					</span>\
					<h1>' + result[0].get("Name") + '\
					</h1>\
					<br>\
					<p>' + result[0].get("Description") + '\
					<br>\
					<table class="table loadTable">\
						<thead><tr><th onclick="sortTable(0)">Event</th><th onclick="sortTable(1)">Description</th><th>Date</th><th>Time</th><th>Location</th></tr></thead>\
						<tbody id="dataTable">\
						</tbody>\
					</table>\
					<input type="submit" value="Join Group" onclick="joinGroup(localStorage.getItem(\'username\'),\'' + result[0].get("Name") + '\')">\
					<br>\
					<p id="recommendation"></p>\
				'
				eventsList = result[0].get("Meetings").split(",")
				for(i=0; i<eventsList.length; i++){
					temp = eventsList[i].split(" | ")
					$('#dataTable').append(
						'<tr><td>'
						+ temp[0]
						+ '</td><td>'
						+ temp[1]
						+ '</td><td>'
						+ temp[2]
						+ '</td><td>'
						+ temp[3]
						+ '</td><td>'
						+ temp[4]
						+ '</td></tr>'
			
					)
				}
				recommend()
				document.getElementById("modal").style.display = "block"
			}
		}
	})
}

//Finds recommended popular group
function recommend(){
	Parse.initialize(applicationID, javascriptKey)
	Parse.serverURL = serverID
	var query = new Parse.Query(Parse.Object.extend("customUser"))
	query.find().then(function(results){
		var library = {}
		var namesList = []
		for(i=0; i<results.length; i++){
			result = results[i].get("Groups").split(",")
			for(k=0; k<result.length; k++){
				if(typeof library[result[k]] == "undefined" && result[k] != ""){
					library[result[k]] = 1
					namesList.push(result[k])
				}
				else if(result[k] != ""){
					library[result[k]] += 1
				}
			}
		}
		maximum = ""
		maxValue = 0
		for(j=0; j<namesList.length; j++){
			if(library[namesList[j]] > maxValue){
				maximum = namesList[j]
				maxValue = library[namesList[j]]
			}
		}
		document.getElementById("recommendation").innerHTML = "You might also be interested in joining " + maximum + " - check it out!"
	})
}

//NOTE: do we need an algorithm that queries all groups from a username, or do we repeat the query individually?

//Adds a new meeting to the provided group name
//NOTE: may need functionality like shown at https://www.w3schools.com/jsref/jsref_getmonth.asp to deal with meeting info string data
function addNewMeeting(groupName, meetingInfoString){
	Parse.initialize(applicationID, javascriptKey)
	Parse.serverURL = serverID
	var query = new Parse.Query(Parse.Object.extend("GroupInfo"))
	query.equalTo("Name", groupName)
	query.find().then(function(result){
		if(result.length == 0){
			alert("Invalid group name")
			return
		}
		else{
			var oldList = result[0].get("Meetings")
			var id = result[0].id
			var nImport = Parse.Object.extend("GroupInfo")
			var newEntry = new nImport()
			newEntry.set("objectId", id)
			if(oldList == ""){
				newEntry.set("Meetings", meetingInfoString)
			}
			else{
				newEntry.set("Meetings", oldList + "," + meetingInfoString)
			}
			newEntry.save().then(function(result2){
				alert("Meeting successfully created")
			})
		}
	})
}

//Carson method for populating calendar
function popCal(){
	Parse.initialize(applicationID, javascriptKey)
	Parse.serverURL = serverID
	var query = new Parse.Query(Parse.Object.extend("GroupInfo"))
	var events = new Object();
	query.find().then(function(results){
		for(i=0; i<results.length; i++){
			result = results[i]
			events[i] = result.get("Meetings");
			//console.log(events[i]);
			console.log(typeof events[i])
			var info = events[i].split("|");
			console.log(info);
				$('#data').append(
					'<tr><td>'
					+ info[0]
					+ '</td><td>'
					+ info[1]
					+ '</td><td>'
					+ info[2]
					+ '</td><td>'
					+ info[3]
					+ '</td><td> test </td><td>'
					+ info[4]
					+ '</td></tr>'
			
				)
			

		}
	})
}