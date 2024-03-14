import React from 'react'
import { TbRectangle } from "react-icons/tb";
import { IoMdDownload } from "react-icons/io";
import { FaLongArrowAltRight } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { GiArrowCursor } from "react-icons/gi";
import { FaRegCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { CiStar } from "react-icons/ci";
import { BiPolygon } from "react-icons/bi";
import { Arrow, Circle, Layer, Line, Rect, RegularPolygon, Stage, Star, Transformer } from 'react-konva'
import { useRef, useState } from 'react';
import { ACTIONS } from "./constants";
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

const Drawing = () => {
    const stageRef = useRef();
    const [action, setAction] = useState(ACTIONS.SELECT);
    const [fillColor, setFillColor] = useState("#ff0000");
    const [lines, setLines] = useState([]);
    const currentLine = useRef([]);
    const [rectangles, setRectangle] = useState([]);
    const [circles, setCircles] = useState([]);
    const [arrows, setArrows] = useState([]);
    const [scribbles, setScribbles] = useState([]);
    const [thickness, setThickness] = useState(10);
    const [polygons, setPolygons] = useState([]);
    const [sides, setSides] = useState(3);
    const [stars, setStars] = useState([]);

    const handleDragStart = (e) => {
        const id = e.target.id();
        setStars(
            stars.map((star) => {
                return {
                    ...star,
                    isDragging: star.id === id,
                };
            })
        );
    };
    const handleDragEnd = (e) => {
        setStars(
            stars.map((star) => {
                return {
                    ...star,
                    isDragging: false,
                };
            })
        );
    };

    const [selectedDlt, setSelectedDlt] = useState('')

    const strokeColor = "#000";
    const isPainting = useRef();
    const currentShapeId = useRef();
    const transformerRef = useRef();


    const isDraggable = action === ACTIONS.SELECT;

    const onPointerDown = () => {
        if (action === ACTIONS.SELECT) return;

        const stage = stageRef.current;
        const { x, y } = stage.getPointerPosition();
        const id = uuidv4();
        currentShapeId.current = id;
        isPainting.current = true;
        currentLine.current = [x, y, x, y];

        switch (action) {
            case ACTIONS.RECTANGLE: setRectangle((rectangles) => [...rectangles, {
                id,
                x,
                y,
                height: 20,
                width: 20,
                fillColor,
                strokeWidth: +thickness
            }]);
                break;

            case ACTIONS.CIRCLE: setCircles((circles) => [...circles, {
                id,
                x,
                y,
                radius: 20,
                fillColor,
                strokeWidth: +thickness
            }]);
                break;

            case ACTIONS.ARROW: setArrows((arrows) => [...arrows, {
                id,
                points: [x, y, x + 20, y + 20],
                fillColor,
                strokeWidth: +thickness
            }]);
                break;

            case ACTIONS.SCRIBBLE: setScribbles((scribbles) => [...scribbles, {
                id,
                points: [x, y],
                fillColor,
                strokeWidth: +thickness
            }]);
                break;

            case ACTIONS.LINE: setScribbles((lines) => [...lines, {
                id,
                points: [x, y, x + 20, y + 20],
                fillColor,
                strokeWidth: +thickness
            }]);
                break;


            case ACTIONS.STAR: setStars((stars) => [...stars, {
                id,
                x,
                y,
                points: [x, y, x + 20, y + 20],
                fillColor,
                numPoints: sides,
                innerRadius: 10,
                outerRadius: 20,

                strokeWidth: +thickness
            }]);
                break;


            case ACTIONS.POLYGON: setPolygons((polygons) => [...polygons, {
                id,
                x,
                y,
                fillColor,
                sides: sides,
                strokeWidth: +thickness
            }]);
                break;
        }
    }


    const onPointerMove = () => {
        if (action === ACTIONS.SELECT || !isPainting.current) return;

        const stage = stageRef.current;
        const { x, y } = stage.getPointerPosition();
        currentLine.current = [...currentLine.current, x, y]; // Add new points to the current line
        setLines([...lines, currentLine.current]);

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

            case ACTIONS.CIRCLE: setCircles((circles) => circles.map((circle) => {
                if (circle.id === currentShapeId.current) {
                    return {
                        ...circle,
                        radius: ((y - circle.y) ** 2 + (x - circle.x) ** 2) ** 0.5,
                    }
                }
                return circle;
            }));
                break;

            case ACTIONS.ARROW: setArrows((arrows) => arrows.map((arrow) => {
                if (arrow.id === currentShapeId.current) {
                    return {
                        ...arrow,
                        points: [arrow.points[0], arrow.points[1], x, y]
                    }
                }
                return arrow;
            }));
                break;

            case ACTIONS.SCRIBBLE: setScribbles((scribbles) => scribbles.map((scribble) => {
                if (scribble.id === currentShapeId.current) {
                    return {
                        ...scribble,
                        points: [...scribble.points, x, y]
                    }
                }
                return scribble;
            }));
                break;

            case ACTIONS.LINE: setScribbles((lines) => lines.map((line) => {
                if (line.id === currentShapeId.current) {
                    return {
                        ...line,
                        points: [line.points[0], line.points[1], x, y]
                    }
                }
                return line;
            }));
                break;

            case ACTIONS.STAR: setStars((stars) =>
                stars.map((star) => {
                    if (star.id === currentShapeId.current) {
                        const distance = Math.sqrt((x - star.x) ** 2 + (y - star.y) ** 2);
                        const innerRadius = distance * 0.2;
                        const outerRadius = distance * 0.4;
                        return {
                            ...star,
                            innerRadius,
                            outerRadius,
                        };
                    }
                    return star;
                })
            );
                break;

            case ACTIONS.POLYGON: setPolygons((polygons) => polygons.map((polygon) => {
                if (polygon.id === currentShapeId.current) {
                    return {
                        ...polygon,
                        radius: ((y - polygon.y) ** 2 + (x - polygon.x) ** 2) ** 0.5,
                    }
                }
                return polygon;
            }));
                break;
        }
    }
    const onPointerUp = () => {
        isPainting.current = false;
    }


    const onClick = (e, id) => {
        if (action !== ACTIONS.SELECT) return;
        const target = e.currentTarget;
        transformerRef.current.nodes([target]);
        setSelectedDlt(id);
    }

    const handleExport = async () => {
        const token = localStorage.getItem('e-token');
        const uri = stageRef.current.toDataURL();
        
        var link = document.createElement("a");
        link.download = "image.png";
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log(uri)

        const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/drawing/create`,
            {
                imgUrl: uri
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        console.log(res.data)
    }


    const handleDlt = () => {
        setLines(lines.filter(line => line.id !== selectedDlt));
        setRectangle(rectangles.filter(rectangle => rectangle.id !== selectedDlt));
        setCircles(circles.filter(circle => circle.id !== selectedDlt));
        setArrows(arrows.filter(arrow => arrow.id !== selectedDlt));
        setScribbles(scribbles.filter(scribble => scribble.id !== selectedDlt));
        setStars(stars.filter(star => star.id !== selectedDlt));
        setPolygons(polygons.filter(polygon => polygon.id !== selectedDlt));
        setSelectedDlt('');
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

                        <button className={action === ACTIONS.LINE ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"} onClick={() => setAction(ACTIONS.LINE)} >
                            <span className="text-2xl p-3">/</span>
                        </button>

                        <button className={action === ACTIONS.RECTANGLE ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"} onClick={() => setAction(ACTIONS.RECTANGLE)}>
                            <TbRectangle size={'2rem'} />
                        </button>



                        <button className={action === ACTIONS.CIRCLE ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"} onClick={() => setAction(ACTIONS.CIRCLE)}>
                            <FaRegCircle size={'1.5rem'} />
                        </button>

                        <button className={action === ACTIONS.STAR ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"} onClick={() => setAction(ACTIONS.STAR)}>
                            <CiStar size={'2rem'} />
                        </button>

                        <button className={action === ACTIONS.ARROW ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"} onClick={() => setAction(ACTIONS.ARROW)}>
                            <FaLongArrowAltRight size={'2rem'} />
                        </button>

                        <button className={action === ACTIONS.SCRIBBLE ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"} onClick={() => setAction(ACTIONS.SCRIBBLE)}>
                            <LuPencil size={'1.5rem'} />
                        </button>

                        <button className={action === ACTIONS.POLYGON ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"} onClick={() => setAction(ACTIONS.POLYGON)}>
                            <BiPolygon size={'1.5rem'} />
                        </button>

                        <label htmlFor="" className="font-bold text-xl ">s</label>
                        <input type="number" className="w-16" min={3} value={sides} onChange={(e) => { setSides(e.target.value); console.log(e.target.value) }} />

                        <label htmlFor="" className="font-bold text-xl ">t</label>
                        <input type="number" className="w-16" min={1} value={thickness} onChange={(e) => { setThickness(e.target.value); console.log(e.target.value) }} />

                        <button>
                            <input className="w-6 h-6" type="color" value={fillColor} onChange={(e) => setFillColor(e.target.value)} />
                        </button>

                        <button onClick={handleExport}>
                            <IoMdDownload size={'2rem'} />
                        </button>

                        <button onClick={() => handleDlt()}><MdDelete size={'1.5rem'} /></button>

                    </div>
                </div>

                {/* Canvas */}
                <Stage ref={stageRef} width={window.innerWidth} height={window.innerHeight} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
                    <Layer>
                        <Rect x={0} y={0} width={window.innerWidth} height={window.innerHeight} fill="#ffffff" id="bg" onClick={() => transformerRef.current.nodes([])} />

                        {rectangles.map((rectangle) => {
                            return <Rect key={rectangle.id} x={rectangle.x} y={rectangle.y} stroke={strokeColor} strokeWidth={rectangle.strokeWidth} fill={rectangle.fillColor} height={rectangle.height} width={rectangle.width} draggable={isDraggable} onClick={(e) => {
                                onClick(e, rectangle.id);
                            }} />
                        })}

                        {circles.map((circle) => {
                            return <Circle key={circle.id} radius={circle.radius} x={circle.x} y={circle.y} stroke={strokeColor} strokeWidth={circle.strokeWidth} fill={circle.fillColor} draggable={isDraggable} onClick={(e) => {
                                onClick(e, circle.id);
                            }} />
                        })}

                        {arrows.map((arrow) => {
                            return <Arrow key={arrow.id} points={arrow.points} stroke={strokeColor} strokeWidth={arrow.strokeWidth} fill={arrow.fillColor} draggable={isDraggable} onClick={(e) => {
                                onClick(e, arrow.id);
                            }} />
                        })}

                        {scribbles.map((scribble) => {
                            return <Line key={scribble.id} lineCap="round" lineJoin="round" points={scribble.points} stroke={strokeColor} strokeWidth={scribble.strokeWidth} fill={scribble.fillColor} draggable={isDraggable} onClick={(e) => {
                                onClick(e, scribble.id);
                            }} />
                        })}

                        {lines.map((line) => {
                            return <Line key={line.id} points={line.points}
                                stroke={strokeColor}
                                strokeWidth={line.strokeWidth}
                                lineCap='round'
                                lineJoin='round' draggable={isDraggable} onClick={(e) => {
                                    onClick(e, line.id);
                                }} />
                        })}


                        {polygons.map((polygon) => {
                            return <RegularPolygon key={polygon.id} x={polygon.x} y={polygon.y} sides={polygon.sides} radius={polygon.radius} stroke={strokeColor} strokeWidth={polygon.strokeWidth} fill={polygon.fillColor} draggable={isDraggable} onClick={(e) => {
                                onClick(e, polygon.id);
                            }} />
                        })}

                        {stars.map((star) => (
                            <Star
                                key={star.id}
                                id={star.id}
                                x={star.x}
                                y={star.y}
                                numPoints={star.numPoints}
                                innerRadius={star.innerRadius}
                                outerRadius={star.outerRadius}
                                fill={star.fillColor}
                                stroke='black'
                                strokeWidth={star.strokeWidth}
                                opacity={0.8}
                                draggable
                                scaleX={star.isDragging ? 2 : 1}
                                scaleY={star.isDragging ? 2 : 1}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                onClick={(e) => {
                                    onClick(e, star.id);
                                }}
                            />
                        ))}
                        <Transformer ref={transformerRef} />
                    </Layer>
                </Stage>
            </div>
        </>
    );
}

export default Drawing


