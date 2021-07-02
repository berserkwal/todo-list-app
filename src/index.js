console.log("hello testing");
import logoSrc from "./logo.svg";
import "./style.css";

(function () {
	let unitHeight = window.innerHeight / 100;
	document.documentElement.style.setProperty("--vh", unitHeight);
	window.addEventListener("resize", () => {
		unitHeight = window.innerHeight / 100;
		document.documentElement.style.setProperty("--vh", unitHeight);
	});
})();

const domStuff = (function () {
	function generateAddButton() {
		const addButton = document.createElement("div");

		addButton.textContent = "+";

		addButton.classList.add("add-button");
		return addButton;
	}

	function generateHeader() {
		const headerContainer = document.createElement("header");
		const headerLogoText = document.createElement("div");
		const headerLogo = document.createElement("div");
		const headerLogoImage = document.createElement("div");
		const bigHText = document.createElement("h1");
		const smallHText = document.createElement("p");
		const logo = new Image();

		bigHText.classList.add("big-h-text");
		smallHText.classList.add("small-h-text");
		headerLogo.classList.add("header-logo");
		headerLogoImage.classList.add("header-img-container");
		headerLogoText.classList.add("header-text-container");

		logo.src = logoSrc;
		bigHText.textContent = "To-do;";
		smallHText.textContent = "or not to do...";

		headerLogoImage.append(logo);
		headerLogoText.append(bigHText, smallHText);
		headerLogo.append(headerLogoImage, headerLogoText);
		headerContainer.append(headerLogo);
		return headerContainer;
	}

	function generateContent() {
		const content = document.createElement("section");

		content.append(generateSidebar(), generateMain());
		return content;
	}

	function generateMain() {
		const main = document.createElement("main");
		for (let i = 0; i <= 100; i++) {
			const node = document.createElement("div");
			node.innerText = "hi";
			main.append(node);
		}
		return main;
	}

	function generateSidebar() {
		const sidebar = document.createElement("aside");
		const sidebarStuff = document.createElement("div");

		const footerContainer = document.createElement("div");
		const websiteLink = document.createElement("a");

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

		darkModeLabel.append("Enable Dark Mode", darkmodeCheck, darkmodeSwitch);
		footerContainer.append(websiteLink);
		sidebar.append(sidebarStuff, darkModeLabel, footerContainer);

		return sidebar;
	}

	document.body.append(
		generateHeader(),
		generateContent(),
		generateAddButton()
	);
})();
