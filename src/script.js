const gpaDisplay = document.getElementById("gpa");
const nameInput = document.getElementById("name");
const creditsInput = document.getElementById("credits");
const gradeInput = document.getElementById("grade");

document.getElementById("add").addEventListener("click", addSubjectThroughInput);
document.getElementById("clear").addEventListener("click", clearSubjects);
document.getElementById("import").addEventListener("click", readFileAsString);
document.getElementById("export").addEventListener("click", exportSubjects);

const list = document.getElementById("list");

let totalWeight = 0, totalCredits = 0;

class Subject {

	constructor(name, credits, grade) {
		this.name = name;
		this.credits = credits;
		this.grade = grade;
		this.weight = credits * grade;
	}

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

	let li = document.createElement("li");
	li.appendChild(document.createTextNode(subject.name + " " + subject.credits + " " + subject.grade + " "));
	let removeButton = document.createElement("button");
	removeButton.setAttribute("id", "remove");
	removeButton.addEventListener("click", removeSubject);
	removeButton.innerHTML = '<i class="gg-trash"></i>';
	li.appendChild(removeButton);
	list.appendChild(li);

	totalWeight += subject.weight;
	totalCredits += subject.credits;
	gpaDisplay.innerHTML = totalWeight / totalCredits;
	if (totalCredits == 0) gpaDisplay.innerHTML = 0;
}

function removeSubject() {
	let subject = list.removeChild(event.target.parentElement).firstChild.wholeText.split(" ");
	totalWeight -= subject[1] * subject[2];
	totalCredits -= Number(subject[1]);
	gpaDisplay.innerHTML = totalWeight / totalCredits;
	if (totalCredits == 0) gpaDisplay.innerHTML = 0;
}

function clearSubjects() {
	list.innerHTML = "";
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
	list.innerHTML = "";

	for (line of content.split("\n")) {
		let items = line.split(" ");
		addSubject(items[0], Number(items[1]), Number(items[2]));
	}
}

function exportSubjects() {
	if (list.innerHTML == "") {
		alert("There must be at least 1 subject in the list.");
		return;
	}

	let content = "";

	for (item of list.getElementsByTagName("li")) {
		content += item.innerHTML.split("<button")[0] + "\n";
		console.log(content);
	}

	var element = document.createElement('a');
  	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  	element.setAttribute('download', 'subjects');

  	element.style.display = 'none';
  	document.body.appendChild(element);

	element.click();

  	document.body.removeChild(element);
}

