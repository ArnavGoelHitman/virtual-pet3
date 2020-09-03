//Create variables here
var dog,happyDog,foodS=21,foodStock,database,dogImage,happyDogImage,food=0;
var feed,addFood;
var fedTime,lastFed;
var foodObj;
var bedroom,garden,washroom;
var gameState = 0;
var readState;
function preload()
{
  //load images here
  dogImage = loadImage("images/dogImg.png");
  happyDogImage = loadImage("images/dogImg1.png");
  bedroom = loadImage("images/Bed room.png");
  garden = loadImage("images/Garden.png");
  washRoom = loadImage("images/Wash Room.png");
}

function setup() {
  createCanvas(500, 500);
  dog = createSprite(400,250,20,20);
  dog.addImage(dogImage);
  dog.scale=0.20;
  database = firebase.database();
  foodStock = database.ref('Food');
  foodStock.on("value",readStock,writeStock);
foodObj = new Food();


  feed = createButton("Feed The Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
  fedTime = database.ref('feedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();

  }) ;
  
}


function draw() {  
  background(46,139,87);
 

  drawSprites();
 
  
  //add styles here
 foodObj.display();
  
  fill(255,255,254);
  textSize(15);
  if (lastFed>=12) {
    text("Last Feed"+lastFed%12+"PM",350,30);
    
  }else if (lastFed==0) {
    text("Last Feed : AM",350,30);


  }else {
    text("Last Feed : " +lastFed+"AM",350,30);

  }

  if (gameState!="Hungry") {
    feed.hide();
    addFood.hide();
    dog.visible = false;
  }else{
    feed.show();
    addFood.show();
    dog.addImage(dogImage);
   dog.visible = true;

  }
  currentTime=hour();

  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
   

  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
    

  }else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();

  }else{
    update("Hungry");
    foodObj.display();
    
  }
 
 



}
function readStock(data){
  foodS = data.val();
  
  
  foodObj.updateFoodStock(foodS);

  
}
function writeStock(x){
  if (x<=0) {
    x=0;
  }else{
    x=x-1;

  }
  database.ref('/').update({
    Food:x
  })
}
function addFoods() {
  foodS++
  database.ref('/').update({
    Food:foodS
  })
  
}
function feedDog(){
  dog.addImage(happyDogImage);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1)
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    feedTime:hour()
  })
}

function update(state){
  database.ref('/').update({
  gameState:state
  })

}





