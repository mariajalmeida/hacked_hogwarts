"use strict";

window.addEventListener("DOMContentLoaded", fetchData);

async function fetchData() {
    const students = "https://petlatkea.dk/2021/hogwarts/students.json";
    const response = await fetch(students);
    const data = await response.json();

    prepareData(data);
}

let allStudents = [];

const settings = {
    filter: "",
    sortedBy: ""
}


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
    }
    // else {
    //     student.nickname = undefined;
    //     student.middleName = undefined;
    // }

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
    // else {
    //     student.lastName = undefined;
    // }

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

    setFilter(filter);
}

function setFilter(filter) {
    settings.filterBy = filter;
    console.log(settings.filterBy, "FILTER")
    buildList();
}

// filter by house i
function filterList(filteredList) {

    filteredList = allStudents.filter(isHouse);

    function isHouse(student) {
        if (settings.filterBy === student.house || settings.filterBy === "all") {
            return true;
        } else {
            return false;
        }
    }
    console.log(filteredList, "filtered list");
    return filteredList;
}

// sort by name button targeted ii
function sortCategory(event) {
    const sort = event.target.dataset.sort;

    setSort(sort);
}

function setSort(sortedBy) {
    settings.sortedBy = sortedBy;
    console.log(settings.sortedBy, "SORTED");
    buildList();
}

// sort by name i
function sortBy() {

    if (settings.sortedBy === "firstname") {
        console.log("return first name");
        return allStudents.sort(sortByFirstName);
    } else if (settings.sortedBy === "lastname") {
        return allStudents.sort(sortByLastName);
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
    console.log(s, "final list")
    document.querySelector(".list").innerHTML = "";

    s.forEach(divideStudents);
}

function divideStudents(student) {

    // create clone
    const clone = document.querySelector("#list").content.cloneNode(true);

    // our data
    // const images = "../images/" + student.lastName;
    // const img_path = "_" + student.firstName.substring(0, 1).toLowerCase() + ".png";

    // if (images) {
    //     clone.querySelector("img").src = images + img_path;
    // } else {
    //     console.log("ignore");
    // }

    const fullname = clone.querySelector(".fullname");
    fullname.textContent = student.firstName + " " + student.middleName + " " + student.lastName;

    const gender = clone.querySelector(".gender");
    gender.textContent = student.gender;

    const house = clone.querySelector(".house");
    house.textContent = student.house;

    // modal button
    clone.querySelector(".student").addEventListener("click", res => {
        openModal(student);
    });
    // modal set up
    function openModal() {

        let banner_img = document.querySelector(".banner img");
        if (student.house === "Ravenclaw") {
            banner_img.src = "../images/banner_ravenclaw.jpg";
        } else if (student.house === "Gryffindor") {
            banner_img.src = "../images/banner_gryffindor.jpg";
        } else if (student.house === "Slytherin") {
            banner_img.src = "../images/banner_slytherin.jpg";
        } else if (student.house === "Hufflepuff") {
            banner_img.src = "../images/banner_hufflepuff.jpg";
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
        modal.onclick = () => {
            modal.classList.add("hide");
        }
    }

    // append clone to the list
    document.querySelector(".list").appendChild(clone);

}