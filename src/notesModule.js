const notesModule = (function () {
	let notesList = [];
	let projectList = ["Home"];

	if (localStorage.getItem("projectList")) {
		projectList = JSON.parse(localStorage.getItem("projectList"));
	}

	if (localStorage.getItem("notesList")) {
		notesList = JSON.parse(localStorage.getItem("notesList"));
	}

	const createNotes = function (
		title,
		description,
		dueDate,
		priority,
		isDone,
		category
	) {
		const noteObj = {
			title,
			description,
			dueDate,
			priority,
			isDone,
			category,
		};
		return noteObj;
	};

	function getNotesList() {
		return [...notesList];
	}

	function setNotes(...args) {
		const note = createNotes(...args);
		notesList.unshift(note);
		localStorage.setItem("notesList", JSON.stringify(notesList));
	}

	function removeNote(index) {
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
