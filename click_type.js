const { keyboard, mouse, Point } = require("@nut-tree/nut-js");

const express = require('express');

const express = require('express');
const cors=require('cors');
const app=express();
app.use(cors())

const WindMouse = require("windmouse");
const jStat =require('jstat');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


mouse.config.mouseSpeed=200
keyboard.config.autoDelayMs=100;


const randomNormal=(x_min, x_max)=>{
   //const [x_min,x_max]=[0,200];
   const media=(x_min+x_max)/2;
   const desv=(media-x_min)/2;

   const a=jStat.normal.cdf( x_min, media, desv );
   const b=jStat.normal.cdf( x_max, media, desv );

   const p=a+Math.random()*(b-a);
   return Math.round(jStat.normal.inv( p, media, desv ));
}

/*
const mouseMove=async(X, Y)=>{
   // Initialize WindMouse class
   const windMouse = new WindMouse(Math.floor(Math.random()*10) );
   
   const {x,y}=await mouse.getPosition();
   
   // MouseSettings
   const  settings = {
     startX: x, startY: y,
     endX: X,   endY: Y,
     
     gravity: 10+Math.ceil(Math.random()*5),
     wind: 20+Math.ceil(Math.random()*10),
     //minWait: 1,
    // maxWait: 1,
     maxStep: 2+Math.ceil(Math.random()*2),
     targetArea: 10+Math.ceil(Math.random()*20),
   } 
   
   const points=(await windMouse.GeneratePoints(settings)).map(p=>new Point(p[0],p[1]) );
   points.push( new Point(X+1,Y+1) );
   await mouse.move( points);
}
*/

const mouseMove=async(X, Y)=>{
   await mouse.move( [new Point(X,Y)] );
}


app.get('/click_area', async(req, res)=>{
	const {x1,x2,y1,y2}=req.query;
   const X=randomNormal(Number(x1), Number(x2));
   const Y=randomNormal(Number(y1), Number(y2));

   await mouseMove(X, Y);
   await sleep(1000);

   await mouse.leftClick();

   console.log([x1,x2,y1,y2]);
	res.send(`console.log("x:${X} y:${Y}")`);
});	


app.get('/scroll', async(req, res)=>{
	const {y}=req.query;

   await mouse.scrollDown(Number(y));

	res.send(`console.log("y:${y}")`);
});	



app.get('/click', async(req, res)=>{
	const ponto_incial=await mouse.getPosition();
	const {x,y}=req.query;
	const ponto_final=new Point(Number(x),Number(y));
   await mouse.setPosition(ponto_final);

   await mouse.leftClick();
   await mouse.setPosition(ponto_incial);

	res.send(`console.log("x:${x} y:${y}")`);
});	


app.get('/move', async(req, res)=>{
	const {x,y}=req.query;

   await mouseMove(Number(x),Number(y));
   /*
	const ponto_final=new Point(Number(x),Number(y));
   await mouse.setPosition(ponto_final);
   */
	res.send(`console.log("x:${x} y:${y}")`);
});	



app.get('/type', async(req, res)=>{
	const {str}=req.query;
   await keyboard.type(str);
   console.log(str);
	res.send(`console.log("str:${str}")`);
});	


let token_state='free';

app.get('/token/state', async(req, res)=>{
   res.send(`localStorage.token_state='${token_state}';`);
});	

app.get('/token/hold', async(req, res)=>{
   token_state='hold';
   setTimeout(()=> token_state='free', 30*1000);
   res.send(`localStorage.token_state='${token_state}';`);
});	
app.get('/token/free', async(req, res)=>{
   token_state='free';
   res.send(`localStorage.token_state='${token_state}';`);
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
console.log("Use:  http://localhost:1313/type?str=texto");
console.log("Use:  http://localhost:1313/click_area?x1=10&y1=10&x2=50&y2=50");
console.log("Use:  http://localhost:1313/token/state");
console.log("Use:  http://localhost:1313/token/hold");
console.log("Use:  http://localhost:1313/token/free");
