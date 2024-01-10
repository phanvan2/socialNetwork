import TfIdf from "node-tfidf";
import fs from "fs";
import tf from "@tensorflow/tfjs-node";
import "@tensorflow/tfjs-node";

import postModel from "../models/PostModel";
import UserModel from "../models/UserModel";
import ViewedModel from "../models/ViewedModel";

let trainModel = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // const dataset = JSON.parse(fs.readFileSync('fake_dataset.json', 'utf-8'));
            // console.log(dataset) ;
            // // Chuẩn bị dữ liệu đầu vào và đầu ra
            let dataset = await postModel.getPostAll();
            const idPost = []; // Tiêu đề bài viết dự đoán
            const inputTitles = []; // Tiêu đề bài viết
            dataset.forEach((value) => {
                idPost.push(value._id);
                inputTitles.push(value.title.toLowerCase());
            });

            const tfidf = new TfIdf();

            inputTitles.forEach((value) => {
                tfidf.addDocument(value.split(" "));
            });
            var s = JSON.stringify(tfidf);
            fs.writeFileSync("model.json", s);

            resolve(true);
        } catch (err) {
            reject(err);
        }
    });
};

let trainModelCollaborative = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // const dataset = JSON.parse(fs.readFileSync('fake_dataset.json', 'utf-8'));
            // console.log(dataset) ;
            // // Chuẩn bị dữ liệu đầu vào và đầu ra
            let listUser = await UserModel.getUserAll();

            let listUser1 = listUser.map(async (user) => {
                let viewed = await ViewedModel.getViewedByUser(user._id);
                let arr1 = [];
                viewed.map((view) => {
                    if (arr1.length < 6) arr1.push(view.postId);
                });
                return {
                    _id: user._id,
                    city: user.country,
                    workat: user.workAt,
                    gender: user.gender,
                    relationship: user.relationship,
                    viewed: arr1,
                };
            });
            let result = await Promise.all(listUser1);

            let idUser = [];
            let citydata = [];
            let workAt = [];
            let gender = [];
            let relationship = [];

            let idPost = [];

            let inputdata = [];
            let outputdata = [];
            result.forEach((value, index) => {
                if (value.city) {
                    if (citydata.indexOf(value.city) < 0)
                        citydata.push(value.city);
                }
                if (value.workat) {
                    if (workAt.indexOf(value.workat) < 0)
                        workAt.push(value.workat);
                }
                if (value.gender) {
                    if (gender.indexOf(value.gender) < 0)
                        gender.push(value.gender);
                }
                if (value.relationship) {
                    if (relationship.indexOf(value.relationship) < 0)
                        relationship.push(value.relationship);
                }

                let view_tempt = [];
                for (let index = 0; index < 5; index++) {
                    if (value.viewed[index])
                        if (idPost.indexOf(value.viewed[index]) < 0)
                            idPost.push(value.viewed[index]);

                    view_tempt.push(idPost.indexOf(value.viewed[index]));
                }

                inputdata.push([
                    citydata.indexOf(value.city),
                    workAt.indexOf(value.workat),
                    gender.indexOf(value.gender),
                    relationship.indexOf(value.relationship),
                ]);
                outputdata.push(view_tempt);
            });
            console.log(inputdata);
            var s = JSON.stringify({
                idPost: idPost,
                citydata: citydata,
                workAt: workAt,
                gender: gender,
                relationship: relationship,
            });
            fs.writeFileSync("data1.json", s);

            const startTime = new Date().getTime();
            const input = tf.tensor2d(inputdata);
            const output = tf.tensor2d(outputdata);
            // Tạo mô hình
            const model = tf.sequential({
                layers: [
                    tf.layers.dense({
                        inputShape: [4],
                        units: 128,
                        activation: "relu",
                    }),
                    tf.layers.dropout({ rate: 0.2 }), // Thêm layer dropout
                    tf.layers.dense({ units: 64, activation: "relu" }),
                    tf.layers.dropout({ rate: 0.2 }), // Thêm layer dropout
                    tf.layers.dense({ units: 32, activation: "relu" }),
                    tf.layers.dense({ units: 5, activation: "linear" }),
                ],
            });
            // Compile mô hình
            model.compile({
                optimizer: tf.train.adam(0.01),
                loss: "meanSquaredError",
                metrics: ["accuracy"],
            });

            model
                .fit(input, output, {
                    epochs: 5000,
                    batchSize: 32,
                    validationSplit: 0.2,
                    callbacks: [
                        {
                            onEpochEnd: (epoch, logs) => {
                                if (logs.acc == 1 && epoch > 100) {
                                    // Đặt ngưỡng dừng ở 0.1, bạn có thể điều chỉnh ngưỡng theo nhu cầu
                                    console.log(
                                        "Đạt ngưỡng validation loss, dừng đào tạo."
                                    );
                                    model.stopTraining = true;
                                }
                            },
                        },
                    ],
                })
                .then(() => {
                    model
                        .save("file:///D/socialNetwork/Server/src/my_model")
                        .then(() => {
                            console.log("Model saved successfully.");
                        })
                        .catch((error) => {
                            console.error("Error saving model:", error);
                        });
                    const newData = tf.tensor2d([inputdata[13]]);
                    // const testOutput = tf.tensor2d([outputdata[5]]);

                    const predictions1 = model.predict(newData);
                    predictions1.print();
                    // const mse = tf.metrics
                    //   .meanSquaredError(testOutput, predictions1)
                    //   .dataSync()[0];
                    // console.log(`Mean Squared Error: ${mse}`);
                    // console.log(outputdata[5]);
                    // const endTime = new Date().getTime();
                    // const trainingTimeInSeconds = (endTime - startTime) / 1000;
                    // console.log("Thời gian đào tạo:", trainingTimeInSeconds, "giây");
                    // model.summary();
                });

            resolve(outputdata);
        } catch (err) {
            reject(err);
        }
    });
};

let prediction = (viewed_data) => {
    new Promise(async (resolve, reject) => {
        const aaa = fs.readFileSync("model.json", "utf-8");
        console.log(aaa);
        var tfidf = new TfIdf(JSON.parse(aaa));

        let dataset = await postModel.getPostAll();

        // let viewed_data = [
        //   [ 'product', 'creative', 'architect' ],
        //   [ 'legacy', 'creative', 'designer' ],
        //   // ["product", "metrics", "Orchestrator"]
        //               ]

        let trainData1 = [];
        let data_ = [];
        viewed_data.forEach((value) => {
            tfidf.tfidfs(value, function (i, measure) {
                console.log("document #" + dataset[i] + " is " + measure);
                if (measure > 0) {
                    console.log(dataset[i].title);
                    console.log(data_.indexOf(dataset[i].title));
                    if (data_.indexOf(dataset[i].title) < 0) {
                        let dataa = {
                            ...dataset[i],
                            similarities: measure,
                        };

                        trainData1.push(dataa);
                    }
                }
            });
        });
        console.log(trainData1);
        return resolve(trainData1);
    });
};

export default { trainModel, prediction, trainModelCollaborative };
