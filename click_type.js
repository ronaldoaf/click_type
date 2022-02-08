var robot = require("robotjs");

var express = require('express');

const app=express();

robot.setMouseDelay(2);

app.get('/click', (req, res)=>{
	const mouse=robot.getMousePos();
	const {x,y}=req.query;
	robot.moveMouse(Number(x), Number(y) );
	robot.mouseClick();
	robot.moveMouse(mouse.x, mouse.y );
	
	res.send(`console.log("x:${x} y:${y}")`);
});	


app.get('/move', (req, res)=>{
	const {x,y}=req.query;
	robot.moveMouse(Number(x), Number(y) );
	//robot.mouseClick();
	res.send(`console.log("x:${x} y:${y}")`);
});	



app.get('/type', (req, res)=>{
	const {string}=req.query;
	robot.typeString(string);
	res.send(`console.log("string:${string}")`);
});	

app.listen(1313);

console.log("   _____ _ _      _      _______               ");
console.log("  / ____| (_)    | |    |__   __|              ");
console.log(" | |    | |_  ___| | __    | |_   _ _ __   ___ ");
console.log(" | |    | | |/ __| |/ /    | | | | | '_ \\ / _ \\");
console.log(" | |____| | | (__|   <     | | |_| | |_) |  __/");
console.log("  \\_____|_|_|\\___|_|\\_\\    |_|\\__, | .__/ \\___|");
console.log("                               __/ | |         ");
console.log("                              |___/|_|         ");


console.log("\n\n\n");
console.log("Use:  http://localhost:1313/click?x=100&y=150");
console.log("Use:  http://localhost:1313/move?x=100&y=150");
console.log("Use:  http://localhost:1313/type?sting=texto");
