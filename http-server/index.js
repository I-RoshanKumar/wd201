const http = require("http");
const fs = require("fs");
const minimist = require('minimist');
const { prototype } = require("events");
const args = minimist(process.argv.slice(1),{
  alias: {
    PORT: 'port',
}
});



let homeContent = "";
let projectContent = "";
let registrationcontent="";

const num1 = parseInt(args.num1);


fs.readFile("home.html", (err, home) => {
  if (err) {
    throw err;
  }
  homeContent = home;
});

fs.readFile("project.html", (err, project) => {
  if (err) {
    throw err;
  }
  projectContent = project;
});

fs.readFile("registration.html",(err,registration)=>{
  if(err){
    throw err;
  }
  registrationcontent=registration;
})
http
  .createServer((request, response) => {
    let url = request.url;
    response.writeHeader(200, { "Content-Type": "text/html" });
    switch (url) {
      case "/project":
        response.write(projectContent);
        response.end();
        break;
      case "/registration":
        response.write(registrationcontent);
        response.end();
        break;
      default:
        response.write(homeContent);
        response.end();
        break;
    }
  })
  .listen(args.PORT);
  console.log(`Server running on: ${args.PORT}`);