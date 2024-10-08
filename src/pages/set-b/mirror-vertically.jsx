import { useRef, useState } from "react";
import cv from "@techstark/opencv-js";

const VerticalMirrorEffect = () => {
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

  const applyMirrorEffect = () => {
    const canvas = canvasRef.current;
    const imgElement = document.createElement("img");
    imgElement.src = srcImage;

    imgElement.onload = () => {
      const src = cv.imread(imgElement);
      const dst = new cv.Mat();
      cv.flip(src, dst, 0); // Mirror effect
      cv.imshow(canvas, dst);
      src.delete();
      dst.delete();
    };
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Vertical Mirror Effect with OpenCV
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
            onClick={applyMirrorEffect}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Apply Mirror Effect
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

export default VerticalMirrorEffect;
