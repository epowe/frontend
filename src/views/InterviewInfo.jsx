import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useBeforeunload } from "react-beforeunload";
import styled from "styled-components";
import Header from "./Header.js";

const Styles = {
  Video: { width: "100%", height: "100%" },
  None: { display: 'none' },
};

const getWebcam = (callback) => {
  try {
    const constraints = {
      audio: true,
      video: {
        width: { min: 1280 },
        height: { min: 720 }
      }
    };
    navigator.mediaDevices.getUserMedia(constraints)
      .then(callback);
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

const InterviewInfo = () => {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [isNext, setIsNext] = useState(true);
  const [current, setCurrent] = useState(0);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "",
    },
  ]);
  const videoRef = React.useRef(null);

  useBeforeunload((event) => event.preventDefault());

  const addInputField = () => {
    setQuestions([
      ...questions,
      {
        question: "",
      },
    ]);
  };

  const removeInputFields = (index) => {
    const rows = [...questions];
    rows.splice(index, 1);
    setQuestions(rows);
  };

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const list = [...questions];
    list[index][name] = value;
    setQuestions(list);
  };

  const handleStart = () => {
    if (title === "") {
      alert("면접 제목을 입력해주세요");
    } else if (!questions.every((q) => q.question !== "")) {
      alert("면접 질문을 입력해주세요");
    } else {
      if (questions.length === 1) {
        setIsNext(false);
      }
      setStarted(true);
      
      // 녹화 시작
      getWebcam((stream => {
        console.log(stream);
        videoRef.current.srcObject = stream;
      }));
    };
  };

  const handleNext = () => {
    setCurrent(current + 1);
    const s = videoRef.current.srcObject;
    
    // 녹화 멈추기
    s.getTracks().forEach((track) => {
      track.stop();
    });

    if (isNext) {
      if (current < questions.length - 2) {
        setIsNext(true);
      } else {
        setIsNext(false);
      }

      // 녹화 시작
      getWebcam((stream => {
        console.log(stream);
        videoRef.current.srcObject = stream;
      }));
    } else {
      navigate("/interview/feedback");
    }
  };

  return (
    started ?
    <>
      <Header />
      <BodyContainer>
        <Container>
          <Question>질문{current+1} {questions.at(current).question}</Question>
          <Video>
            <div>
              <video ref={videoRef} autoPlay style={Styles.Video} />
            </div>
          </Video>
          <Button onClick={handleNext}>{isNext?"다음":"면접 끝내기"}</Button>
        </Container>
      </BodyContainer>
    </>
    :
    <>
      <Header isLogin="true" />
      <BodyContainer>
        <Container>
          <Title>모의면접 정보 입력</Title>
          <div className="container">
            <div className="row my-3">
              <input
                type="text"
                onChange={(event) => setTitle(event.target.value)}
                name="title"
                className="form-control shadow-none"
                placeholder="면접 제목"
                autocomplete="off"
                />
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-xl-13">
                {questions.map((data, index) => {
                  const { question } = data;
                  return (
                    <div className="row my-3" key={index}>
                      <div className="col-11">
                        <div className="form-group">
                          <input
                            type="text"
                            onChange={(event) => handleChange(index, event)}
                            value={question}
                            name="question"
                            className="form-control shadow-none"
                            placeholder="질문"
                            autocomplete="off"
                          />
                        </div>
                      </div>
                      <div className="col-1">
                        {questions.length !== 1 ? (
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => removeInputFields(index)}
                          >
                            x
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  );
                })}
                <div className="row">
                  <div className="col-xl-4">
                    {questions.length < 5 ? (
                      <button
                        className="btn btn-sm btn-light"
                        onClick={addInputField}
                      >
                        질문 추가
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Button onClick={handleStart}>면접 시작</Button>
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

const Title = styled.div`
  font-family: SCDream-Regular;
  font-size: 1.5rem;
  text-align: center;
  margin: 1.5rem;
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
`;

const Video = styled.div`
  min-height: 360px;
  width: 640px;
`;

export default InterviewInfo;
