//Javascript support for groups.html

// window.onclick = function(){
// 	modal = document.getElementById("newGroupModal")
// 	if(modal.style.display != "none"){
// 		modal.style.display = "none"
// 	}
// }

function createNewGroup(){
	var name = document.getElementById("newGroupName").value
	var desc = document.getElementById("newGroupDesc").value
	file = fopen(getScriptPath(), 3)
	fwrite(file, "hello world")
}