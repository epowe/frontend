import "./App.css";
import React, { useEffect, useContext, useState } from "react";
import MainPage from "./views/MainPage.jsx";
import Interview from "./views/Interview";
import Register from "./views/Register";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import InterviewInfo from "./views/InterviewInfo.jsx";
import Feedback from "./views/Feedback";
import MyFeedback from './views/MyFeedback';
import FeedbackList from './views/FeedbackList';
import QuestionList from './views/QuestionList';
import FeedbackDetail from './views/FeedbackDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/interview" element={<Interview />} />
      <Route exact path="/oauth2/redirect" component={<Register />} />
      <Route path="/interview/info" element={<InterviewInfo />} />
      <Route path="/interview/feedback" element={<Feedback />} />
      <Route path="/myfeedback" element={<MyFeedback />} />
      <Route path="/feedbacklist" element={<FeedbackList />} />
      <Route path="/questionlist" element={<QuestionList />} />
      <Route path="/feedbackDetail" element={<FeedbackDetail />} />
    </Routes>
  );
}

export default App;
