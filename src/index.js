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
	let unitHeight = window.innerHeight / 100;
	document.documentElement.style.setProperty("--vh", unitHeight);
	window.addEventListener("resize", () => {
		unitHeight = window.innerHeight / 100;
		document.documentElement.style.setProperty("--vh", unitHeight);
	});
})();

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
		const headerLogoText = document.createElement("div");
		const headerLogo = document.createElement("div");
		const headerLogoImage = document.createElement("div");
		const bigHText = document.createElement("h2");
		const smallHText = document.createElement("p");
		const logo = new Image();

		bigHText.classList.add("big-h-text");
		smallHText.classList.add("small-h-text");
		headerLogo.classList.add("header-logo");
		headerLogoImage.classList.add("header-img-container");
		headerLogoText.classList.add("header-text-container");
		logo.classList.add("svg-icon");

		logo.src = logoSrc;
		bigHText.textContent = "To-do";
		smallHText.textContent = "or not to do...";

		headerLogoImage.append(logo);
		headerLogoText.append(bigHText, smallHText);
		headerLogo.append(headerLogoImage, headerLogoText);
		headerContainer.append(headerLogo);
		return headerContainer;
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

		console.log(notesModule.getProjectList());

		saveButton.addEventListener("click", (event) => {
			if (nameInput.value) {
				console.log(nameInput.value);
				notesModule.setProject(nameInput.value);
				console.log(notesModule.getProjectList());
				modal.remove();
				clearProjectList();
				generateProjectList(document.querySelector(".project-list"));
				event.preventDefault();
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
		console.log(event.target.parentElement.dataset.index);
		const indices = [];
		for (let i = 0; i < notesModule.getNotesList().length; i++) {
			if (
				notesModule.getNotesList()[i].category ===
				event.target.parentElement.innerText
			)
				indices.push(i);
		}
		console.log(indices);
		indices.forEach((index) => {
			notesModule.editSingleNoteProperty(index, "category", null);
		});
		notesModule.removeProject(event.target.parentElement.dataset.index);
		event.stopPropagation();
		clearProjectList();
		if (event.target.parentElement.innerText === pageHead.innerText) {
			clearList();
			pageHead.innerText = "Home";
			populateList(document.querySelector(".list-container"), null);
		}
		generateProjectList(document.querySelector(".project-list"));
		injectSVG();
	}

	function todayLinkEvent() {
		clearList();
		populateList(document.querySelector(".list-container"));
		document.querySelector(".page-head").textContent = "Today";
	}

	function homeLinkEvent() {
		clearList();
		populateList(document.querySelector(".list-container"), null);
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
		todaysDate.innerHTML = new Date().toLocaleDateString().slice(0, 2);
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

		websiteLink.textContent = "berserkwal";
		footerContainer.textContent = "Designed and developed by";

		websiteLink.classList.add("website-button");
		sidebarStuff.classList.add("sidebar-stuff");
		footerContainer.classList.add("sidebar-footer");
		darkModeLabel.classList.add("darkmode-label");
		darkmodeCheck.classList.add("darkmode-check");
		darkmodeSwitch.classList.add("darkmode-switch");

		websiteLink.setAttribute("href", "https://berserkwal.github.io");
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
		} else {
			document.documentElement.classList.remove("darkmode");
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
			node.textContent = notesModule.getProjectList()[i]
				? notesModule.getProjectList()[i]
				: "Default";
			const pageHead = document.querySelector(".page-head").textContent;
			console.log(pageHead);
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

		modalBody.append(
			titleInput,
			descriptionInput,
			datePicker,
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
			node.textContent = notesModule.getProjectList()[i]
				? notesModule.getProjectList()[i]
				: "Default";
			if (notesModule.getNotesList()[index].category) {
				if (notesModule.getNotesList()[index].category === node.value) {
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

		modalBody.append(
			titleInput,
			descriptionInput,
			datePicker,
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

		if (page) {
			if (page === "Today") {
				currentList = notesModule.getNotesList().filter((item) => {
					return (
						format(parseISO(item.dueDate), "dd/MM/yyyy") ===
						format(new Date(), "dd/MM/yyyy")
					);
				});
				console.log(currentList);
			} else {
				currentList = notesModule.getNotesList().filter((item) => {
					return item.category === page;
				});
			}
		} else {
			currentList = notesModule.getNotesList().filter((item) => {
				return item.category === null;
			});
		}

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

			list.dataset.index = i;

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

	function injectSVG() {
		const svgToInject = document.querySelectorAll("img.svg-icon");
		SVGInjector(svgToInject);
	}

	document.body.append(generateHeader(), generateContent());
	injectSVG();
})();
