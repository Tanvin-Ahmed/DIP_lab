import "./App.css";
import HistogramEqualization from "./pages/set-a/HistogramEqualization";
import MirrorEffect from "./pages/set-a/mirror";
import DecreasingHistogramEqualization from "./pages/set-b/DecreasingHistogramEqualization";
import VerticalMirrorEffect from "./pages/set-b/mirror-vertically";
import BinaryImageGenerator from "./pages/set-c/BinaryImageGenerator";
import ImageSplitAndRearrange from "./pages/set-c/ImageSplitAndRearrange";
import ImageReconstruction from "./pages/set-c/img-reconstruction";

function App() {
  return (
    <main className="container mx-auto p-4 min-h-screen max-h-full w-full space-y-20">
      <section className="bg-blue-50 p-2 rounded-md">
        <h1 className="font-bold text-6xl">Set A</h1>
        <MirrorEffect />
        <HistogramEqualization />
      </section>
      <section className="bg-red-50 p-2 rounded-md">
        <h1 className="font-bold text-6xl">Set B</h1>
        <VerticalMirrorEffect />
        <DecreasingHistogramEqualization />
      </section>
      <section className="bg-green-50 p-2 rounded-md">
        <h1 className="font-bold text-6xl">Set C</h1>
        <ImageSplitAndRearrange />
        <ImageReconstruction />
        <BinaryImageGenerator />
      </section>
    </main>
  );
}

export default App;
