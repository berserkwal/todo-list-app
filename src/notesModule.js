const notesModule = (function () {
	let notesList = [];
	let projectList = ["Home"];

	if (localStorage.getItem("projectList")) {
		projectList = JSON.parse(localStorage.getItem("projectList"));
	}

	if (localStorage.getItem("notesList")) {
		notesList = JSON.parse(localStorage.getItem("notesList"));
	}

	function createNotes(
		title,
		description,
		dueDate,
		priority,
		isDone,
		category
	) {
		console.log(notesList.length);
		const noteObj = {
			title,
			description,
			dueDate,
			priority,
			isDone,
			category,
			index: notesList.length,
		};
		return noteObj;
	}

	function getNotesList() {
		return [...notesList];
	}

	function setNotes(...args) {
		const note = createNotes(...args);
		notesList.push(note);
		localStorage.setItem("notesList", JSON.stringify(notesList));
	}

	function removeNote(index) {
		console.log(index);
		console.log(notesList.length);
		if (index < notesList.length - 1) {
			for (let i = index - 1; i >= 0; i--) {
				console.log("in here", i);
				notesList[i]["index"] = notesList[i]["index"] - 1;
			}
		}
		notesList.splice(index, 1);
		localStorage.setItem("notesList", JSON.stringify(notesList));
	}

	function editSingleNoteProperty(index, property, value) {
		notesList[index][property] = value;
		localStorage.setItem("notesList", JSON.stringify(notesList));
	}

	function getProjectList() {
		return [...projectList];
	}
	function setProject(proj) {
		projectList.push(proj);
		localStorage.setItem("projectList", JSON.stringify(projectList));
	}
	function removeProject(index) {
		projectList.splice(index, 1);
		localStorage.setItem("projectList", JSON.stringify(projectList));
	}

	return {
		getNotesList,
		setNotes,
		removeNote,
		getProjectList,
		setProject,
		removeProject,
		editSingleNoteProperty,
	};
})();

export { notesModule };
