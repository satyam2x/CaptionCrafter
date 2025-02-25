import React, { useEffect, useState } from "react";
import ReactInputMask from "react-input-mask";

const CaptionInput = ({ addCaption }) => {
  const [captions, setCaptions] = useState([
    { startTime: "00:00:00.000", endTime: "00:00:02.000", text: "" },
  ]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      addCaption(captions);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [captions, addCaption]);

  const timeToComparableFormat = (time) => {
    return time.replace(/[:.]/g, "");
  };

  const addMilliseconds = (time, msToAdd) => {
    let [hours, minutes, seconds] = time.split(":");
    let [secs, millis] = seconds.split(".");

    let totalMillis =
      parseInt(hours) * 3600000 +
      parseInt(minutes) * 60000 +
      parseInt(secs) * 1000 +
      parseInt(millis) +
      msToAdd;
    hours = Math.floor(totalMillis / 3600000)
      .toString()
      .padStart(2, "0");
    minutes = Math.floor((totalMillis % 3600000) / 60000)
      .toString()
      .padStart(2, "0");
    secs = Math.floor((totalMillis % 60000) / 1000)
      .toString()
      .padStart(2, "0");
    millis = (totalMillis % 1000).toString().padStart(3, "0");

    return `${hours}:${minutes}:${secs}.${millis}`;
  };

  const isValidCaption = (captions, index) => {
    let isValid = true;
    const newErrors = [];

    for (let i = 0; i < captions.length; i++) {
      const { startTime, endTime, text } = captions[i];
      if (!startTime || !endTime || !text) {
        newErrors[index] = "All fields must be filled.";
        isValid = false;
      } else if (
        timeToComparableFormat(endTime) < timeToComparableFormat(startTime)
      ) {
        newErrors[index] =
          "End time must be greater than or equal to start time.";
        isValid = false;
      } else if (
        i > 0 &&
        timeToComparableFormat(startTime) <
          timeToComparableFormat(captions[i - 1].endTime)
      ) {
        newErrors[index] =
          "Start time must be greater than or equal to the end time of the previous caption.";
        isValid = false;
      } else {
        newErrors[index] = "";
      }
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleAddCaption = () => {
    const lastCaption = captions[captions.length - 1];
    if (isValidCaption([lastCaption], captions.length - 1)) {
      const newStartTime = addMilliseconds(lastCaption.endTime, 0);
      const newEndTime = addMilliseconds(newStartTime, 2000);
      setCaptions([
        ...captions,
        { startTime: newStartTime, endTime: newEndTime, text: "" },
      ]);
    }
  };

  const handleCaptionChange = (index, field, value) => {
    const updatedCaptions = [...captions];
    updatedCaptions[index][field] = value;
    setCaptions(updatedCaptions);
    isValidCaption(updatedCaptions, index);
  };

  const handleRemoveCaption = (index) => {
    const updatedCaptions = [...captions];
    updatedCaptions.splice(index, 1);
    setCaptions(updatedCaptions);
  };

  return (
    <div className="w-max">
      <button
        className="flex-row-reverse px-5 py-3 text-lg bg-blue-500 text-white rounded transition-colors duration-300 hover:bg-blue-700"
        onClick={handleAddCaption}
      >
        Add Caption
      </button>
      <div className="caption-child h-[75vh] mt-3 scrollbar overflow-y-auto">
        {captions.map((caption, index) => (
          <div
            key={index}
            className="caption-parent mr-2 border-gray-300 rounded shadow-lg p-3 hover:scale-[101%] transition-transform odd:bg-[#9747ffa6] even:bg-[#5331a9a2]"
          >
            <div className="caption-input-container flex justify-between items-start">
              <div className="input-container w-[30%]">
                <div className="input-field mb-1.5">
                  <ReactInputMask
                    type="text"
                    mask="99:99:99.999"
                    maskChar="_"
                    value={caption.startTime}
                    onChange={(e) =>
                      handleCaptionChange(index, "startTime", e.target.value)
                    }
                    placeholder="00:00:00.000"
                    className="w-full p-2 bg-transparent border text-lg text-center border-gray-300 rounded text-white items-center"
                  />
                </div>
                <div className="input-field mb-1.5">
                  <ReactInputMask
                    type="text"
                    mask="99:99:99.999"
                    maskChar="_"
                    value={caption.endTime}
                    onChange={(e) =>
                      handleCaptionChange(index, "endTime", e.target.value)
                    }
                    placeholder="00:00:00.000"
                    className="w-full bg-transparent p-2 border text-lg text-center border-gray-300 rounded text-white"
                  />
                </div>
              </div>
              <div className="text-container w-[70%] ml-[10px]">
                <textarea
                  value={caption.text}
                  onChange={(e) =>
                    handleCaptionChange(index, "text", e.target.value)
                  }
                  placeholder="Enter caption text..."
                  className="w-full h-[100px] p-2.5 text-lg border border-gray-300 rounded text-white bg-transparent"
                />
              </div>
              {index > 0 && (
                <button
                  className="remove-button ml-2 px-1 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleRemoveCaption(index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            {errors[index] && (
              <p className="error-text text-red-500 mt-2">{errors[index]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaptionInput;
