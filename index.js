const Discord = require("discord.js")
const client = new Discord.Client()

const prefix = "--"
const height = 10;
const length = 10;

const setPath = () =>{
    var m = 0;
    var n = 0;
    var temp = 0;
    var u = 0;
    var path = new Array(8);
    for (var i = 0; i < path.length; i++) {
      path[i] = new Array(8);
    }
    for (var i = 0; i < path.length; i++) {
      for (var j = 0; j < path[0].length; j++) {
        path[i][j] = 0;
      }
    }
    path[0][0]=1;
    while (n != path.length-1)
    {
        const pathdir = Math.floor(Math.random()*3);
        if (pathdir == 0) //right
          {
            n++;
            path[m][n] = 1;
            if(u==0)
              u++;
            else
              temp=0;  
          }
        if (pathdir == 1 && m < path.length-1 && temp != 2) //down
        {
            m++;
            path[m][n] = 1;
            temp = 1;
            u=0;
        }
        if (pathdir == 2 && m > 0 && temp != 1) //up
        {
            m--;
            path[m][n] = 1;
            temp = 2;
            u=0;
        }
    }
    return path;
}

const getInitialString = () => {
  var initialString = '';
  for(var i = 0;i<height;i++){
    for(var j = 0;j<length;j++){
      if(i==0||i==height-1||j===0 || j===length-1)
        initialString += '🟦'
      else if(playerX==j&&playerY==i)
        initialString+='🟥'
      else  
        initialString += '⬛'
    }
    initialString+='\n' 
  }
  return initialString
}

const editMap = (move) =>{
   if(move=='⬅️'){
     playerX--;
   }
   if(move=='⬇️'){
     playerY++;
   }
   if(move=='➡️'){
     playerX++;
   }
   if(move=='⬆️'){
     playerY--;
   }
  if(playerX == 9)
   return "winner winner chiken ka dinner"
  var initialString = '';
  if(path[playerY-1][playerX-1]==0){
    playerY=1;playerX=1;
  }
  for(var i = 0;i<height;i++){
    for(var j = 0;j<length;j++){
      if(i==0||i==height-1||j===0 || j===length-1)
        initialString += '🟦'
      else if(playerX==j&&playerY==i)
        initialString+='🟥'
      else  
        initialString += '⬛'
    }
    initialString+='\n' 
  }
  return initialString
}


client.on("ready",() => {
  console.log(`Logged in as 
  ${client.user.tag}!`)
})

client.on("message" ,async msg => {
    if(msg.content == prefix + "test"){
      msg.delete();
      msg.channel.send("hello")
      .then(async msg => {
        try{
          await msg.react('⬅️')
          await msg.react('⬇️')
          await msg.react('➡️')
          await msg.react('⬆️')
        }
        catch{
          (err) => console.log(err)
        }
        const filter = (reaction,user) => 
          {return ['⬅️','⬇️','➡️','⬆️'].includes(reaction.emoji.name)}
        
        const collector = msg.createReactionCollector(filter, {idle: 15000 });
        collector.on("collect",async react => {
          await react.message.edit(react.emoji.name)
          await react.users.remove(react.users.cache.last().id);
        });
        collector.on('end',() => {msg.delete()});
      })
      .catch((err)=>console.log(err))
    }
    
    else if(msg.content === prefix + 'start'){
      var playerX = 1;
      var playerY = 1;
      var path;
      msg.delete();
      path = setPath();
      console.log(path);
      const startMap = getInitialString();
      msg.channel.send(startMap)
        .then(async msg => {
        try{
          await msg.react('⬅️')
          await msg.react('⬇️')
          await msg.react('➡️')
          await msg.react('⬆️')
        }
        catch{
          (err) => console.log(err)
        }
        const filter = (reaction,user) => 
          {return ['⬅️','⬇️','➡️','⬆️'].includes(reaction.emoji.name)}
        
        const collector = msg.createReactionCollector(filter, {idle: 15000 });
        collector.on("collect",async react => {
          await react.message.edit(editMap(react.emoji.name))
          console.log(react.message)
          await react.users.remove(react.users.cache.last().id);
        });
        collector.on("end",()=>{collector.message.reactions.removeAll()})
      })
        .catch((err)=>console.log(err));

    }

    else{
      console.log("no")
    }

})

client.login(process.env.TOKEN)