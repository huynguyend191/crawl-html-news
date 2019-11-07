const express = require('express');
const axios = require('axios');
const jsdom = require('jsdom');
const fs = require('fs');
const { JSDOM } = jsdom;

const app = express();
app.get('/vn-express', async (req, res) => {
  const url = [];
  for (let page = 1; page < 31; page++) {
    await axios.get(`https://vnexpress.net/giai-tri/p${page}`)
    .then(result => {
      const htmlString = result.data;
      let window =  (new JSDOM(htmlString)).window;
      let articles =  window.document.getElementsByClassName('list_news');
      for(let i=0; i < articles.length; i++) {
        url.push(articles[i].getElementsByTagName('a')[0].href);
      }
    });
  }

  for (let j = 0; j < url.length; j++) {
    axios.get(url[j])
    .then(result => {
      const htmlString = result.data;
      let window = (new JSDOM(htmlString)).window;
      const title = window.document.getElementsByClassName('title_news_detail mb10')[0].textContent;
      const description = window.document.getElementsByClassName('description')[0].textContent;
      const content = window.document.getElementsByClassName('Normal')[0] ? window.document.getElementsByClassName('Normal')[0].textContent : '';
      const stream = fs.createWriteStream('Giai_tri.txt', { flags: 'a' });
      let data = 'Giai_tri, ' + '"' + title + ' ' + description + ' ' + content + '"';
      data = data.replace(/(\r\n|\n|\r)/gm,"");
      stream.write(data + '\n');
      stream.end();
    })
  }
  res.send('OK')
})

app.get('/gamek', async (req, res) => {
  const url = [];
  for (let pageNumber = 300; pageNumber < 310; pageNumber ++) {
    await axios.get(`http://gamek.vn/game-online/page-${pageNumber}.chn`)
    .then(result => {
      const htmlString = result.data;
      let window =  (new JSDOM(htmlString)).window;
      let articles =  window.document.getElementsByClassName('top');
      for(let i=0; i < articles.length; i++) {
        url.push('http://gamek.vn' + articles[i].getElementsByTagName('a')[0].href);
      }
    });
  }
  for (let urlNum = 0; urlNum < url.length; urlNum++) {
    await axios.get(url[urlNum])
    .then(result => {
      const htmlString = result.data;
      let window = (new JSDOM(htmlString)).window;
      const titleDiv = window.document.getElementsByClassName('topdetail');
      const title = titleDiv[0].getElementsByTagName('h1')[0].textContent + '. ';
      const contentDiv = window.document.getElementsByClassName('rightdetail_content')[0];
      const content = contentDiv.getElementsByTagName('p');
      let stringContent = '';
      for (let i = 0; i < content.length; i++) {
        stringContent += content[i].textContent + '';
      }
      const finalContent = title + stringContent;
      const stream = fs.createWriteStream('Giai_tri.txt', { flags: 'a' });
      let data = 'Giai_tri, ' + '"' + finalContent + '"';
      data = data.replace(/(\r\n|\n|\r)/gm,"");
      stream.write(data + '\n');
      stream.end();
    })
  }
  res.send('OK')
})

app.get('/khoahoctv', async (req, res) => {
  const url = [];
  for (let pageNumber = 80; pageNumber < 90; pageNumber ++) {
    await axios.get(`https://khoahoc.tv/?p=${pageNumber}`)
    .then(result => {
      const htmlString = result.data;
      let window =  (new JSDOM(htmlString)).window;
      let articles =  window.document.getElementsByClassName('listitem clearfix');
      for(let i=0; i < articles.length; i++) {
        url.push('https://khoahoc.tv' + articles[i].getElementsByTagName('a')[0].href);
      }
    });
  }
  for (let urlNum = 0; urlNum < url.length; urlNum++) {
    await axios.get(url[urlNum])
    .then(result => {
      const htmlString = result.data;
      let window = (new JSDOM(htmlString)).window;
      let title = window.document.getElementsByTagName('h1')[0].textContent;
      title = title.trim();
      title = title + '. ';
      const contentDiv = window.document.getElementsByClassName('content-detail')[0];
      const content = contentDiv.getElementsByTagName('p');
      let stringContent = '';
      for (let i = 0; i < content.length; i++) {
        stringContent += content[i].textContent + '';
      }
      const finalContent = title + stringContent;
      const stream = fs.createWriteStream('khoahoctv.txt', { flags: 'a' });
      let data = 'Khoa_hoc, ' + '"' + finalContent + '"';
      data = data.replace(/(\r\n|\n|\r)/gm,"");
      data = data.trim();
      stream.write(data + '\n');
      stream.end();
    })
  }
  res.send('OK')
})

app.get('/vietnamnet', async (req, res) => {
  const url = [];
  for (let pageNumber = 30; pageNumber < 40; pageNumber ++) {
    await axios.get(`https://vietnamnet.vn/vn/giao-duc/khoa-hoc/trang${pageNumber}`)
    .then(result => {
      const htmlString = result.data;
      let window =  (new JSDOM(htmlString)).window;
      let articles =  window.document.getElementsByClassName('clearfix item');
      for(let i=0; i < articles.length; i++) {
        url.push('https://vietnamnet.vn/vn' + articles[i].getElementsByTagName('a')[0].href);
      }
    });
  }
  console.log(url);
  for (let urlNum = 0; urlNum < url.length; urlNum++) {
    await axios.get(url[urlNum])
    .then(result => {
      const htmlString = result.data;
      let window = (new JSDOM(htmlString)).window;
      let title = window.document.getElementsByClassName('title f-22 c-3e')[0].textContent;
      title = title.trim();
      title = title + '. ';
      const contentDiv = window.document.getElementsByClassName('ArticleContent')[0];
      const content = contentDiv.getElementsByTagName('p');
      let stringContent = '';
      for (let i = 0; i < content.length; i++) {
        stringContent += content[i].textContent + '';
      }
      const finalContent = title + stringContent;
      const stream = fs.createWriteStream('vietnamnet.txt', { flags: 'a' });
      let data = 'Khoa_hoc, ' + '"' + finalContent + '"';
      data = data.replace(/(\r\n|\n|\r)/gm,"");
      data = data.trim();
      stream.write(data + '\n');
      stream.end();
    })
  }
  res.send('OK')
})


app.listen(3000);