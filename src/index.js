import logoSrc from "./logo.svg";
import flagSrc from "./flag.svg";
import editSrc from "./edit.svg";
import deleteSrc from "./delete.svg";
import cancelSrc from "./cancel.svg";
import addSrc from "./add.svg";
import homeSrc from "./home.svg";
import todaySrc from "./today.svg";
import projectSrc from "./project.svg";

import "./style.css";
import SVGInjector from "svg-injector";
import { notesModule } from "./notesModule";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";

(function () {
	function generateAddButton() {
		const addButton = document.createElement("div");

		addButton.textContent = "+";

		addButton.classList.add("add-button");
		addButton.addEventListener("click", addButtonEvent);
		return addButton;
	}

	function generateHeader() {
		const headerContainer = document.createElement("header");
		const headerHam = document.createElement("div");
		const headerLogoText = document.createElement("div");
		const headerLogo = document.createElement("div");
		const headerLogoImage = document.createElement("div");
		const bigHText = document.createElement("h2");
		const smallHText = document.createElement("p");
		const logo = new Image();

		headerHam.classList.add("ham");
		for (let i = 0; i < 3; i++) {
			const div = document.createElement("div");
			headerHam.append(div);
		}

		bigHText.classList.add("big-h-text");
		smallHText.classList.add("small-h-text");
		headerLogo.classList.add("header-logo");
		headerLogoImage.classList.add("header-img-container");
		headerLogoText.classList.add("header-text-container");
		logo.classList.add("svg-icon");

		logo.src = logoSrc;
		bigHText.textContent = "To-do";
		smallHText.textContent = "or not to do...";

		headerHam.addEventListener("click", hamEvent);

		headerLogoImage.append(logo);
		headerLogoText.append(bigHText, smallHText);
		headerLogo.append(headerLogoImage, headerLogoText);
		headerContainer.append(headerHam, headerLogo);
		return headerContainer;
	}

	function hamEvent(event) {
		if (event.target.classList.contains("click")) {
			event.target.classList.remove("click");
			document.querySelector("section").classList.remove("reveal");
		} else {
			event.target.classList.add("click");
			document.querySelector("section").classList.add("reveal");
		}
	}

	function generateContent() {
		const content = document.createElement("section");

		content.append(generateAddButton(), generateSidebar(), generateMain());
		return content;
	}

	function generateMain() {
		const main = document.createElement("main");
		const pageHead = document.createElement("h2");
		const listContainer = document.createElement("ul");

		pageHead.textContent = "Today";

		listContainer.classList.add("list-container");
		pageHead.classList.add("page-head");

		main.append(pageHead, listContainer);

		populateList(listContainer);

		return main;
	}

	function clearProjectList() {
		const list = document.querySelectorAll(".project-list li");
		list.forEach((item) => item.remove());
	}

	function renderProjectModal() {
		const modal = document.createElement("div");
		const modalOverlay = document.createElement("div");
		const modalBody = document.createElement("form");
		const nameInput = document.createElement("input");
		const saveButton = document.createElement("button");
		const cancelButton = document.createElement("div");

		nameInput.setAttribute("placeholder", "Project Name");
		nameInput.required = true;
		saveButton.textContent = "Save";
		cancelButton.textContent = "Cancel";

		modalOverlay.classList.add("modal-overlay");
		modal.classList.add("modal");
		modal.classList.add("add-project-modal");
		cancelButton.classList.add("button");
		saveButton.classList.add("button");
		saveButton.classList.add("save-button");
		cancelButton.classList.add("cancel-button");

		saveButton.addEventListener("click", (event) => {
			if (nameInput.value) {
				if (!notesModule.getProjectList().includes(nameInput.value)) {
					notesModule.setProject(nameInput.value);
					modal.remove();
					clearProjectList();
					generateProjectList(document.querySelector(".project-list"));
					injectSVG();
					event.preventDefault();
				}
			}
		});
		cancelButton.addEventListener("click", (event) => {
			modal.remove();
			event.preventDefault();
		});

		modalBody.append(nameInput, cancelButton, saveButton);
		modal.append(modalOverlay, modalBody);
		document.body.append(modal);
		nameInput.focus();
	}

	function addProjectEvent() {
		renderProjectModal();
	}

	function generateProjectList(projectList) {
		const addNewProject = document.createElement("li");
		const addIcon = new Image();
		addIcon.src = addSrc;
		addIcon.classList.add("svg-icon");

		addNewProject.classList.add(".add-new-project");
		addNewProject.addEventListener("click", addProjectEvent);

		addNewProject.append(addIcon, "Add new project");
		projectList.append(addNewProject);

		for (let i = 1; i < notesModule.getProjectList().length; i++) {
			const li = document.createElement("li");
			const clearContainer = document.createElement("div");
			const clear = new Image();
			clear.src = cancelSrc;

			clear.classList.add("svg-icon");
			li.innerText = notesModule.getProjectList()[i];
			li.addEventListener("click", projectListEvent);
			li.dataset.index = i;
			clearContainer.append(clear);
			clearContainer.addEventListener("click", clearProjectLi);
			li.append(clearContainer);
			projectList.append(li);
		}
	}

	function clearProjectLi(event) {
		const pageHead = document.querySelector(".page-head");
		const indices = [];
		for (let i = 0; i < notesModule.getNotesList().length; i++) {
			if (
				notesModule.getNotesList()[i].category ===
				event.target.parentElement.innerText
			)
				indices.push(i);
		}
		indices.forEach((index) => {
			notesModule.editSingleNoteProperty(index, "category", "Home");
		});
		notesModule.removeProject(event.target.parentElement.dataset.index);
		clearProjectList();
		clearList();
		if (event.target.parentElement.innerText === pageHead.innerText) {
			pageHead.innerText = "Home";
			populateList(document.querySelector(".list-container"), "Home");
		} else {
			populateList(
				document.querySelector(".list-container"),
				pageHead.innerText
			);
		}
		generateProjectList(document.querySelector(".project-list"));
		injectSVG();
		event.stopPropagation();
	}

	function todayLinkEvent() {
		clearList();
		populateList(document.querySelector(".list-container"));
		document.querySelector(".page-head").textContent = "Today";
	}

	function homeLinkEvent() {
		clearList();
		populateList(document.querySelector(".list-container"), "Home");
		document.querySelector(".page-head").textContent = "Home";
	}

	function generateSidebarLinks() {
		const sidebarLinks = document.createElement("ul");
		const homeLink = document.createElement("li");
		const todayLink = document.createElement("li");
		const projectLink = document.createElement("li");

		const projectList = document.createElement("ul");

		const dateIconContainer = document.createElement("div");

		const homeIcon = new Image();
		homeIcon.src = homeSrc;
		const todayIcon = new Image();
		todayIcon.src = todaySrc;
		const projectIcon = new Image();
		projectIcon.src = projectSrc;

		const todaysDate = document.createElement("h6");
		todaysDate.innerHTML = new Date().getUTCDate();
		projectList.classList.add("project-list");
		homeIcon.classList.add("svg-icon");
		todayIcon.classList.add("svg-icon");
		projectIcon.classList.add("svg-icon");
		dateIconContainer.classList.add("date-icon");

		generateProjectList(projectList);
		homeLink.append(homeIcon, "Home");
		projectLink.append(projectIcon, "Projects", projectList);
		dateIconContainer.append(todayIcon, todaysDate);
		todayLink.append(dateIconContainer, "Today");

		todayLink.addEventListener("click", todayLinkEvent);
		homeLink.addEventListener("click", homeLinkEvent);

		sidebarLinks.classList.add("sidebar-li-container");

		sidebarLinks.append(homeLink, todayLink, projectLink);
		return sidebarLinks;
	}

	function generateSidebar() {
		const sidebar = document.createElement("aside");
		const sidebarStuff = document.createElement("div");
		const footerContainer = document.createElement("div");
		const websiteLink = document.createElement("a");

		sidebarStuff.append(generateSidebarLinks());

		const darkModeLabel = document.createElement("label");
		const darkmodeCheck = document.createElement("input");
		const darkmodeSwitch = document.createElement("div");

		websiteLink.textContent = "Vikas Kharkwal";
		footerContainer.textContent = "Designed and developed by";

		websiteLink.classList.add("website-button");
		sidebarStuff.classList.add("sidebar-stuff");
		footerContainer.classList.add("sidebar-footer");
		darkModeLabel.classList.add("darkmode-label");
		darkmodeCheck.classList.add("darkmode-check");
		darkmodeSwitch.classList.add("darkmode-switch");

		websiteLink.setAttribute("href", "/");
		websiteLink.setAttribute("target", "_blank");
		darkmodeCheck.setAttribute("type", "checkbox");

		darkModeLabel.append("Dark Mode", darkmodeCheck, darkmodeSwitch);
		footerContainer.append(websiteLink);
		sidebar.append(sidebarStuff, darkModeLabel, footerContainer);

		darkmodeCheck.addEventListener("click", darkModeEvent);

		return sidebar;
	}

	function darkModeEvent(event) {
		if (event.target.checked) {
			document.documentElement.classList.add("darkmode");
			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.classList.remove("darkmode");
			localStorage.setItem("theme", "light");
		}
	}

	function editEvent(index) {
		renderEditModal(index);
	}

	function addButtonEvent() {
		renderNewModal();
	}

	function projectListEvent(event) {
		const container = document.querySelector(".list-container");
		clearList();
		populateList(container, event.target.innerText);
		document.querySelector(".page-head").textContent = event.target.innerText;
	}

	function renderNewModal() {
		const priorities = ["Low Priority", "Normal Priority", "High Priority"];
		const modal = document.createElement("div");
		const modalOverlay = document.createElement("div");
		const modalBody = document.createElement("form");
		const titleInput = document.createElement("input");
		const descriptionInput = document.createElement("textarea");
		const prioritySelectLabel = document.createElement("label");
		const prioritySelect = document.createElement("select");
		const categorySelectLabel = document.createElement("label");
		const dateLabel = document.createElement("label");
		const categorySelect = document.createElement("select");
		const datePicker = document.createElement("input");
		const saveButton = document.createElement("button");
		const cancelButton = document.createElement("div");

		const pageHead = document.querySelector(".page-head").textContent;

		titleInput.setAttribute("placeholder", "Title");
		titleInput.required = true;
		descriptionInput.required = true;
		datePicker.required = true;
		descriptionInput.setAttribute("placeholder", "Description...");
		descriptionInput.setAttribute("rows", "4");
		datePicker.setAttribute("type", "date");

		saveButton.textContent = "Save";
		cancelButton.textContent = "Cancel";
		prioritySelectLabel.textContent = "Set Priority:";
		categorySelectLabel.textContent = "Set Category:";

		for (let i = 0; i < 3; i++) {
			const node = document.createElement("option");
			node.value = i + 1;
			node.textContent = priorities[i];
			if (i + 1 === 2) {
				node.setAttribute("selected", "selected");
			}
			prioritySelect.append(node);
		}

		for (let i = 0; i < notesModule.getProjectList().length; i++) {
			const node = document.createElement("option");
			node.value = notesModule.getProjectList()[i];
			node.textContent =
				notesModule.getProjectList()[i] === "Home"
					? "Default"
					: notesModule.getProjectList()[i];
			const pageHead = document.querySelector(".page-head").textContent;
			if (!(pageHead === "Home" && pageHead === "Today")) {
				if (notesModule.getProjectList()[i] === pageHead) {
					node.setAttribute("selected", "selected");
				}
			}

			categorySelect.append(node);
		}

		modalOverlay.classList.add("modal-overlay");
		modal.classList.add("modal");
		saveButton.classList.add("save-button");
		saveButton.classList.add("button");
		cancelButton.classList.add("cancel-button");
		cancelButton.classList.add("button");

		prioritySelectLabel.append(prioritySelect);
		categorySelectLabel.append(categorySelect);

		saveButton.addEventListener("click", (event) => {
			if (titleInput.value && descriptionInput.value && datePicker.value) {
				notesModule.setNotes(
					titleInput.value,
					descriptionInput.value,
					datePicker.value,
					+prioritySelect.value,
					false,
					categorySelect === "null" ? null : categorySelect.value
				);
				modal.remove();
				clearList();
				populateList(document.querySelector(".list-container"), pageHead);
				event.preventDefault();
			}
		});

		cancelButton.addEventListener("click", (event) => {
			modal.remove();
			event.preventDefault();
		});

		dateLabel.append("Due Date:", datePicker);

		modalBody.append(
			titleInput,
			descriptionInput,
			dateLabel,
			prioritySelectLabel,
			categorySelectLabel,
			cancelButton,
			saveButton
		);
		modal.append(modalOverlay, modalBody);
		document.body.append(modal);
		titleInput.focus();
	}
	function renderEditModal(index) {
		const priorities = ["Low Priority", "Normal Priority", "High Priority"];
		const modal = document.createElement("div");
		const modalOverlay = document.createElement("div");
		const modalBody = document.createElement("form");
		const titleInput = document.createElement("input");
		const descriptionInput = document.createElement("textarea");
		const prioritySelectLabel = document.createElement("label");
		const prioritySelect = document.createElement("select");
		const categorySelectLabel = document.createElement("label");
		const categorySelect = document.createElement("select");
		const datePicker = document.createElement("input");
		const saveButton = document.createElement("button");
		const cancelButton = document.createElement("div");
		const dateLabel = document.createElement("label");

		const pageHead = document.querySelector(".page-head").textContent;

		titleInput.required = true;
		descriptionInput.required = true;
		datePicker.required = true;
		titleInput.setAttribute("placeholder", "Title");
		descriptionInput.setAttribute("placeholder", "Description...");
		descriptionInput.setAttribute("rows", "4");
		datePicker.setAttribute("type", "date");

		saveButton.textContent = "Save";
		cancelButton.textContent = "Cancel";
		prioritySelectLabel.textContent = "Set Priority:";
		categorySelectLabel.textContent = "Set Category:";

		titleInput.value = notesModule.getNotesList()[index].title;
		descriptionInput.value = notesModule.getNotesList()[index].description;
		datePicker.defaultValue = notesModule.getNotesList()[index].dueDate;

		for (let i = 0; i < 3; i++) {
			const node = document.createElement("option");
			node.value = i + 1;
			node.textContent = priorities[i];
			if (notesModule.getNotesList()[index].priority === i + 1) {
				node.setAttribute("selected", "selected");
			}
			prioritySelect.append(node);
		}

		for (let i = 0; i < notesModule.getProjectList().length; i++) {
			const node = document.createElement("option");
			node.value = notesModule.getProjectList()[i];
			node.textContent =
				notesModule.getProjectList()[i] === "Home"
					? "Default"
					: notesModule.getProjectList()[i];
			if (notesModule.getNotesList()[index].category) {
				if (
					notesModule.getNotesList()[index].category ===
					notesModule.getProjectList()[i]
				) {
					node.setAttribute("selected", "selected");
				}
			} else if (node.value === "null") {
				node.setAttribute("selected", "selected");
			}
			categorySelect.append(node);
		}

		modalOverlay.classList.add("modal-overlay");
		modal.classList.add("modal");
		saveButton.classList.add("save-button");
		cancelButton.classList.add("cancel-button");
		cancelButton.classList.add("button");
		saveButton.classList.add("button");

		prioritySelectLabel.append(prioritySelect);
		categorySelectLabel.append(categorySelect);

		saveButton.addEventListener("click", (event) => {
			if (titleInput.value && descriptionInput.value && datePicker.value) {
				notesModule.editSingleNoteProperty(index, "title", titleInput.value);
				notesModule.editSingleNoteProperty(
					index,
					"description",
					descriptionInput.value
				);
				notesModule.editSingleNoteProperty(index, "dueDate", datePicker.value);
				notesModule.editSingleNoteProperty(
					index,
					"priority",
					+prioritySelect.value
				);
				notesModule.editSingleNoteProperty(
					index,
					"category",
					categorySelect.value === "null" ? null : categorySelect.value
				);
				modal.remove();
				clearList();
				populateList(document.querySelector(".list-container"), pageHead);
				event.preventDefault();
			}
		});

		cancelButton.addEventListener("click", (event) => {
			modal.remove();
			event.preventDefault();
		});
		dateLabel.append("Due Date:", datePicker);

		modalBody.append(
			titleInput,
			descriptionInput,
			dateLabel,
			prioritySelectLabel,
			categorySelectLabel,
			cancelButton,
			saveButton
		);
		modal.append(modalOverlay, modalBody);
		document.body.append(modal);
		titleInput.focus();
	}

	function listEvent(event) {
		const listTarget = event.target;
		const listIndex = listTarget.parentElement.dataset.index;
		switch (listTarget.classList[0]) {
			case "flag-icon":
				event.stopPropagation();
				if (listTarget.parentElement.classList.contains("high")) {
					notesModule.editSingleNoteProperty(listIndex, "priority", 1);
					listTarget.parentElement.classList.remove("high");
					listTarget.parentElement.classList.add("low");
				} else if (listTarget.parentElement.classList.contains("normal")) {
					notesModule.editSingleNoteProperty(listIndex, "priority", 3);
					listTarget.parentElement.classList.remove("normal");
					listTarget.parentElement.classList.add("high");
				} else {
					listTarget.parentElement.classList.remove("low");
					notesModule.editSingleNoteProperty(listIndex, "priority", 2);
					listTarget.parentElement.classList.add("normal");
				}
				break;
			case "edit-icon":
				event.stopPropagation();
				editEvent(listIndex);
				break;
			case "delete-icon":
				notesModule.removeNote(listIndex);
				clearList();
				populateList(document.querySelector(".list-container"));
				event.stopPropagation();
				break;
			case "checkbox-container":
				event.stopPropagation();
				break;
			case "check-icon":
				if (listTarget.checked) {
					listTarget.parentElement.parentElement.classList.add("checked-li");
					notesModule.editSingleNoteProperty(
						listTarget.parentElement.parentElement.dataset.index,
						"isDone",
						true
					);
				} else {
					listTarget.parentElement.parentElement.classList.remove("checked-li");
					notesModule.editSingleNoteProperty(
						listTarget.parentElement.parentElement.dataset.index,
						"isDone",
						false
					);
				}
				event.stopPropagation();
				break;
			case "note-li":
				listTarget.classList.toggle("expanded");
				break;
			default:
				listTarget.parentElement.classList.toggle("expanded");
				break;
		}
	}

	function clearList() {
		const allLists = document.querySelectorAll(".list-container li");
		allLists.forEach((item) => {
			item.remove();
		});
	}

	function populateList(listContainer, page = "Today") {
		let currentList;

		if (page === "Today") {
			currentList = notesModule.getNotesList().filter((item) => {
				return (
					format(parseISO(item.dueDate), "dd/MM/yyyy") ===
					format(new Date(), "dd/MM/yyyy")
				);
			});
		} else {
			currentList = notesModule.getNotesList().filter((item) => {
				return item.category === page;
			});
		}
		if (!currentList.length) {
			const li = document.createElement("li");
			const p = document.createElement("p");
			li.innerText = "Nothing to see here, yet.";
			p.innerText =
				page === "Today"
					? "No tasks scheduled for today, check Home tab or any Project."
					: "Press the button on the bottom-right corner to add a task.";
			li.append(p);
			li.classList.add("message-li");
			listContainer.append(li);
		} else {
			for (let i = 0; i < currentList.length; i++) {
				const list = document.createElement("li");
				const listCheck = document.createElement("input");
				const listCheckLabel = document.createElement("label");
				const listTitle = document.createElement("h3");
				const listDescription = document.createElement("p");
				const listDate = document.createElement("h5");
				const listFlagContainer = document.createElement("div");
				const listEditContainer = document.createElement("div");
				const listDeleteContainer = document.createElement("div");
				const listFlag = new Image();
				const listEdit = new Image();
				const listDelete = new Image();

				listFlag.src = flagSrc;
				listEdit.src = editSrc;
				listDelete.src = deleteSrc;

				listCheck.setAttribute("type", "checkbox");

				list.dataset.index = currentList[i]["index"];

				listTitle.textContent = currentList[i].title;
				listCheck.checked = currentList[i].isDone;
				listDescription.textContent = currentList[i].description;
				listDate.textContent = format(
					parseISO(currentList[i].dueDate),
					"dd/MM/yyyy"
				);

				listFlagContainer.classList.add("flag-icon", "icon");
				listEditContainer.classList.add("edit-icon", "icon");
				listDeleteContainer.classList.add("delete-icon", "icon");
				listFlag.classList.add("svg-icon");
				listEdit.classList.add("svg-icon");
				listDelete.classList.add("svg-icon");
				list.classList.add("note-li");
				listCheck.classList.add("check-icon");
				listCheckLabel.classList.add("checkbox-container");
				if (currentList[i].isDone) {
					list.classList.add("checked-li");
				}
				switch (currentList[i].priority) {
					case 1:
						list.classList.add("low");
						break;
					case 2:
						list.classList.add("normal");
						break;
					case 3:
						list.classList.add("high");
						break;
				}

				listFlagContainer.append(listFlag);
				listEditContainer.append(listEdit);
				listDeleteContainer.append(listDelete);

				list.addEventListener("click", listEvent);

				listCheckLabel.append(listCheck);

				list.append(
					listCheckLabel,
					listTitle,
					listDate,
					listFlagContainer,
					listEditContainer,
					listDeleteContainer,
					listDescription
				);
				listContainer.append(list);
				injectSVG();
			}
		}
	}

	function injectSVG() {
		const svgToInject = document.querySelectorAll("img.svg-icon");
		SVGInjector(svgToInject);
	}

	document.body.append(generateHeader(), generateContent());
	injectSVG();

	(function () {
		if (localStorage.getItem("theme")) {
			if (localStorage.getItem("theme") === "dark") {
				document.querySelector(".darkmode-check").checked = true;
				document.documentElement.classList.add("darkmode");
			}
		}

		if (
			window.matchMedia("(prefers-color-scheme: dark)").matches &&
			!localStorage.getItem("theme", "light")
		) {
			document.documentElement.classList.add("darkmode");
			localStorage.setItem("theme", "dark");
			document.querySelector(".darkmode-check").checked = true;
		}

		let vw = window.innerWidth;

		let unitHeight = window.innerHeight / 100;
		document.documentElement.style.setProperty("--vh", unitHeight);
		window.addEventListener("resize", () => {
			unitHeight = window.innerHeight / 100;
			document.documentElement.style.setProperty("--vh", unitHeight);
		});
	})();
})();
