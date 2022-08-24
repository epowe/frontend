import "./App.css";
import React, { useState } from "react";
import AWS from "aws-sdk";
import { Row, Col, Button, Input, Alert } from "reactstrap";

const S3Upload = () => {
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const ACCESS_KEY = process.env.REACT_APP_AWS_ACCESS_KEY;
  const SECRET_ACCESS_KEY = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
  const REGION = process.env.REACT_APP_AWS_REGION;
  const S3_BUCKET = process.env.REACT_APP_AWS_BUCKET;

  AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  });

  const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
  });

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    console.log(file);

    const fileExt = file.name.split(".").pop();
    if (file.type !== "video/webm" || fileExt !== "webm") {
      alert("Webm 확장자의 동영상 파일만 Upload 가능합니다.");
      return;
    }
    setProgress(0);
    setSelectedFile(e.target.files[0]);
  };

  const uploadFile = (file) => {
    let today = new Date();
    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1; // 월
    let date = today.getDate(); // 날짜
    let hours = today.getHours(); // 시
    let minutes = today.getMinutes(); // 분
    let seconds = today.getSeconds(); // 초
    let milliseconds = today.getMilliseconds(); // 밀리초
    let finalFileName =
      year +
      ":" +
      month +
      ":" +
      date +
      ":" +
      hours +
      ":" +
      minutes +
      ":" +
      seconds +
      ":" +
      milliseconds;

    const params = {
      ACL: "public-read",
      Body: file,
      Bucket: S3_BUCKET,
      Key: "upload/" + finalFileName,
    };

    myBucket
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100));
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setSelectedFile(null);
        }, 3000);
      })
      .send((err) => {
        if (err) console.log(err);
      });
  };

  return (
    <div className="App">
      <div className="App-header">
        <Row>
          <Col>
            <h1>File Upload</h1>
          </Col>
        </Row>
      </div>
      <div className="App-body">
        <Row>
          <Col>
            {showAlert ? (
              <Alert color="primary">업로드 진행률 : {progress}%</Alert>
            ) : (
              <Alert color="primary">파일을 선택해 주세요.</Alert>
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            <Input color="primary" type="file" onChange={handleFileInput} />
            {selectedFile ? (
              <Button color="primary" onClick={() => uploadFile(selectedFile)}>
                {" "}
                Upload to S3
              </Button>
            ) : null}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default S3Upload;
