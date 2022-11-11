const express = require('express');
const zip = require('express-zip');
const axios = require("axios")
const request = require('superagent') 
const app = express();

//const baseURL = "https://api.fricon.fun"
const baseURL = "https://apifriconfun.kardespro.repl.co"

app.get('/', (req, res) => {
  res.json({status: 200 , message: "Cache Server Running ", "stats": { "javaVer": "2.3.1", "java-expressVer": "0", "negodb-javaVer": "_v00.1"}})
});

app.get("/storage/ziptest", (req,res) => {
  let q = req.query.q;
  res.zip([
    { path: 'trust.txt', name: 'trustv4.txt' },
    { path: q, name: 'file2.png' }
  ]);
})


app.get("/storage/zip", (req,res) => {
  let files = req.query.files;
  files.map(a => {
  res.zip([
    { path: a.emoji_url, name: a.emoji_name }
  ]);
      });
})
app.get("/storage/emojis/download", async(req,res) => {
  let url = req.query.id
  if(!url) return res.json({status:404, message: "Parameter Invalid"})
  let d = await axios.get(`https://discordapp.com/api/v9/guilds/1026571370940874942/emojis/${url}`, {headers: { "Authorization": "Bot bottokenhere"}})
  if(d.data.animated === true){
     res.set( 'Content-Disposition', `attachment; filename=fricon_${url}.gif` ); request(`https://cdn.discordapp.com/emojis/${url}.gif`).pipe(res); 

  }
   res.set( 'Content-Disposition', `attachment; filename=fricon_${url}.png` ); request(`https://cdn.discordapp.com/emojis/${url}`).pipe(res); 

})

app.get("/storage/emojis/db/download", async(req,res) => {
  let id = req.query.id;
  if(!id) return res.json({status:404, message: "Parameter Invalid"})
  let d = await axios.get(`${baseURL}/api/v1/emoji?id=${id}`)
  if(d.data.avaliable === false) return res.json({status:404 , message: "Provided Emoji ID Not Found In Database"})
  res.download(d.data.emoji_url, "fricon_emoji.png")
})

app.listen(3000, () => {
  console.log('server started');
});
