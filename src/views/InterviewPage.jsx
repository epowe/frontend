import React, { useEffect, useRef, useState } from 'react'
import { useBeforeunload } from 'react-beforeunload';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from "styled-components";
import Header from './Header';
import { beginRecord, download, playStream, stopPlaying } from "./Record";
import { API } from "../API";

const InterviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const title = location.state.title;
  const questions = location.state.questions;
  const [isNext, setIsNext] = useState(true);
  const [current, setCurrent] = useState(0);
  const [data, setData] = useState([]);
  const [recorder, setRecorder] = useState(undefined);
  const videoRef = useRef(null);
  const [recorded, setRecorded] = useState(false);
  const [done, setDone] = useState(false);
  
  useBeforeunload((event) => event.preventDefault());

  const beginOrStopRecording = async () => {
    try {
      if (!recorder) {
        const mediaRecorder = await beginRecord(
          (stream) =>
            playStream(videoRef.current, stream),
          (recordedBlobs) => setData(recordedBlobs),
        );
        setRecorder(mediaRecorder);
      } else {
        recorder.stop();
        stopPlaying(videoRef.current);
        setRecorder(undefined);
        setRecorded(true);
        setDone(true);
      }
    } catch (err) {
      if (err.toString().includes("Permission denied")) {
        notify("카메라와 마이크 엑세스를 허용해주세요");
      }
      console.error(err);
    }
  };

  useEffect(() => {
    if (questions.length === 1) {
      setIsNext(false);
    }
    // startRecording();
  }, []);

  const notify = (msg) =>
    toast(msg, {
      duration: 2500,
      style: {
        borderRadius: "50px",
      },
    });

  const handleNext = async () => {
    setCurrent(current + 1);
    setRecorded(false);
    setDone(false);

    // 녹화된 영상 다운로드
    try {
      console.log(`질문${current + 1}: ${questions.at(current).question}`);
      download(data); // 콘솔에 녹화된 영상 blob 뜸
    } catch (err) {
      console.error(err);
    }

    if (isNext) {
      if (current < questions.length - 2) {
        setIsNext(true);
      } else {
        setIsNext(false);
      }
    } else {
      //questions에서 값만 꺼내서 배열로 저장하는 부분 (서버로 보내기 위함)
      let sendQuestionData = [];
      sendQuestionData.push(questions.map((a) => a.question));
      //비디오 url 서버로 보내기 위해 저장하는 예시 (추후에 S3로 저장후 바로 url 값 가져오게 만든 후 저장해서 서버로 보낼예정)
      let videoURL1 = [];
      videoURL1.push("google.com");
      // 면접 정보 서버로 보내는 부분
      // sendUserInterviewInfo({
      //   title: title,
      //   question: sendQuestionData,
      //   videoURL: videoURL1,
      // });
      navigate("/interview/feedback", {state: {title}});
    }

    //서버로 제목, 동영상 URL, title 보내는 함수
    const sendUserInterviewInfo = async ({ title, question, videoURL }) => {
      var result = await API.sendUserInterviewInfo({
        title: title,
        question: question,
        videoURL: videoURL,
      });
      if (result) {
        console.log("flask에 유저의 면접 정보 보내기 완료");
      } else {
        console.log("flask에 유저의 면접 정보 보내기 실패");
        console.log(result);
      }
    };
  };

  return (
  <>
    <Header />
    <BodyContainer>
      <Container>
        <Question>
          질문{current + 1} {questions.at(current).question}
        </Question>
        <Video>
          <div>
            <video
              ref={videoRef}
              autoPlay
              style={{
                width: "100%",
                height: "100%",
              }}
              muted
            />
          </div>
        </Video>
        <Button
          id="record"
          onClick={beginOrStopRecording}
          disabled={done}
        >
          {recorder ? '답변 그만하기' : '답변 시작하기'}
        </Button>
        <Button
          disabled={!recorded}
          onClick={handleNext}
        >
          {isNext ? "다음" : "면접 끝내기"}
        </Button>
      </Container>
    </BodyContainer>
  </>
  );
};

const BodyContainer = styled.div`
  position: fixed;
  top: 5rem;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 80vh;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  overflow-y: auto;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 30rem;
  width: 30%;
  height: 90%;
`;

const Question = styled.div`
  width: 600px;
  font-family: SCDream-Regular;
  font-size: 1.2rem;
  text-align: start;
  padding: 2rem;
`;

const Button = styled.button`
  box-sizing: border-box;
  position: sticky;
  top: 100%;
  background: #6c63ff;
  color: white;
  width: 90%;
  padding: 0.8rem;
  margin-top: 1rem;
  border: none;
  border-radius: 50px;
  font-family: SCDream-Regular;
  font-size: 1rem;
  cursor: pointer;
  text-align: center;
  &:hover {
    background: #5850e6;
    transition: 0.3s;
  }
  &:disabled {
    display: none;
  }
`;

const Video = styled.div`
  min-height: 360px;
  width: 640px;
`;

export default InterviewPage