const gpaDisplay = document.getElementById("gpaDisplay");

document.getElementById("add").addEventListener("click", addEmptySubjectRow);
document.getElementById("clear").addEventListener("click", clearSubjects);
document.getElementById("import").addEventListener("click", readFileAsString);
document.getElementById("export").addEventListener("click", exportSubjects);

const table = document.getElementById("subjectsTable");

let totalWeight = 0, totalCredits = 0;

class Subject {

	constructor(name, credits, grade) {
		this.name = name;
		this.credits = credits;
		this.grade = grade;
		this.weight = credits * grade;
	}

}

addSubjectRow("DSA", 9, 19);
addSubjectRow("OSF", 9, 15);
addSubjectRow("CN", 6, 16);
addEmptySubjectRow();

function addEmptySubjectRow() {
	addSubjectRow("", "", "");
}

function addSubjectRow(name, credits, grade) {
	let tr = document.createElement("tr");
	tr.setAttribute("class", "subjects-tr");

	let nameInput = document.createElement("input");
	nameInput.setAttribute("type", "text");
	nameInput.setAttribute("id", "name");
	nameInput.setAttribute("placeholder", "Subject");
	nameInput.value = name;

	let td = document.createElement("td");
	td.appendChild(nameInput);
	tr.appendChild(td);

	let creditsInput = document.createElement("input");
	creditsInput.setAttribute("type", "number");
	creditsInput.setAttribute("class", "credits");
	creditsInput.setAttribute("id", "credits");
	creditsInput.setAttribute("placeholder", "Credits");
	creditsInput.setAttribute("min", "1");
	creditsInput.addEventListener("input", updateGPA);
	creditsInput.value = credits;

	td = document.createElement("td");
	td.appendChild(creditsInput);
	tr.appendChild(td);

	let gradeInput = document.createElement("select");
	gradeInput.setAttribute("type", "number");
	gradeInput.setAttribute("class", "grade");
	gradeInput.setAttribute("id", "grade");
	gradeInput.setAttribute("placeholder", "Grade");
	gradeInput.addEventListener("input", updateGPA);

	let option = document.createElement("option");
	option.setAttribute("value", "");
	option.setAttribute("hidden", "");
	option.setAttribute("selected", "");
	option.innerHTML = "Grade";
	gradeInput.appendChild(option);

	for (let i = 10; i < 21; i++) {
		option = document.createElement("option");
		option.setAttribute("value", i);
		option.innerHTML = i;
		gradeInput.appendChild(option);
	}

	if (grade != "") {
		gradeInput.value = grade;
	}

	td = document.createElement("td");
	td.appendChild(gradeInput);
	tr.appendChild(td);

	let removeButton = document.createElement("button");
	removeButton.setAttribute("id", "remove");
	removeButton.addEventListener("click", removeSubject);
	removeButton.innerHTML = '<i class="gg-trash"></i>';
	tr.appendChild(removeButton);

	table.appendChild(tr);

	updateGPA();
}

function removeSubject() {
	table.removeChild(event.target.parentElement);
	updateGPA();
}

function updateGPA() {
	totalWeight = totalCredits = 0;
	let creditsInputs = table.getElementsByClassName("credits");
	let gradeInputs = table.getElementsByClassName("grade");

	for (let i = 0; i < creditsInputs.length; i++) {
		if (creditsInputs[i].value == "" || gradeInputs[i].value == "") {
			continue;
		}

		totalWeight += creditsInputs[i].value * gradeInputs[i].value;
		totalCredits += Number(creditsInputs[i].value);
	}

	gpaDisplay.innerHTML = (totalWeight / totalCredits).toFixed(2);
	if (totalCredits == 0) gpaDisplay.innerHTML = 0;
}

function clearSubjects() {
	table.innerHTML = "";
	updateGPA();
}

function readFileAsString() {
    let input = document.createElement('input');
	input.type = 'file';

	input.onchange = e => { 
		let file = e.target.files[0]; 
		let reader = new FileReader();
		reader.readAsText(file,'UTF-8');
	
		reader.onload = readerEvent => {
    		let content = readerEvent.target.result;
			importSubjects(content.split(/\r?\n/).filter(line => line.trim() !== "").join("\n"));
   		}
	}

	input.click();
}

function importSubjects(content) {
	clearSubjects();

	for (line of content.split("\n")) {
		let items = line.split(" ");
		addSubjectRow(items[0], Number(items[1]), Number(items[2]));
	}
}

function exportSubjects() {
	if (table.children.length < 1) {
		alert("There must be at least 1 subject in the list.");
		return;
	}

	let content = "";

	for (row of table.getElementsByTagName("tr")) {
		let name = row.children[0].children[0].value;
		let credits = row.children[1].children[0].value;
		let grade = row.children[2].children[0].value;

		console.log(name);

		if (name != "" && credits != "" && grade != "") {
			content += name + " " + credits + " " + grade + "\n";
		}
	}

	let element = document.createElement('a');
  	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  	element.setAttribute('download', 'subjects');

  	element.style.display = 'none';
  	document.body.appendChild(element);

	element.click();

  	document.body.removeChild(element);
}

