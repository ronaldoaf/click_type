const { keyboard, mouse, Point,Button, Key } = require("@nut-tree/nut-js");
const { path }  = require('ghost-cursor');

const express = require('express');
const cors=require('cors');
const app=express();
app.use(cors())

const jStat =require('jstat');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


mouse.config.mouseSpeed=100
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


const moveTo=async(X, Y)=>{
   const from = await mouse.getPosition();
   const to = { x: Number(X), y: Number(Y) }
   const route = path(from, to)
   await mouse.move( route.map(p=> new Point(p.x, p.y)) );
}

const click=async(X,Y)=>{
   await moveTo(X,Y);
   await sleep(200);
   await mouse.leftClick();
}



app.get('/ping', async(req, res)=>res.send('pong'));;


app.get('/click_area', async(req, res)=>{
	const {x1,x2,y1,y2}=req.query;
   const X=randomNormal(Number(x1), Number(x2));
   const Y=randomNormal(Number(y1), Number(y2));
   
   //await mouseMove(X, Y);
   await click(X,Y);
   
	res.send(`Click:${X},${Y}`);
});	


app.get('/scroll', async(req, res)=>{
	let {y}=req.query;
   y=Number(y);
   if(y>0) 
      await mouse.scrollDown(y);
   else
      await mouse.scrollUp(-y);
   
	res.send(`Scroll:${y}`);
});	



app.get('/click', async(req, res)=>{
	const {x,y}=req.query;
   await click(x,y);   
	res.send(`Click:${x},${y}`);
});	


app.get('/move', async(req, res)=>{
   const {x,y}=req.query;
   
   await moveTo(x,y);
   
   //console.log(route);
		res.send(`Move:${x},${y}`);
});	



app.get('/type', async(req, res)=>{
	const {str}=req.query;
   await keyboard.type(eval(str));
	res.send(`Type:${str}`);
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
console.log("Use:  http://localhost:1313/ping");

