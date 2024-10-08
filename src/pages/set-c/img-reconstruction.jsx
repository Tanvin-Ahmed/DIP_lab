import { useRef, useState } from "react";
import cv from "@techstark/opencv-js";

const ImageReconstruction = () => {
  const [srcImage, setSrcImage] = useState(null);
  const [outputImage, setOutputImage] = useState(null);
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

  const reconstructOriginalImage = () => {
    const canvas = canvasRef.current;
    const imgElement = document.createElement("img");
    imgElement.src = srcImage;

    imgElement.onload = () => {
      const src = cv.imread(imgElement);
      const height = src.rows;
      const width = src.cols;

      // Split the image into 4 parts
      const bottomRight = src.roi(new cv.Rect(0, 0, width / 2, height / 2));
      const bottomLeft = src.roi(
        new cv.Rect(width / 2, 0, width / 2, height / 2)
      );
      const topRight = src.roi(
        new cv.Rect(0, height / 2, width / 2, height / 2)
      );
      const topLeft = src.roi(
        new cv.Rect(width / 2, height / 2, width / 2, height / 2)
      );

      // Create a new empty image
      const dst = new cv.Mat(height, width, src.type());

      // Rearrange the parts back to the original positions
      bottomRight.copyTo(
        dst.roi(new cv.Rect(width / 2, height / 2, width / 2, height / 2))
      );
      bottomLeft.copyTo(
        dst.roi(new cv.Rect(0, height / 2, width / 2, height / 2))
      );
      topRight.copyTo(
        dst.roi(new cv.Rect(width / 2, 0, width / 2, height / 2))
      );
      topLeft.copyTo(dst.roi(new cv.Rect(0, 0, width / 2, height / 2)));

      cv.imshow(canvas, dst);

      // Save the output image as a data URL
      const dataURL = canvas.toDataURL("image/png");
      setOutputImage(dataURL);

      // Clean up
      src.delete();
      dst.delete();
      topLeft.delete();
      topRight.delete();
      bottomLeft.delete();
      bottomRight.delete();
    };
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Reconstruct Original Image
      </h1>

      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-5 w-full border-gray-400 rounded-lg flex flex-col justify-center items-center">
          {srcImage ? (
            <>
              <img
                src={srcImage}
                alt="Rearranged"
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
            onClick={reconstructOriginalImage}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Reconstruct Image
          </button>
        </div>

        <div className="mt-6 md:col-span-5 flex flex-col items-center justify-center">
          <canvas
            ref={canvasRef}
            className="border-2 border-gray-400 rounded-lg w-full object-contain"
          ></canvas>
          {outputImage && (
            <a
              href={outputImage}
              download="reconstructed_image.png"
              className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-green-600 transition duration-300"
            >
              Download Reconstructed Image
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageReconstruction;
