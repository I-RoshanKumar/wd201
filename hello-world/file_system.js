const fs = require("fs");

//Crating a file
fs.writeFile(
    "sample.txt",
    "Hello World. Welcome to Node.js File System module.",
    (err) => {
      if (err) throw err;
      console.log("File created!");
    }
  );

  //Reading the created file
fs.readFile("sample.txt", (err, data) => {
    if (err) throw err;
    console.log(data.toString());
  });

  //Appending the content

  fs.appendFile("sample.txt", " This is my updated content", (err) => {
    if (err) throw err;
    console.log("File updated!");
  });

  //Rename the file
  fs.rename("sample.txt", "test.txt", (err) => {
    if (err) throw err;
    console.log("File name updated!");
  });

  //Delete file
  fs.unlink("test.txt", (err) => {
    if (err) throw err;
    console.log("File test.txt deleted successfully!");
  });