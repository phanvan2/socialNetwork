import TfIdf from 'node-tfidf';
import fs from 'fs';

import postModel from "../models/PostModel"; 

let trainModel = () => {
  return new Promise(async (resolve, reject) => {
    try{
       // const dataset = JSON.parse(fs.readFileSync('fake_dataset.json', 'utf-8'));
      // console.log(dataset) ; 
      // // Chuẩn bị dữ liệu đầu vào và đầu ra
      let dataset = await postModel.getPostAll();
      const idPost = []; // Tiêu đề bài viết dự đoán
      const inputTitles = []; // Tiêu đề bài viết
      dataset.forEach((value) => {
      idPost.push(value._id) ; 
      inputTitles.push(value.title.toLowerCase()) ; 
      })
      console.log(inputTitles[0].split(" ")) ; 

      const tfidf = new TfIdf();

      inputTitles.forEach((value) => {
          tfidf.addDocument(value);
      })
      var s = JSON.stringify(tfidf);
      fs.writeFileSync('model.json', s);

      resolve(true) ;
      }catch(err){
          reject(err); 
      }

}) 
    
}

let prediction = (viewed_data)=> {
  new Promise(async (resolve, reject) => {
    const aaa = (fs.readFileSync('model.json', 'utf-8'));
    console.log(aaa)
    var tfidf = new TfIdf(JSON.parse(aaa));
  
    let dataset = await postModel.getPostAll();
  
  
    // let viewed_data = [
    //   [ 'product', 'creative', 'architect' ],
    //   [ 'legacy', 'creative', 'designer' ],
    //   // ["product", "metrics", "Orchestrator"]
    //               ]
  
    let trainData1 = [];
    let data_  = [] ; 
    viewed_data.forEach((value) => {
      tfidf.tfidfs(value, function(i, measure) {
        console.log('document #' + dataset[i] + ' is ' + measure);
        if(measure > 0){
          console.log(dataset[i].title);
          console.log(data_.indexOf(dataset[i].title))
          if(data_.indexOf(dataset[i].title) < 0){
            let dataa = {
              ...dataset[i],
              similarities: measure
            }
      
            trainData1.push(dataa); 
          }
         
        }
      });
    })
    console.log(trainData1)
    return resolve(trainData1) ; 
  })
   
}

export default {trainModel, prediction} ;
