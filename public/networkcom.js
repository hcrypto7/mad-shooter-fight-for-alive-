
let socket = io('https://mad-shooter-fight-for-alive.vercel.app');
socket.on('connect', () => {
  console.log('connected!');
});

socket.on('server_status', (data) => {
  enermies = [];
  bullets = [];
  itemlist = [];
  shooters = data.shooters;
  for(let shooter of data.shooters){
    if(myip == shooter.ip){
      if(myinfo === undefined) myinfo = shooter;
      if(myinfo.level != shooter.level){
         aniText.text = "🏅Level up!🏅";
      }
      else if (myinfo.damage != shooter.damage) {
        aniText.text = "Item🪓:Damage UP!🪓";
      }
      else if (myinfo.shootSpeed != shooter.shootSpeed) {
        aniText.text = "Item👟:ShootSpeed UP!👟";
      }
      else if (myinfo.shootBranch != shooter.shootBranch) {
        aniText.text = "Item 🎭:shootBranch UP!🎭";
      }
      else if (myinfo.bulletSpeed != shooter.bulletSpeed) {
        aniText.text = "Item 🚀:ShootRange UP!🚀";
      }
      else if (shooter.heart - myinfo.heart > 90 ) {
        aniText.text = "Item 💖:Heart UP!💖";
      }
      else if (shooter.heart - myinfo.heart > 10 ) {
        aniText.text = "Defeat!!!😍:Heart UP!💖";
      }
      myinfo = shooter;
      myGamePiece.heart = shooter.heart;
    }else{
        let enermy = new component(37, 37, shooter.color, shooter.x, shooter.y, shooter.angle, shooter.heart, shooter.name)
        enermies.push(enermy);
    }
  }
  for(let bulletiter of data.bullets){
    let newBullet = new bullet(bulletiter.width, bulletiter.height, bulletiter.color, bulletiter.x, bulletiter.y, bulletiter.angle);
    bullets.push(newBullet);
  }
  for(let itemIter of data.items){
    let newItem = new upItem(itemIter.x, itemIter.y, itemIter.type, itemIter.r);
    itemlist.push(newItem);
  }

});

socket.on('died', ()=>{
  aniText.text = "😫Defeated!!!🤐";

  alert('you died!');
});

socket.on('disconnect', () => {
  alert("connection problem! reconnect to Server");
  console.log('disconnect');
});

const sendName = (name, color) => {
  socket.emit('sendName', {name:name, color:color});
} 

const curStatus = () => {
  socket.emit('client_status', 
  {
    shooter:
      {
        name:username,
        x:myGamePiece.x + myGameArea.areaPos.x,
        y:myGamePiece.y + myGameArea.areaPos.y,
        angle:myGamePiece.angle,
        ip:myip
      }, 
      name:username
  });
}

socket.on('initial', (data) => {
  myip = data.myip;
  const {shooter} = data;
  myinfo = shooter;
  myGameArea.areaPos.x = 0;
  myGameArea.areaPos.y = 0;
  if(shooter.x > myGameArea.canvas.width/2 && shooter.x < 4000 - myGameArea.canvas.width / 2)
    myGameArea.areaPos.x = shooter.x - myGameArea.canvas.width/2;
  else if(shooter.x > 4000 - myGameArea.canvas.width / 2)
    myGameArea.areaPos.x = shooter.x - myGameArea.canvas.width;
  
  if(shooter.y > myGameArea.canvas.height/2 && shooter.y < 4000 - myGameArea.canvas.height / 2)  
    myGameArea.areaPos.y = shooter.y - myGameArea.canvas.height/2;
  else if(shooter.y > 4000 - myGameArea.canvas.height / 2 )
    myGameArea.areaPos.y = shooter.y - myGameArea.canvas.height;
  myGamePiece = new component(37, 37, shooter.color , shooter.x , shooter.y, shooter.angle, shooter.heart, shooter.name);
  aniText = new textAnimation("");
});