const gpaDisplay = document.getElementById("gpa");
const nameInput = document.getElementById("name");
const creditsInput = document.getElementById("credits");
const gradeInput = document.getElementById("grade");

document.getElementById("add").addEventListener("click", addSubject);
document.getElementById("clear").addEventListener("click", clearSubjects);
document.getElementById("import").addEventListener("click", importSubjects);

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

function addSubject() {
	let subject = new Subject(nameInput.value, Number(creditsInput.value), Number(gradeInput.value));

	if (subject.name.length < 1 || subject.credits < 1 || subject.grade < 1) {
		alert("Subject name must be at least 1 character long.\nCredits and Grade must be at least 1.");
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

function importSubjects() {
	let content = selectAndReadFile();
	console.log(content);
}

function selectAndReadFile() {
	let input = document.createElement('input');
	input.type = 'file';
	input.onchange = event => {
		let files = Array.from(input.files);
		console.log(files);
	};
	input.click();
}
