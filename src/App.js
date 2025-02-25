import React, { useState } from "react";
import "./styles.css";
import InputMask from "react-input-mask";
import PlayVideo from "./PlayVideo";
import CaptionInput from "./CaptionInput";

export default function App() {
  const [videoUrl, setVideoUrl] = useState(
    "https://videos.pexels.com/video-files/3818936/3818936-hd_1920_1080_30fps.mp4"
  );
  const [captions, setCaptions] = useState([]);
  const [isValidVideoUrl, setIsValidVideoUrl] = useState(false);
  const [showCaptionsForm, setShowCaptionsForm] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);

  const validateVideoUrl = () => {
    // Validation logic for video URL
    const videoRegex = /\.(mp4|ogg|webm)$/i;
    const isValid = videoRegex.test(videoUrl);
    setIsValidVideoUrl(isValid);

    if (isValid) {
      setShowCaptionsForm(true);
    } else {
      alert(
        "Invalid video URL. Please enter a valid URL ending with .mp4, .ogg, or .webm"
      );
    }
  };

  const handleInputChange = (e) => {
    setVideoUrl(e.target.value);
    setIsValidVideoUrl(false); // Reset validation on input change
    setShowCaptionsForm(false); // Hide captions form on input change
    setPlayVideo(false); // Hide video playback on input change
    setCaptions([]); // Reset captions on input change
  };

  const addCaption = (caption) => {
    // Function to add caption to the captions state
    setCaptions(caption);
  };

  const handleStartPlayback = () => {
    // Function to start video playback with captions
    setPlayVideo(true);
  };

  return (
    <div className=" bg-gradient-to-b from-[#9747FF] to-[#5331a9] h-screen">
      <header className="text-white flex gap-1 p-4 items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-8"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
          />
        </svg>
        <span className="font-bold font-sans text-2xl cursor-pointer">
          CaptionCrafter
        </span>
      </header>
      <div>
        {!isValidVideoUrl && !showCaptionsForm && !playVideo && (
          <div className="flex flex-col items-center gap-y-4 text-center">
            <h1 className="font-bold font-sans text-white text-3xl mt-16">
              Add Epic Captions to your Video.
            </h1>
            <h2 className="text-white/80 text-xl ">Enter Video URL</h2>
            <InputMask
              type="text"
              mask=""
              maskChar=""
              value={videoUrl}
              onChange={handleInputChange}
              placeholder="Enter video URL"
              className="w-full max-w-md p-2 border-none bg-slate-100 rounded-md"
            />
            <button
              className="w-full max-w-md rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 p-2 mt-2"
              onClick={validateVideoUrl}
            >
              Validate
            </button>
          </div>
        )}
      </div>

      {isValidVideoUrl && showCaptionsForm && !playVideo && (
        <div className="flex justify-around">
          <PlayVideo captions={captions} videoUrl={videoUrl} />
          <CaptionInput addCaption={addCaption} />
        </div>
      )}

      {playVideo && <PlayVideo captions={captions} videoUrl={videoUrl} />}

      {/* {showCaptionsForm && !playVideo && (
        <button className="add-caption-button" onClick={handleStartPlayback}>
          Show Preview
        </button>
      )} */}
    </div>
  );
}
