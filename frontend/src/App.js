import { TbRectangle } from "react-icons/tb";
import { IoMdDownload } from "react-icons/io";
import { FaLongArrowAltRight } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { GiArrowCursor } from "react-icons/gi";
import { FaRegCircle } from "react-icons/fa";
import { Layer, Rect, Stage } from 'react-konva'
import { useRef, useState } from 'react';
import { ACTIONS } from "./constants";
import { v4 as uuidv4 } from 'uuid'

function App() {
  const stageRef = useRef();
  const [action, setAction] = useState(ACTIONS.SELECT);
  const [fillColor, setFillColor] = useState("#ff0000");
  const [rectangles, setRectangle] = useState([]);
  const strokeColor = "#000";
  const isPainting = useRef();
  const currentShapeId = useRef();


  const onPointerDown = () => {
    if (action === ACTIONS.SELECT) return;

    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();
    const id = uuidv4();
    currentShapeId.current = id;
    isPainting.current = true;

    switch (action) {
      case ACTIONS.RECTANGLE: setRectangle((rectangles) => [...rectangles, {
        id,
        x,
        y,
        height: 20,
        width: 20,
        fillColor,
      }]);
        break;
    }
  }

  const onPointerMove = () => {
    if (action === ACTIONS.SELECT || !isPainting.current) return;

    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();


    switch (action) {
      case ACTIONS.RECTANGLE: setRectangle((rectangles) => rectangles.map((rectangle) => {
        if (rectangle.id === currentShapeId.current) {
          return {
            ...rectangle,
            width: x - rectangle.x,
            height: y - rectangle.y
          }
        }
        return rectangle;
      }));
        break;
    }
  }
  const onPointerUp = () => {
    isPainting.current = false;
  }

  const handleExport = () => {
    const uri = stageRef.current.toDataURL();
    var link = document.createElement("a");
    link.download = "image.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  return (
    <>
      <div className='relative w-full h-screen overflow-hidden'>
        {/* Controls */}
        <div className='absolute top-0 z-10 w-full py-2'>
          <div className="flex justify-center items-center  gap-3 py-2 px-3  w-fit mx-auto border shadow">
            <button className={action === ACTIONS.SELECT ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"} onClick={() => setAction(ACTIONS.SELECT)}>
              <GiArrowCursor size={'2rem'} />
            </button>

            <button className={action === ACTIONS.RECTANGLE ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"} onClick={() => setAction(ACTIONS.RECTANGLE)}>
              <TbRectangle size={'2rem'} />
            </button>

            <button className={action === ACTIONS.CIRCLE ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"} onClick={() => setAction(ACTIONS.CIRCLE)}>
              <FaRegCircle size={'1.5rem'} />
            </button>

            <button className={action === ACTIONS.ARROW ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"} onClick={() => setAction(ACTIONS.ARROW)}>
              <FaLongArrowAltRight size={'2rem'} />
            </button>

            <button className={action === ACTIONS.SCRIBBLE ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"} onClick={() => setAction(ACTIONS.SCRIBBLE)}>
              <LuPencil size={'1.5rem'} />
            </button>

            <button>
              <input className="w-6 h-6" type="color" value={fillColor} onChange={(e) => setFillColor(e.target.value)} />
            </button>

            <button onClick={handleExport}>
              <IoMdDownload size={'2rem'} />
            </button>
          </div>
        </div>
        {/* Canvas */}
        <Stage ref={stageRef} width={window.innerWidth} height={window.innerHeight} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
          <Layer>
            <Rect x={0} y={0} width={window.innerWidth} height={window.innerHeight} fill="#ffffff" id="bg" />


            {rectangles.map((rectangle) => {
              return <Rect key={rectangle.id} x={rectangle.x} y={rectangle.y} stroke={strokeColor} strokeWidth={2} fill={rectangle.fillColor} height={rectangle.height} width={rectangle.width} />
            })}
          </Layer>
        </Stage>
      </div>
    </>
  );
}

export default App;
