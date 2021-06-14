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
				}
			).catch(function(error){
				alert(error)
			})
		}
	}
}

//Attempts to login with the provided username and password
//If successful, the groups list (comma-separated string) will be added to sessionStorage for later use in the application
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
			alert("Successful login " + result[0].get("username"))
			//window.open("???")
			//TODO: navigate to home page
			//sessionStorage.setItem("username", result.get("username"))
			//sessionStorage.setItem("Groups", result.get("Groups"))
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
					alert(result)
					var query = new Parse.Query(Parse.Object.extend("customUser"))
					query.equalTo("username", username)
					query.find().then(result => {
						var oldList = result.get("Groups")
						var id = result.get("objectId")
						nImport = Parse.Object.extend("customUser")
						newEntry = new nImport()
						newEntry.get(id).then((result) => {
							result.set("Groups", oldList + "," + groupName)
							result.save()
							alert("Group successfully created")
						})
					})
				}
			)
		}
	}
}

//Finds the meetings for a given group name and adds them to session storage
function queryGroup(groupName){
	Parse.initialize(applicationID, javascriptKey)
	Parse.serverURL = serverID
	var query = new Parse.Query(Parse.Object.extend("GroupInfo"))
	query.equalTo("Name", groupName)
	query.find().then(result => {
		if(result.length == 0){
			alert("Invalid group name")
			return
		}
		else{
			sessionStorage.setItem("Meetings", result.get("Meetings"))
			//NOTE this may need editing to avoid race conditions and scenarios with multiple groups
		}
	})
}

//Finds all meetings (used for autofill purposes, potentially for universal calendar)
function queryAllGroups(){
	Parse.initialize(applicationID, javascriptKey)
	Parse.serverURL = serverID
	var query = new Parse.Query(Parse.Object.extend("GroupInfo"))
	query.find().then(results => {
		autofillLibrary = []
		for(i=0; i<results.length; i++){
			result = results[i]
			autofillLibrary.push(result.get("Name"))
			//sessionStorage.setItem(result.get("Name"), result.get("Meetings"))
		}
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
	query.find().then(result => {
		if(result.length == 0){
			alert("Invalid group name")
			return
		}
		else{
			var oldList = result.get("Meetings")
			var id = result.get("objectId")
			var nImport = Parse.Object.extend("customUser")
			var newEntry = new nImport()
			newEntry.get(id).then((result) => {
				result.set("Meetings", oldList + "," + meetingInfoString)
				result.save()
				alert("Meeting successfully created")
			})
		}
	})
}