import { useRef, useState } from "react";
import cv from "@techstark/opencv-js";

const BinaryImageGenerator = () => {
  const [srcImage, setSrcImage] = useState(null);
  const canvasRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setSrcImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateBinaryImage = () => {
    if (!srcImage) {
      alert("Please upload an image first!");
      return;
    }

    const imgElement = document.createElement("img");
    imgElement.src = srcImage;

    imgElement.onload = () => {
      // Read the uploaded grayscale image
      let src = cv.imread(imgElement);

      // Convert to grayscale if it's not already
      let gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

      // Flatten the pixel values into an array and sort it
      let pixelValues = [];
      for (let i = 0; i < gray.rows; i++) {
        for (let j = 0; j < gray.cols; j++) {
          pixelValues.push(gray.ucharPtr(i, j)[0]);
        }
      }
      pixelValues.sort((a, b) => a - b);

      // Find the median threshold where tf1 is approximately equal to tf2
      const threshold = pixelValues[Math.floor(pixelValues.length / 2)];

      // Apply the threshold to create a binary image
      let binary = new cv.Mat();
      cv.threshold(gray, binary, threshold, 255, cv.THRESH_BINARY);

      // Display the binary image
      cv.imshow(canvasRef.current, binary);

      // Clean up
      src.delete();
      gray.delete();
      binary.delete();
    };
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Binary Image Generator
      </h1>

      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-5 w-full border-gray-400 rounded-lg flex flex-col justify-center items-center">
          {srcImage ? (
            <>
              <img
                src={srcImage}
                alt="Original"
                className="w-full object-contain"
              />
              <button
                className="py-1 px-2 rounded bg-red-500 text-white mt-4"
                onClick={() => setSrcImage(null)}
              >
                Remove
              </button>
            </>
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
            />
          )}
        </div>
        <div className="flex w-full justify-center items-center md:col-span-2">
          <button
            onClick={generateBinaryImage}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Generate Binary Image
          </button>
        </div>

        <canvas
          ref={canvasRef}
          className="mt-6 md:col-span-5 border-2 border-gray-400 rounded-lg w-full object-contain"
        ></canvas>
      </div>
    </div>
  );
};

export default BinaryImageGenerator;
