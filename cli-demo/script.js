const minimist = require('minimist');
const args = minimist(process.argv.slice(2), {
    default: { //Now, if you don’t pass --num1, it will automatically be set to 1.
      num1: 1
    }
  });
// This is used if anyone wants to use n1 instead of num1

//   const args = minimist(process.argv.slice(2), {
//     alias: {
//       num1: 'n1',
//       num2: 'n2'
//     }
//   });
  
  console.log(`Num1 is: ${args.num1}`);

// Now we can access our arguments by name
const num1 = parseInt(args.num1);
const num2 = parseInt(args.num2);
const operation = args.operation;

if (operation === 'add') {
  console.log(`The result is: ${num1 + num2}`);
} else if (operation === 'subtract') {
  console.log(`The result is: ${num1 - num2}`);
} else if (operation === 'multiply') {
  console.log(`The result is: ${num1 * num2}`);
} else {
  console.log('Unknown operation');
}