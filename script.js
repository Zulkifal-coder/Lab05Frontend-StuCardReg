const form = document.getElementById("regForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const programInput = document.getElementById("program");
const semesterInput = document.getElementById("semester");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const programError = document.getElementById("programError");
const semesterError = document.getElementById("semesterError");

const previewName = document.getElementById("previewName");
const previewEmail = document.getElementById("previewEmail");
const previewProgram = document.getElementById("previewProgram");
const previewSemester = document.getElementById("previewSemester");

const card = document.querySelector("#card");
const modeBtn = document.querySelector("#modeBtn");
const studentList = document.querySelector("#studentList");

nameInput.addEventListener("input", function () {
  previewName.textContent = nameInput.value || "-";
});

emailInput.addEventListener("input", function () {
  previewEmail.textContent = emailInput.value || "-";
});

programInput.addEventListener("input", function () {
  previewProgram.textContent = programInput.value || "-";
});

semesterInput.addEventListener("input", function () {
  previewSemester.textContent = semesterInput.value || "-";
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  let valid = true;

  nameError.textContent = "";
  emailError.textContent = "";
  programError.textContent = "";
  semesterError.textContent = "";

  if (nameInput.value.trim() === "") {
    nameError.textContent = "Please enter your name";
    valid = false;
  }

  if (emailInput.value.trim() === "") {
    emailError.textContent = "Please enter your email";
    valid = false;
  } else if (!emailInput.value.includes("@") || !emailInput.value.includes(".")) {
    emailError.textContent = "Please enter a valid email";
    valid = false;
  }

  if (programInput.value === "") {
    programError.textContent = "Please select a program";
    valid = false;
  }

  if (semesterInput.value === "") {
    semesterError.textContent = "Please enter your semester";
    valid = false;
  } else if (semesterInput.value < 1 || semesterInput.value > 8) {
    semesterError.textContent = "Semester must be between 1 and 8";
    valid = false;
  }

  if (valid) {
    const item = document.createElement("li");
    item.textContent = nameInput.value + " - " + emailInput.value + " - " + programInput.value + " - Semester " + semesterInput.value;
    studentList.appendChild(item);

    form.reset();
    previewName.textContent = "-";
    previewEmail.textContent = "-";
    previewProgram.textContent = "-";
    previewSemester.textContent = "-";
  }
});

modeBtn.addEventListener("click", function () {
  card.classList.toggle("dark");

  if (card.classList.contains("dark")) {
    modeBtn.textContent = "Light Mode";
  } else {
    modeBtn.textContent = "Dark Mode";
  }
});