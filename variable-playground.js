// var person = {
// 	name: 'Charlie',
// 	age: 29
// };

// function updatePerson (obj) {
// 	// When you assign a new value to an argument, you're not updating the original
// 	// obj = {
// 	// 	name: 'Charlie',
// 	// 	age: 24
// 	// };

// 	// When you call something on the original, you are updating the original
// 	obj.age = 24;
// }

// updatePerson(person);
// console.log(person);

// Array Example

var grades = [15, 37];

function addGrade (gradesArr) {
	// Does not modify the original array
	gradesArr = [12, 33, 98];
	debugger;

	// Modifies original grades array
	// grades.push(55);
}

addGrade(grades);
console.log(grades);