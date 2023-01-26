const gpaDisplay = document.getElementById("gpaDisplay");
const nameInput = document.getElementById("name");
const creditsInput = document.getElementById("credits");
const gradeInput = document.getElementById("grade");

document.getElementById("add").addEventListener("click", addSubjectThroughInput);
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

function updateGPADisplay() {
	gpaDisplay.innerHTML = (totalWeight / totalCredits).toFixed(2);
	if (totalCredits == 0) gpaDisplay.innerHTML = 0;
}

function addSubjectThroughInput() {
	addSubject(nameInput.value, Number(creditsInput.value), Number(gradeInput.value));
}

function addSubject(name, credits, grade) {
	let subject = new Subject(name, credits, grade);

	if (subject.name.length < 1 || subject.credits < 1 || subject.grade < 1) {
		alert("Subject name must be at least 1 character long.\nCredits and Grade must be at least 1.\nExample: ABC 6 18");
		return;
	}

	nameInput.value = "";
	creditsInput.value = "";
	gradeInput.value = "";

	let tr = document.createElement("tr");
	tr.setAttribute("class", "subjects-tr");

	for (item of [subject.name, subject.credits, subject.grade]) {
		let td = document.createElement("td");
		td.setAttribute("class", "subjects-td");
		td.appendChild(document.createTextNode(item));
		tr.appendChild(td);
	}

	let removeButton = document.createElement("button");
	removeButton.setAttribute("id", "remove");
	removeButton.addEventListener("click", removeSubject);
	removeButton.innerHTML = '<i class="gg-trash"></i>';
	tr.appendChild(removeButton);
	table.appendChild(tr);

	totalWeight += subject.weight;
	totalCredits += subject.credits;
	updateGPADisplay();
}

function removeSubject() {
	let subject = table.removeChild(event.target.parentElement).children;
	totalWeight -= subject[1].innerHTML * subject[2].innerHTML;
	totalCredits -= Number(subject[1].innerHTML);
	updateGPADisplay();
}

function clearSubjects() {
	while (table.children.length > 1) {
		table.removeChild(table.lastChild);
	}

	totalWeight = 0;
	totalCredits = 0;
	gpaDisplay.innerHTML = 0;
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
		addSubject(items[0], Number(items[1]), Number(items[2]));
	}
}

function exportSubjects() {
	if (table.children.length < 2) {
		alert("There must be at least 1 subject in the list.");
		return;
	}

	let content = "";

	for (row of table.getElementsByTagName("tr")) {
		content += row.children[0].innerHTML + " " + row.children[1].innerHTML + " " + row.children[2].innerHTML + "\n";
	}

	content = content.substring(content.indexOf("\n")+1);

	var element = document.createElement('a');
  	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  	element.setAttribute('download', 'subjects');

  	element.style.display = 'none';
  	document.body.appendChild(element);

	element.click();

  	document.body.removeChild(element);
}

