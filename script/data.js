"use strict";

window.addEventListener("DOMContentLoaded", fetchData);

async function fetchData() {
    const students = "https://petlatkea.dk/2021/hogwarts/students.json";
    const response = await fetch(students);
    const data = await response.json();

    prepareData(data);
}

let allStudents = [];

function prepareData(data) {
    allStudents = data.map(transcribeData);

    displayList(allStudents);
    buttonClicked();
}

// here's all the students
function transcribeData(s) {
    const Student = {
        firstName: "",
        middleName: "",
        lastName: "",
        nickname: "",
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
    } else {
        student.nickname = undefined;
        student.middleName = undefined;
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
    } else {
        student.lastName = undefined;
    }

    // gender
    student.gender = s.gender.substring(0, 1).toUpperCase() + s.gender.substring(1).toLowerCase();

    // house
    const removeSpaceHouse = s.house.trim();
    student.house = removeSpaceHouse.substring(0, 1).toUpperCase() + removeSpaceHouse.substring(1).toLowerCase();

    return student;

}

// filter by house
function buttonClicked() {
    document.querySelectorAll("[data-action='filter']").forEach(btn => btn.addEventListener("click", filterCategory));

    document.querySelectorAll("[data-action='sort']").forEach(btn => btn.addEventListener("click", sortCategory));
}

function sortCategory(event) {
    const sort = event.target.dataset.sort;
    console.log(sort, "?");

    sortBy(sort);
}

function filterCategory(event) {
    const filter = event.target.dataset.filter;
    console.log(filter, "?");

    filteredList(filter);
}

function filteredList(filteredBy) {
    let filteredCategory = allStudents;
    if (filteredBy === "Ravenclaw") {
        filteredCategory = allStudents.filter(isRavenclaw);
    } else if (filteredBy === "Gryffindor") {
        filteredCategory = allStudents.filter(isGryffindor);
    } else if (filteredBy === "Slytherin") {
        filteredCategory = allStudents.filter(isSlytherin);
    } else if (filteredBy === "Hufflepuff") {
        filteredCategory = allStudents.filter(isHufflepuff);
    } else {
        console.log("bye");
    }

    displayList(filteredCategory);
}

function isRavenclaw(student) {
    return student.house === "Ravenclaw";
}

function isGryffindor(student) {
    if (student.house === "Gryffindor") {
        return true;
    } else {
        return false;
    }
}

function isSlytherin(student) {
    if (student.house === "Slytherin") {
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

// sort by name
function sortBy(sortedBy) {
    let sorted = allStudents;

    if (sortedBy === "firstname") {
        sorted = allStudents.sort(sortByFirstName);
    } else if (sortedBy === "lastname") {
        sorted = allStudents.sort(sortByLastName);
    }

    displayList(sorted);
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

// display data
function displayList(s) {
    console.log(s)
    document.querySelector(".list").innerHTML = "";
    s.forEach(divideStudents);
}

function divideStudents(student) {
    // console.log(student);

    // create clone
    const clone = document.querySelector("#list").content.cloneNode(true);

    // our data
    const fullname = clone.querySelector(".fullname");
    fullname.textContent = student.firstName + " " + student.middleName + " " + student.lastName;

    const gender = clone.querySelector(".gender");
    gender.textContent = student.gender;

    const house = clone.querySelector(".house");
    house.textContent = student.house;

    // append clone to the list
    document.querySelector(".list").appendChild(clone);

}