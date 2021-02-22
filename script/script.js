"use strict";

window.addEventListener("DOMContentLoaded", fetchData);

function fetchData() {
    const students = "https://petlatkea.dk/2021/hogwarts/students.json";
    fetch(students)
        .then(res => res.json())
        .then(transcribeData);
}

const allStudents = [];

// here's all the students
function transcribeData(students) {
    students.forEach(s => {
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

        allStudents.push(student);
    });

    displayList(allStudents);
}

// filter by house
function filteredList() {
    const filtered = allStudents.filter(isRavenclaw);

    displayList(filtered);
}

function isRavenclaw(student) {
    if (student.house === "Ravenclaw") {
        return true;
    } else {
        return false;
    }
}

// display data
function displayList(s) {
    console.log(s)
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
    document.querySelector("#students_list").appendChild(clone);

}