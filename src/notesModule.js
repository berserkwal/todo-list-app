const notesModule = (function () {
	let notesList = [];
	let projectList = [null, "Dash", "Cash", "Crash"];

	// if (localStorage.getItem("projectList")) {
	// 	const projectList = localStorage.getItem("projectList");
	// } else projectList = [];

	// if (localStorage.getItem("notes")) {
	// 	notesList = localStorage.getItem("projectList");
	// } else notesList = [];

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
	}

	function removeNote(index) {
		notesList.splice(index, 1);
	}

	function editSingleNoteProperty(index, property, value) {
		notesList[index][property] = value;
	}

	setNotes(
		"passss",
		"asdasdaqdadasdadzxcaxcsdasdasqdasdsaqdadasdasdasdadasdadasdasdasdasdasdadadadasdadaadsasdasasdaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
		"2021-09-14",
		3,
		false,
		null
	);
	setNotes(
		"basssss",
		"asdasdaqdadasdadzxcaxcsdasdasqdasdsaqdadasdasdasdadasdadasdasdasdasdasdadadadasdadaadsasdasasdaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
		"2021-09-14",
		2,
		true,
		"Dash"
	);
	setNotes(
		"dashhhh",
		"asdasdaqdadasdadzxcaxcsdasdasqdasdsaqdadasdasdasdadasdadasdasdasdasdasdadadadasdadaadsasdasasdaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
		"2021-07-08",
		1,
		true,
		null
	);

	function getProjectList() {
		return [...projectList];
	}
	function setProject(proj) {
		projectList.push(proj);
	}
	function removeProject(index) {
		projectList.splice(index, 1);
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
