"use strict";

window.addEventListener("DOMContentLoaded", fetchData);

async function fetchData() {
    const students = "https://petlatkea.dk/2021/hogwarts/students.json";
    const response = await fetch(students);
    const data = await response.json();

    prepareData(data);
}

let allStudents = [];
let expelledStudents = [];

const settings = {
    filterBy: "all",
    sortedBy: ""
}


function prepareData(data) {
    allStudents = data.map(transcribeData);
    buildList();
    buttonClicked();
    totalNumberOfStudents()
}

// search bar
function mySearchFunction() {
    let item, textValue;
    let input = document.getElementById("myInput");
    let filter = input.value.toUpperCase();
    let list = document.getElementById("students_list");
    let li = list.getElementsByClassName("student");
    for (let i = 0; i < li.length; i++) {
        item = li[i];
        textValue = item.textContent || item.innerText;
        if (textValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

// here's all the students
function transcribeData(s) {
    const Student = {
        firstName: "",
        middleName: "",
        lastName: "",
        nickname: "",
        prefect: false,
        nonSquad: true,
        expelStudent: false

    }
    const student = Object.create(Student);

    const removeSurroundingSpace = s.fullname.trim();
    const firstSpace = removeSurroundingSpace.indexOf(" ");
    const lastSpace = removeSurroundingSpace.lastIndexOf(" ");

    // first name of the student
    const firstNameOnly = removeSurroundingSpace.substring(0, firstSpace) || removeSurroundingSpace.substring(0);
    student.firstName = firstNameOnly.substring(0, 1).toUpperCase() + firstNameOnly.substring(1).toLowerCase();
    // console.log(`First name _${student.firstName}_`)

    // middle name and nickname
    const middleNameOnly = removeSurroundingSpace.substring(firstSpace + 1, lastSpace);
    if (removeSurroundingSpace.includes('"')) {
        const removeQuotes = middleNameOnly.split('"').join('');
        student.nickname = removeQuotes.substring(0, 1).toUpperCase() + removeQuotes.substring(1).toLowerCase();
    } else if (middleNameOnly.length > 2) {
        student.middleName = middleNameOnly.substring(0, 1).toUpperCase() + middleNameOnly.substring(1).toLowerCase();
    }

    // last name
    if (removeSurroundingSpace.includes(" ")) {
        const lastNameOnly = removeSurroundingSpace.substring(lastSpace + 1);
        if (lastNameOnly.includes("-")) {
            const hyphen = lastNameOnly.indexOf("-");
            student.lastName = lastNameOnly.substring(0, 1).toUpperCase() + lastNameOnly.substring(1, hyphen).toLowerCase() + lastNameOnly.substring(hyphen, hyphen + 2).toUpperCase() + lastNameOnly.substring(hyphen + 2).toLowerCase();
        } else {
            student.lastName = lastNameOnly.substring(0, 1).toUpperCase() + lastNameOnly.substring(1).toLowerCase();
        }
    }

    // gender
    student.gender = s.gender.substring(0, 1).toUpperCase() + s.gender.substring(1).toLowerCase();

    // house
    const removeSpaceHouse = s.house.trim();
    student.house = removeSpaceHouse.substring(0, 1).toUpperCase() + removeSpaceHouse.substring(1).toLowerCase();

    return student;
}

// buttons when clicked iii
function buttonClicked() {
    document.querySelectorAll("[data-action='filter']").forEach(btn => btn.addEventListener("click", filterCategory));

    document.querySelectorAll("[data-action='sort']").forEach(btn => btn.addEventListener("click", sortCategory));
}

// filter by house button targeted ii
function filterCategory(event) {
    const filter = event.target.dataset.filter;

    // toggle active class
    const active = document.querySelector(".active");
    if (active !== null) {
        active.classList.remove("active");
    }
    event.target.classList.toggle("active");


    setFilter(filter);
}

function setFilter(filter) {
    settings.filterBy = filter;
    buildList();
}

// filter by house i
function filterList(inputList) {

    const filteredList = inputList.filter(isHouse);

    function isHouse(student) {
        if (settings.filterBy === student.house || settings.filterBy === "all") {
            return true;
        } else {
            return false;
        }
    }
    return filteredList;
}

// sort by name button targeted ii
function sortCategory(event) {
    const sort = event.target.dataset.sort;

    // toggle active class
    const active = document.querySelector(".active_sort");
    if (active !== null) {
        active.classList.remove("active_sort");
    }
    event.target.classList.toggle("active_sort");

    setSort(sort);
}

function setSort(sortedBy) {
    settings.sortedBy = sortedBy;
    buildList();
}

// sort by name i
function sortBy() {

    if (settings.sortedBy === "firstname") {
        return allStudents.sort(sortByFirstName);
    } else if (settings.sortedBy === "lastname") {
        return allStudents.sort(sortByLastName);
    } else {
        return allStudents;
    }
}

function sortByFirstName(a, b) {
    if (a.firstName < b.firstName) {
        return -1;
    } else {
        return 1;
    }
}

function sortByLastName(a, b) {
    if (a.lastName < b.lastName) {
        return -1;
    } else {
        return 1;
    }
}

function buildList() {
    const sortingList = sortBy(allStudents);
    const currentList = filterList(sortingList);

    displayList(currentList);
}

// display data
function displayList(s) {
    document.querySelector(".list").innerHTML = "";

    s.forEach(displaySingleStudent);
    listOfStudentsDisplayed(s);
}

function totalNumberOfStudents() {
    document.querySelector(".students_total p").textContent = allStudents.length;
}

function listOfStudentsDisplayed(students) {
    // data
    document.querySelector(".total-list-number p").textContent = students.length;
}

function numberOfStudentsPerHouse(student) {
    const resultS = allStudents.filter(isSlytherin);
    const resultG = allStudents.filter(isGryffindor);
    const resultR = allStudents.filter(isRavenclaw);
    const resultH = allStudents.filter(isHufflepuff);


    let finalResultS = [];
    let finalResultGryffindor = [];
    let finalResultRavenclaw = [];
    let finalResultHufflepuff = [];

    function isSlytherin(student) {
        if (student.house === "Slytherin") {
            return true;
        } else {
            return false;
        }
    }

    function isGryffindor(student) {
        if (student.house === "Gryffindor") {
            return true;
        } else {
            return false;
        }
    }

    function isRavenclaw(student) {
        if (student.house === "Ravenclaw") {
            return true;
        } else {
            return false;
        }
    }

    function isHufflepuff(student) {
        if (student.house === "Hufflepuff") {
            return true;
        } else {
            return false;
        }
    }

    finalResultS.push(resultS);
    finalResultGryffindor.push(resultG);
    finalResultRavenclaw.push(resultR);
    finalResultHufflepuff.push(resultH);

    for (let i = 0; i < finalResultS.length; i++) {
        let text = finalResultS[i];
        document.querySelector(".slytherin_tl p").textContent = text.length;
    }

    for (let i = 0; i < finalResultGryffindor.length; i++) {
        let text = finalResultGryffindor[i];
        document.querySelector(".gryffindor_tl p").textContent = text.length;
    }

    for (let i = 0; i < finalResultRavenclaw.length; i++) {
        let text = finalResultRavenclaw[i];
        document.querySelector(".ravenclaw_tl p").textContent = text.length;
    }

    for (let i = 0; i < finalResultHufflepuff.length; i++) {
        let text = finalResultHufflepuff[i];
        document.querySelector(".hufflepuff_tl p").textContent = text.length;
    }

}

function displaySingleStudent(student) {

    // create clone
    const clone = document.querySelector("#list").content.cloneNode(true);
    numberOfStudentsPerHouse(student);

    const studentCard = clone.querySelector(".student");
    document.querySelector(".expelled_list").style.display = "none";

    // our data
    const images = "./images/" + student.lastName.toLowerCase();
    const img_path = "_" + student.firstName.substring(0, 1).toLowerCase() + ".png";

    // images
    if (student.firstName === "Justin" || student.firstName === "Padma" || student.firstName === "Parvati" || student.firstName === "Leanne") {
        clone.querySelector(".image").classList.add("empty");
        clone.querySelector("img").remove();
    } else {
        clone.querySelector("img").src = images + img_path;
    }

    const fullname = clone.querySelector(".fullname");
    fullname.textContent = student.firstName + " " + student.middleName + " " + student.lastName;

    const gender = clone.querySelector(".gender");
    gender.textContent = student.gender;

    const house = clone.querySelector(".house");
    house.textContent = student.house;


    // expel student
    clone.querySelector("[data-field=expel]").dataset.expel = student.expelStudent;
    clone.querySelector("[data-field=expel]").addEventListener("click", expelStudentNow);

    function expelStudentNow(event) {
        if (student.expelStudent === true) {
            student.expelStudent = false;
            event.target.textContent = "Expel student";
        } else {
            student.expelStudent = true;
            event.target.textContent = "Student expelled";
            expelledStudents.push(student);
            document.querySelector(".expelled_students p").textContent = expelledStudents.length;
            document.querySelector(".students_total p").textContent = allStudents.length - expelledStudents.length;
            alert(student.firstName + " has been successfully expelled!")
            displayExpelledList();
        }
    }

    function displayExpelledList() {
        // create clone
        const clone = document.querySelector("#expelled_list").content.cloneNode(true);

        document.querySelector(".expelled_list").style.display = "block";

        if (student.expelStudent = true) {
            studentCard.style.display = "none";
        } else {
            console.log("ignore");
        }

        // our data
        const images = "./images/" + student.lastName.toLowerCase();
        const img_path = "_" + student.firstName.substring(0, 1).toLowerCase() + ".png";

        // images
        if (student.firstName === "Justin" || student.firstName === "Padma" || student.firstName === "Parvati" || student.firstName === "Leanne") {
            clone.querySelector(".image").classList.add("empty");
            clone.querySelector("img").remove();
        } else {
            clone.querySelector("img").src = images + img_path;
        }

        const fullname = clone.querySelector(".fullname");
        fullname.textContent = student.firstName + " " + student.middleName + " " + student.lastName;

        const gender = clone.querySelector(".gender");
        gender.textContent = student.gender;

        const house = clone.querySelector(".house");
        house.textContent = student.house;

        // append clone to the list
        document.querySelector(".students").appendChild(clone);
    }

    // prefect
    if (student.prefect === true) {
        clone.querySelector("[data-field=prefect]").textContent = "Prefect";
        alert(student.firstName + " has been successfully signed up as a prefect.")
    } else {
        clone.querySelector("[data-field=prefect]").textContent = "Non-Prefect";
    }

    clone.querySelector("[data-field=prefect]").addEventListener("click", makePrefect);

    function makePrefect() {
        if (student.prefect === true) {
            student.prefect = false;
            alert(student.firstName + " has been successfully removed as a prefect.")
        } else {
            decideAPrefect(student);
        }
        buildList();
    }

    // squad member
    clone.querySelector(".non-member").addEventListener("click", decideMember);

    function decideMember(event) {
        if (student.nonSquad === true) {
            student.nonSquad = false;
            event.target.textContent = "Inquisitorial Squad Member";
        } else {
            student.nonSquad = true;
            event.target.textContent = "Non-Inquisitorial Squad Member";
        }
    }

    // modal button
    clone.querySelector(".image").addEventListener("click", res => {
        openModal(student);
    });

    // append clone to the list
    document.querySelector(".list").appendChild(clone);
}

function decideAPrefect(selectedStudent) {

    // all the existing prefects
    const prefects = allStudents.filter(student => student.prefect);
    const teammate = prefects.filter(student => student.house === selectedStudent.house).shift();

    const perHouse = allStudents.filter(student => student.house === selectedStudent.house && student.prefect);
    const perHouseLength = perHouse.length;

    if (teammate !== undefined && selectedStudent.house === teammate.house && perHouseLength == 2) {
        console.log("Two members per house");
        removeOther(teammate);
        alert("Error #4395 \nOnly two prefects per house. \nAnother prefect has been succesfully removed.");
    } else {
        console.log("another one")
        newAppointedPrefect(selectedStudent);
    }

    function removeOther(another) {
        removeStudent(another);
        newAppointedPrefect(selectedStudent);
    }

    function removeStudent(prefectStudent) {
        prefectStudent.prefect = false;
    }

    function newAppointedPrefect(student) {
        student.prefect = true;
    }
}

// modal set up
function openModal(student) {

    let banner_img = document.querySelector(".banner img");
    if (student.house === "Ravenclaw") {
        banner_img.src = "./images/banner_ravenclaw.jpg";
    } else if (student.house === "Gryffindor") {
        banner_img.src = "./images/banner_gryffindor.jpg";
    } else if (student.house === "Slytherin") {
        banner_img.src = "./images/banner_slytherin.jpg";
    } else if (student.house === "Hufflepuff") {
        banner_img.src = "./images/banner_hufflepuff.jpg";
    }

    const firstName = document.querySelector(".firstname p");
    firstName.textContent = student.firstName;

    const nickname = document.querySelector(".nickname p");
    if (student.nickname) {
        nickname.textContent = student.nickname;
    } else {
        nickname.textContent = "x";
    }

    const middleName = document.querySelector(".middlename p");

    if (student.middleName) {
        middleName.textContent = student.middleName;
    } else {
        middleName.textContent = "x";
    }

    const lastName = document.querySelector(".lastname p");
    lastName.textContent = student.lastName;

    const gender = document.querySelector(".gender p");
    gender.textContent = student.gender;

    const house = document.querySelector(".house p");
    house.textContent = student.house;


    const modalInner = document.querySelector(".modal-content");
    if (student.house === "Slytherin") {
        modalInner.classList.remove("gryffindor");
        modalInner.classList.remove("hufflepuff");
        modalInner.classList.remove("ravenclaw");
        modalInner.classList.add("slytherin");
    } else if (student.house === "Ravenclaw") {
        modalInner.classList.remove("gryffindor");
        modalInner.classList.remove("slytherin");
        modalInner.classList.remove("hufflepuff");
        modalInner.classList.add("ravenclaw");
    } else if (student.house === "Gryffindor") {
        modalInner.classList.remove("ravenclaw");
        modalInner.classList.remove("slytherin");
        modalInner.classList.remove("hufflepuff");
        modalInner.classList.add("gryffindor");
    } else if (student.house === "Hufflepuff") {
        modalInner.classList.remove("gryffindor");
        modalInner.classList.remove("ravenclaw");
        modalInner.classList.remove("slytherin");
        modalInner.classList.add("hufflepuff");
    }

    // modal
    const modal = document.querySelector(".modal-background");
    modal.classList.remove("hide");
    const closeBtn = document.querySelector("span");
    closeBtn.addEventListener("click", () => {
        modal.classList.add("hide");
    })
}