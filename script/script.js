"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];

const Student = {
    firstName: "",
    middleName: "",
    lastName: "",
    nickname: "",
    nonPrefect: true,
    nonSquad: true,
    expelStudent: false
}

const settings = {
    filter: "all",
    sortBy: ""
}

function start() {
    fetchData();
    buttonClicked();
}

// buttons when clicked iii
function buttonClicked() {
    document.querySelectorAll("[data-action='filter']").forEach(btn => btn.addEventListener("click", selectFilter));

    document.querySelectorAll("[data-action='sort']").forEach(btn => btn.addEventListener("click", selectSort));
}

async function fetchData() {
    const students = "https://petlatkea.dk/2021/hogwarts/students.json";
    const response = await fetch(students);
    const data = await response.json();

    prepareData(data);
}


function prepareData(data) {
    allStudents = data.map(transcribeData);

    buildList();
}

// here's all the students
function transcribeData(s) {
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

// filter by house button targeted ii
function selectFilter(event) {
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
    console.log(settings.filterBy, "FILTER")
    buildList();
}

// filter by house i
function filterList(filteredList) {

    filteredList = allStudents.filter(isHouse);
    console.log(filteredList);

    function isHouse(student) {
        if (settings.filterBy === student.house || settings.filterBy === "all") {
            return true;
        }
    }
    console.log(filteredList, "filtered list");
    return filteredList;
}

// sort by name button targeted ii
function selectSort(event) {
    const sortBy = event.target.dataset.sort;

    // toggle active class
    const active = document.querySelector(".active_sort");
    if (active !== null) {
        active.classList.remove("active_sort");
    }
    event.target.classList.toggle("active_sort");

    setSort(sortBy);
}

function setSort(sortBy) {
    settings.sortBy = sortBy;
    console.log(settings.sortBy, "SORTED");
    buildList();
}

// sort by name i
function sortList(sortedList) {
    if (settings.sortedBy === "firstname") {
        console.log("return first name");
        sortedList = sortedList.sort(sortByFirstName);
        console.log("sort", sortedList)
    } else if (settings.sortedBy === "lastname") {
        sortedList = sortedList.sort(sortByLastName);
    }
    console.log("????", sortedList)
    return sortedList;
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
    let currentList = filterList(allStudents);
    console.log(allStudents, "current");
    const sortedList = sortList(currentList);
    console.log(sortedList, "sort")

    displayList(sortedList);
}

// display data
function displayList(students) {
    document.querySelector(".list").innerHTML = "";

    students.forEach(divideStudents);
}

function divideStudents(student) {

    // create clone
    const clone = document.querySelector("#list").content.cloneNode(true);

    // our data
    const images = "../images/" + student.lastName;
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
    // clone.querySelector("[data-field=expel]").dataset.expel = student.expelStudent;
    // clone.querySelector("[data-field=expel]").addEventListener("click", expelStudentNow);

    // function expelStudentNow() {
    //     if (student.expelStudent === true) {
    //         console.log("false");
    //         student.expelStudent = false;
    //         document.querySelector(".expell").textContent = "Hey student";
    //     } else {
    //         console.log("true");
    //         student.expelStudent = true;
    //         document.querySelector(".expel").textContent = "Student expelled";
    //     }
    //     buildList();
    // }

    // modal button
    clone.querySelector(".image").addEventListener("click", res => {
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

        // prefect
        document.querySelector(".non-prefect").addEventListener("click", decidePrefect);

        function decidePrefect() {
            if (student.nonPrefect === true) {
                student.nonPrefect = false;
                document.querySelector(".non-prefect").textContent = "Prefect";
            } else {
                student.nonPrefect = true;
                document.querySelector(".non-prefect").textContent = "Non-Prefect";
            }
        }

        // squad member
        document.querySelector(".non-member").addEventListener("click", decideMember);

        function decideMember() {
            if (student.nonSquad === true) {
                student.nonSquad = false;
                document.querySelector(".non-member").textContent = "Inquisitorial Squad Member";
            } else {
                student.nonSquad = true;
                document.querySelector(".non-member").textContent = "Non-Inquisitorial Squad Member";
            }
        }

        // modal
        const modal = document.querySelector(".modal-background");
        modal.classList.remove("hide");
        const closeBtn = document.querySelector("span");
        closeBtn.addEventListener("click", () => {
            modal.classList.add("hide");
        })
    }

    // append clone to the list
    document.querySelector(".list").appendChild(clone);

}