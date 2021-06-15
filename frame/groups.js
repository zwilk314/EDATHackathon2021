//Javascript support for groups.html

function createNewGroup(){
	var name = document.getElementById("newGroupName").value
	var desc = document.getElementById("newGroupDesc").value
	addNewGroup(sessionStorage.getItem("username"), name, desc)
	document.getElementById("modal").style.display = "none"
}

function newGroupDialog(){
	document.getElementById("modal").innerHTML = '\
		<span\
			class="close"\
			onclick="document.getElementById(\'modal\').style.display = \'none\'">\
			&times;\
		</span>\
		<input\
			id="newGroupName"\
			type="text"\
			name="newGroupName"\
			placeholder="New Group Name">\
		<input\
			id="newGroupDesc"\
			type="text"\
			name="newGroupDesc"\
			placeholder="Short Description of Group">\
		<input\
			id="submitNewGroup"\
			type="submit"\
			value="Create New Group"\
			onclick="createNewGroup()">\
	'
	document.getElementById("modal").style.display = "block"
}

function setVars(){
	var query = location.search.substring(1);
	var keyValues = query.split("&")
	for(i=0; i<keyValues.length; i++){
		temp = keyValues[i].split("=")
		localStorage.setItem(temp[0], temp[1])
	}
}