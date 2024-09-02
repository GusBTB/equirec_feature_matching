/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as THREE from "three";
import img1 from "./assets/IMG_20240620_103818_00_merged.jpg";
import imgg2 from "./assets/leo1.jpg";
import imgg3 from "./assets/leo2.jpg";
import imgg4 from "./assets/panquarto.jpg";
import clara from "./assets/clara.jpg";
import escura from "./assets/escura.jpg";
import React, {
    // Suspense,
    // useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
// import {
//     Canvas,
//     extend,
//     useFrame,
//     useThree,
//     useLoader,
// } from "react-three-fiber";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./styles.css";
import View360, { EquirectProjection } from "@egjs/react-view360";
import "@egjs/react-view360/css/view360.min.css";
import ReactPannellum, { getNorthOffset, getViewer } from "react-pannellum";

function App() {
    const reff = useRef(null);

    useEffect(() => {
        window.reff = reff.current;
    }, []);
    return (
        <div style={{ height: "100vh", width: "100vw", display: "flex" }}>
            <div
                // onMouseOver={() => setWichIsControlling(wich.first)}
                // onMouseOut={() => setWichIsControlling(wich.none)}
                style={{ height: "100%", width: "50%" }}
            >
                <ReactPannellum
                    ref={reff}
                    id="1"
                    sceneId="firstScene"
                    // imageSource="https://pannellum.org/images/alma.jpg"
                    imageSource={clara}
                    config={{
                        autoLoad: true,
                        compass: true,
                        // northOffset: 30,
                    }}
                    onPanoramaLoaded={() => {
                        const viewer = getViewer("1");
                        // viewer.setNorthOffset(50);
                        console.log(
                            "North Offset:",
                            getNorthOffset("1")
                            // viewer.getNorthOffset()
                        );
                    }}
                />
            </div>
            <div
                // onMouseOver={() => setWichIsControlling(wich.second)}
                // onMouseOut={() => setWichIsControlling(wich.none)}
                style={{
                    height: "100%",
                    width: "50%",
                }}
            >
                <ReactPannellum
                    id="2"
                    sceneId="firstScenee"
                    // imageSource="https://pannellum.org/images/alma.jpg"
                    imageSource={escura}
                    config={{ autoLoad: true }}
                />
            </div>
            {/* <canvas
                style={{
                    position: "fixed",
                    maxHeight: "100%",
                    maxWidth: "100%",
                }}
                id="canvasOutput"
            ></canvas> */}
            {/* {matchesImage && (
                <div
                    style={{
                        position: "fixed",
                        maxHeight: "100%",
                        maxWidth: "100%",
                    }}
                >
                    <h3>Visualização das Correspondências:</h3>
                    <canvas
                        style={{
                            position: "fixed",
                            maxHeight: "100%",
                            maxWidth: "100%",
                        }}
                        id="canvasOutput"
                    ></canvas>
                </div>
            )} */}
        </div>
    );
}

export default App;
