var applicationID = "Bm7ROpC6yNg64Kc2n9CovsUEHfhr0UW9tAw2RCJw"
var javascriptKey = "JIMPkxp1LnuZytN4t9DtZkQ4TFmlshEO2eiMHY85"
var serverID = "https://parseapi.back4app.com"

function addNewUser(username, password){
	var entry = [
		username,
		password
	]
	var titles = [
		"username",
		"password"
	]
	Parse.initialize(applicationID, javascriptKey)
	Parse.serverURL = serverID
	var nImport = Parse.Object.extend("User")
	var newEntry = new nImport()
	for(i=0; i<titles.length; i++){
		newEntry.set(titles[i], entry[i])
		if(i == (titles.length - 1)){
			newEntry.save().then(
				(result) => {
					alert("New user " + username + " successfully added.")
				}
			)
		}
	}
}

function loginUser(username, password){
	Parse.initialize(applicationID, javascriptKey)
	Parse.serverURL = serverID
	var authorization = new Parse.Query(Parse.Object.extend("User"))
	query.equalTo("username", username)
	query.equalTo("password", password)
	query.find().then(results => {
		if(results.length == 0){
			alert("Invalid username or password")
			return
		}
		else{
			alert("Successful login")
			//TODO: navigate to home page
			//TODO: access user database entry to get group information
		}
	})
}