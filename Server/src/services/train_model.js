import TfIdf from "node-tfidf";
import fs from "fs";
import tf from "@tensorflow/tfjs-node";
import "@tensorflow/tfjs-node";

import postModel from "../models/PostModel";
import UserModel from "../models/UserModel";
import ViewedModel from "../models/ViewedModel";
import LikeModel from "../models/LikeModel";

let trainModel = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataset = await postModel.getPostAll();
            const idPost = [];
            const inputTitles = [];
            dataset.forEach((value) => {
                idPost.push(value._id);
                inputTitles.push(
                    value.title
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                );
            });
            console.log(inputTitles);
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

let preparedata = async () => {
    let listUser = await UserModel.getUserAll();
    let dataset = await postModel.getPostAll();

    const aaa = fs.readFileSync("model.json", "utf-8");
    const tfidf = new TfIdf(JSON.parse(aaa));

    let listUser1 = listUser.map(async (user) => {
        // let viewed = await ViewedModel.getViewedByUser(user._id);
        let liked = await LikeModel.getLikeByUser(user._id);
        let arr1 = [];
        await Promise.all(
            liked.map(async (view) => {
                if (arr1.length < 20) {
                    await postModel
                        .getPostbyIdPost(view.postId)
                        .then((value) => {
                            console.log("-----------------------------------");
                            if (value) {
                                tfidf.tfidfs(
                                    value.title
                                        .toLowerCase()
                                        .normalize("NFD")
                                        .replace(/[\u0300-\u036f]/g, "")
                                        .split(" "),
                                    function (i, measure) {
                                        if (measure > 0) {
                                            arr1.push(dataset[i]._id);
                                        }
                                    }
                                );
                            }
                        });
                }
            })
        );

        return {
            _id: user._id,
            city: user.country,
            workat: user.workAt,
            gender: user.gender,
            relationship: user.relationship,
            viewed: arr1,
        };
    });
    return await Promise.all(listUser1);
};

let trainModelCollaborative = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await trainModel();
            preparedata().then((result) => {
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
                    for (let index = 0; index < 20; index++) {
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
                // console.log(outputdata);
                var s = JSON.stringify({
                    idPost: idPost,
                    citydata: citydata,
                    workAt: workAt,
                    gender: gender,
                    relationship: relationship,
                });
                // fs.writeFileSync("data1.json", s);

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
                        tf.layers.dense({ units: 20, activation: "linear" }),
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
                                    if (logs.acc == 1 && epoch > 200) {
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
                        const endTime = new Date().getTime();
                        const trainingTimeInSeconds =
                            (endTime - startTime) / 1000;
                        console.log(
                            "Thời gian đào tạo:",
                            trainingTimeInSeconds,
                            "giây"
                        );
                        // model.summary();
                    });

                resolve(outputdata);
            });
        } catch (err) {
            reject(err);
        }
    });
};

let prediction = (title_s) => {
    new Promise(async (resolve, reject) => {
        const aaa = fs.readFileSync("model.json", "utf-8");
        const tfidf = new TfIdf(JSON.parse(aaa));

        let dataset = await postModel.getPostAll();
        console.log("dataset=================================");

        console.log(dataset);
        let trainData1 = [];
        let data_ = [];
        tfidf.tfidfs(title_s, function (i, measure) {
            if (measure > 0) {
                let dataa = {
                    ...dataset[i],
                    // similarities: measure,
                };

                trainData1.push(dataa);
            }
        });
        return resolve(trainData1);
    });
};

export default { trainModel, prediction, trainModelCollaborative };
