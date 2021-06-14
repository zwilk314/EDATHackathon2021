//Javascript support for login.html

function createNewUser(){
	var name = document.getElementById("newUserName").value
	var desc = document.getElementById("newUserPassword").value
	file = fopen(getScriptPath(), 3)
	fwrite(file, "hello world") // The account storage database
    
}