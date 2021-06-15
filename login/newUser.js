//Javascript support for login.html

// function createNewUser(){
// 	var name = document.getElementById("newUserName").value
// 	var desc = document.getElementById("newUserPassword").value
// 	file = fopen(getScriptPath(), 3)
// 	fwrite(file, "hello world") // The account storage database
//     
// }

function createNewUser(){
    window.open("https://www.createUserPage.html")
	var name = document.getElementById("username").value
    var pwd = document.getElementById("password").value
    addNewUser(name, pwd)
    
}

 