


const express = require('express')
const path = require('path')
const hbs = require('hbs')
const request = require('request');

const app = express()
const port = process.env.PORT || 5001

app.set('view engine','hbs')
app.set('views',path.join(__dirname,'./views'))

app.get('',(req,res)=>{
    res.render('index',{
        title: 'Weather App',
        Name: 'Suryaprakash C'
    })
})
app.get('/share-video',(req,res)=>{
    if(!req.query.videoid){
        return res.send({
             error: 'Enter the address'
        })
    }
    else{
        console.log(req.query.videoid)
        var link = 'https://cofilink.com/api/ndisk-api/content/detail?item_id='+req.query.videoid+'uid=51081852&user_ip=1.0.0.1';
        const url = encodeURI(link);
        request({url,json:true},(error,{body}) => 
                    {
                        // console.log(url);
            console.log(body);
            if(body.data == ''){
                res.render('error')
            }
            else{
                        var hrs = Math.floor((body.data.attachments[0].duration/3600) % 24);
                        var mins = Math.floor((body.data.attachments[0].duration/60) % 60);
                        var secs = Math.floor((body.data.attachments[0].duration) % 60);
                        var size = formatFileSize(body.data.attachments[0].videos[0].file_size)
                        console.log(body.data.attachments[0].videos,":",body.data.attachments[0].videos[0].url)
                        //console.log(body.explanation);
                        res.render('video',{
                        content: link,
                        title: body.data.title,
                        hrs,mins,secs,size,
                        poster:body.data.attachments[0].cover,
                        url: body.data.attachments[0].videos[0].url+"?token=cbebfc7cdb998d5ec2ea124c02d4e0b7"
                    })
            }
         });
        
    }
})

function formatFileSize(bytes,decimalPoint) {
   if(bytes == 0) return '0 Bytes';
   var k = 1000,
       dm = decimalPoint || 2,
       sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
       i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

app.listen(port,()=>{
    console.log('Its running on '+ port)
})