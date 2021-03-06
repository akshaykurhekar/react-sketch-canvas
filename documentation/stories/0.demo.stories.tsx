/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  boolean,
  color,
  number,
  optionsKnob as options,
  text,
  withKnobs,
} from "@storybook/addon-knobs";
import * as React from "react";
import {
  CanvasPath,
  ExportImageType,
  ReactSketchCanvas,
} from "react-sketch-canvas";
import "./0.demo.stories.scss";

export default {
  title: "Full Demo",
  component: ReactSketchCanvas,
  parameters: {
    info: { inline: true },
  },
  decorators: [withKnobs],
};

const pointerModes = {
  mouse: "mouse",
  touch: "touch",
  pen: "pen",
  all: "all",
};

const imageTypes: { [key: string]: ExportImageType } = {
  png: "png",
  jpeg: "jpeg",
};

type CanvasRef = React.RefObject<ReactSketchCanvas>;
type Handlers = [string, () => void, string][];

export const SketchCanvas = () => {
  const canvasRef: CanvasRef = React.useRef<ReactSketchCanvas>(null);

  const [dataURI, setDataURI] = React.useState<string>("");
  const [svg, setSVG] = React.useState<string>("");
  const [paths, setPaths] = React.useState<CanvasPath[]>([]);
  const [sketchingTime, setSketchingTime] = React.useState<number>(0);

  const width = text("Canvas width in em/rem/px (width)", "100%");
  const height = text("Canvas height in em/rem/px (height)", "500px");
  const className = text("Class name (className)", "react-sketch-canvas");
  const canvasColor = color("Canvas background color (canvasColor)", "#FFFFFF");
  const background = text(
    "SVG background using CSS (background)",
    "no-repeat url(https://via.placeholder.com/150)"
  );
  const strokeColor = color("Stroke color (strokeColor)", "#000000");
  const strokeWidth = number("Stroke thickness (strokeWidth)", 4);
  const eraserWidth = number("Eraser thickness (eraserWidth)", 5);
  const pointerType = options(
    "Allowed pointer type (allowOnlyPointerType)",
    pointerModes,
    "all",
    {
      display: "inline-radio",
    }
  );

  const imageType = options("Image type to export ", imageTypes, "png", {
    display: "inline-radio",
  });

  const withTimestamp = boolean("Add timestamp to strokes", true);

  const imageExportHandler = async () => {
    const exportImage = canvasRef.current?.exportImage;

    if (exportImage) {
      const exportedDataURI = await exportImage(imageType);
      setDataURI(exportedDataURI);
    }
  };

  const svgExportHandler = async () => {
    const exportSvg = canvasRef.current?.exportSvg;

    if (exportSvg) {
      const exportedDataURI = await exportSvg();
      setSVG(exportedDataURI);
    }
  };

  const getSketchingTimeHandler = async () => {
    const getSketchingTime = canvasRef.current?.getSketchingTime;

    if (getSketchingTime) {
      const currentSketchingTime = await getSketchingTime();
      setSketchingTime(currentSketchingTime);
    }
  };

  const penHandler = () => {
    const eraseMode = canvasRef.current?.eraseMode;

    if (eraseMode) {
      eraseMode(false);
    }
  };

  const eraserHandler = () => {
    const eraseMode = canvasRef.current?.eraseMode;

    if (eraseMode) {
      eraseMode(true);
    }
  };

  const undoHandler = () => {
    const undo = canvasRef.current?.undo;

    if (undo) {
      undo();
    }
  };

  const redoHandler = () => {
    const redo = canvasRef.current?.redo;

    if (redo) {
      redo();
    }
  };

  const clearHandler = () => {
    const clearCanvas = canvasRef.current?.clearCanvas;

    if (clearCanvas) {
      clearCanvas();
    }
  };

  const resetCanvasHandler = () => {
    const resetCanvas = canvasRef.current?.resetCanvas;

    if (resetCanvas) {
      resetCanvas();
    }
  };

  const createButton = (
    label: string,
    handler: () => void,
    themeColor: string
  ) => (
    <button
      className={`btn btn-${themeColor} btn-block`}
      type="button"
      onClick={handler}
    >
      {label}
    </button>
  );

  const buttonsWithHandlers: Handlers = [
    ["Undo", undoHandler, "primary"],
    ["Redo", redoHandler, "primary"],
    ["Clear All", clearHandler, "primary"],
    ["Reset All", resetCanvasHandler, "primary"],
    ["Pen", penHandler, "secondary"],
    ["Eraser", eraserHandler, "secondary"],
    ["Export Image", imageExportHandler, "success"],
    ["Export SVG", svgExportHandler, "success"],
    ["Get Sketching time", getSketchingTimeHandler, "success"],
  ];

  const onUpdate = (updatedPaths: CanvasPath[]) => {
    setPaths(updatedPaths);
  };

  return (
    <div className="container-md">
      <h1 className="display-4 my-5">React Sketch Canvas - Full demo</h1>
      <div className="row no-gutters canvas-area m-0 p-0">
        <div className="col-9 canvas">
          <ReactSketchCanvas
            ref={canvasRef}
            className={className}
            width={width}
            height={height}
            background={background}
            strokeWidth={strokeWidth}
            strokeColor={strokeColor}
            canvasColor={canvasColor}
            eraserWidth={eraserWidth}
            allowOnlyPointerType={pointerType}
            style={{ borderRight: "1px solid #CCC" }}
            onUpdate={onUpdate}
            withTimestamp={withTimestamp}
          />
        </div>
        <div className="col-3 panel">
          {buttonsWithHandlers.map(([label, handler, themeColor]) =>
            createButton(label, handler, themeColor)
          )}
        </div>
      </div>

      <div className="row image-export p-3 justify-content-center align-items-start">
        <div className="col-5 row form-group">
          <label className="col-12" htmlFor="dataURI">
            Paths
          </label>
          <textarea
            id="dataURI"
            className="dataURICode col-12"
            readOnly
            rows={10}
            value={
              paths.length !== 0 ? JSON.stringify(paths) : "Sketch to get paths"
            }
          />
        </div>
        <div className="col-5 offset-2">
          <label className="col-12" htmlFor="dataURI">
            Sketching time
          </label>
          <div className="sketchingTime">
            {(sketchingTime / 1000).toFixed(3)} sec
          </div>
        </div>
      </div>

      <div className="row image-export p-3 justify-content-center align-items-start">
        <div className="col-5 row form-group">
          <label className="col-12" htmlFor="dataURI">
            Exported Data URI for imagetype
          </label>
          <textarea
            id="dataURI"
            className="dataURICode col-12"
            readOnly
            rows={10}
            value={dataURI || "Click on export image"}
          />
        </div>
        <div className="col-5 offset-2">
          <p>Exported image</p>
          <img
            className="exported-image"
            src={
              dataURI ||
              "https://via.placeholder.com/500x250/000000/FFFFFF/?text=Click on export image"
            }
            alt="exported"
          />
        </div>
      </div>

      <div className="row image-export p-3 justify-content-center align-items-start">
        <div className="col-5 row form-group">
          <label className="col-12" htmlFor="dataURI">
            Exported SVG code
          </label>
          <textarea
            id="dataURI"
            className="dataURICode col-12"
            readOnly
            rows={10}
            value={svg || "Click on export svg"}
          />
        </div>
        <div className="col-5 offset-2">
          <p>Exported SVG</p>
          {svg ? (
            <span
              className="exported-image"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          ) : (
            <img
              src="https://via.placeholder.com/500x250/000000/FFFFFF/?text=Click on export SVG"
              alt="Svg Export"
              className="exported-image"
            />
          )}
        </div>
      </div>
    </div>
  );
};
