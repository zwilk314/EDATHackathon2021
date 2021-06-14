//Javascript support for groups.html

// window.onclick = function(){
// 	modal = document.getElementById("newGroupModal")
// 	if(modal.style.display != "none"){
// 		modal.style.display = "none"
// 	}
// }

//TODO: autocomplete (https://www.w3schools.com/howto/howto_js_autocomplete.asp)

function createNewGroup(){
	var name = document.getElementById("newGroupName").value
	var desc = document.getElementById("newGroupDesc").value
	addNewGroup(sessionStorage.getItem("username"), name, desc)
	document.getElementById("newGroupModal").style.display = "none"
}

function exploreGroup(name){
	//Query the database for the information about the group, display in modal
}