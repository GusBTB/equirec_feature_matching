/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as THREE from "three";
// import img1 from "./assets/IMG_20240620_103818_00_merged.jpg";
import imgg2 from "./assets/leo1.jpg";
import imgg3 from "./assets/leo2.jpg";
import imgg4 from "./assets/panquarto.jpg";
import clara from "./assets/clara.jpg";
import escura from "./assets/escura.jpg";
import msmAmb1 from "./assets/msmamb1.jpg";
import msmAmb2 from "./assets/msmamb2.jpg";
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

function App() {
    const [result, setResult] = useState({
        offsetLeft: 0,
        offsetRight: 0,
        totalOffset: 0,
    });
    const refLeft = useRef(null);
    const refRight = useRef(null);
    const refBtn = useRef(null);
    const refBtnBottom = useRef(null);
    const [showResultLines, setShowResultLines] = useState(false);
    const wich = {
        first: "first",
        second: "second",
        none: "none",
    };
    const [wichIsControlling, setWichIsControlling] = useState(wich.none);
    const [isLoading, setIsLoading] = useState(false);
    const [test, setTest] = useState({
        i1: clara,
        i2: escura,
    });
    const projection = useMemo(
        () =>
            new EquirectProjection({
                src: test.i1,
            }),
        [test]
    );

    const projection1 = useMemo(
        () =>
            new EquirectProjection({
                src: test.i2,
            }),
        [test]
    );

    function loadImage(url, callback) {
        let img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = function () {
            let mat = window.cv.imread(img);
            callback(mat);
        };
        img.src = url;
    }

    function processImages(img1, img2, setResult) {
        let gray1 = new window.cv.Mat();
        let gray2 = new window.cv.Mat();
        window.cv.cvtColor(img1, gray1, window.cv.COLOR_RGBA2GRAY, 0);
        window.cv.cvtColor(img2, gray2, window.cv.COLOR_RGBA2GRAY, 0);
        let orb = new window.cv.ORB();
        let keypoints1 = new window.cv.KeyPointVector();
        let keypoints2 = new window.cv.KeyPointVector();
        let descriptors1 = new window.cv.Mat();
        let descriptors2 = new window.cv.Mat();
        orb.detectAndCompute(
            gray1,
            new window.cv.Mat(),
            keypoints1,
            descriptors1
        );
        orb.detectAndCompute(
            gray2,
            new window.cv.Mat(),
            keypoints2,
            descriptors2
        );
        let bf = new window.cv.BFMatcher(window.cv.NORM_HAMMING, false);
        let matches = new window.cv.DMatchVector();
        bf.match(descriptors1, descriptors2, matches);
        let sortedMatches = Array.from({ length: matches.size() }, (_, i) =>
            matches.get(i)
        ).sort((a, b) => a.distance - b.distance);
        let numGoodMatches = Math.floor(sortedMatches.length * 0.1);
        let goodMatches = sortedMatches.slice(0, numGoodMatches);

        let match = goodMatches[0];
        let keypoint1 = keypoints1.get(match.queryIdx);
        let point1 = keypoint1.pt;
        console.log(
            "Keypoint na primeira imagem 1 (x, y):",
            point1.x,
            point1.y,
            keypoint1,
            img1.cols
        );
        let keypoint2 = keypoints2.get(match.trainIdx);
        let point2 = keypoint2.pt;
        console.log(
            "Keypoint na segunda imagem 2 (x, y):",
            point2.x,
            point2.y,
            keypoint2,
            img2.cols
        );

        const diff1 = img1.cols / 2 - point1.x;
        const diff2 = img2.cols / 2 - point2.x;
        let degreesPerPixel1 = 360 / img1.cols;
        let degreesPerPixel2 = 360 / img2.cols;
        const offset1 = diff1 * degreesPerPixel1;
        const offset2 = diff2 * degreesPerPixel2;
        console.log("[OFFSET CALCULADO EM GRAUS]", offset1, offset2);
        setResult({
            offsetLeft: offset1,
            offsetRight: offset2,
            totalOffset: offset1 - offset2,
        });
        setIsLoading(false);
        goodMatches = [goodMatches[0]];
        let goodMatchesDMatch = new window.cv.DMatchVector();
        goodMatches.forEach((match) => goodMatchesDMatch.push_back(match));

        let imgMatches = new window.cv.Mat();
        window.cv.drawMatches(
            img1,
            keypoints1,
            img2,
            keypoints2,
            goodMatchesDMatch,
            imgMatches
        );
        window.cv.imshow("canvasOutput", imgMatches);
        gray1.delete();
        gray2.delete();
        descriptors1.delete();
        descriptors2.delete();
        keypoints1.delete();
        keypoints2.delete();
        matches.delete();
        goodMatchesDMatch.delete();
        imgMatches.delete();
    }

    useEffect(() => {
        console.log("[RESULT MUDOU]", result);
        if (result && refLeft.current && refRight.current) {
            refLeft.current.camera.animateTo({
                yaw: result.offsetLeft,
                pitch: refLeft.current.camera.pitch,
                fov: refLeft.current.camera.fov,
            });
            refRight.current.camera.animateTo({
                yaw: result.offsetRight,
                pitch: refLeft.current.camera.pitch,
                fov: refLeft.current.camera.fov,
            });
            // window.refLeft = refLeft.current;
            // window.refRight = refRight.current;
        }
    }, [result]);

    useEffect(() => {
        setIsLoading(true);
        loadImage(test.i1, (img1) => {
            loadImage(test.i2, (img2) => {
                processImages(img1, img2, setResult);
            });
        });
    }, [test]);

    return (
        <div style={{ height: "100vh", width: "100vw", display: "flex" }}>
            {isLoading && (
                <div
                    style={{
                        position: "fixed",
                        width: "100vw",
                        height: "100vh",
                        zIndex: "100",
                        backgroundColor: "rgb(0,0,0, 0.8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div
                        style={{
                            width: "50%",
                            height: "50%",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "white",
                            fontSize: "25px",
                        }}
                    >
                        Carregando...
                    </div>
                </div>
            )}
            <div
                ref={refBtn}
                style={{
                    backgroundColor: "white",
                    color: "black",
                    padding: "7px 14px",
                    borderRadius: "5px",
                    zIndex: "99",
                    position: "fixed",
                    top: "15px",
                    cursor: "pointer",
                    right: `calc(50% - ${
                        refBtn.current
                            ? refBtn.current.getBoundingClientRect().width / 2
                            : 0
                    }px)`,
                }}
                onClick={() => {
                    setTest((prev) => ({
                        i1: prev.i1 === clara ? imgg2 : clara,
                        i2: prev.i1 === clara ? imgg3 : escura,
                    }));
                }}
            >
                Mudar imagens teste
            </div>
            <div
                ref={refBtnBottom}
                style={{
                    backgroundColor: "white",
                    color: "black",
                    padding: "7px 14px",
                    borderRadius: "5px",
                    zIndex: "99",
                    position: "fixed",
                    bottom: "15px",
                    cursor: "pointer",
                    right: `calc(50% - ${
                        refBtnBottom.current
                            ? refBtnBottom.current.getBoundingClientRect()
                                  .width / 2
                            : 0
                    }px)`,
                }}
                onClick={() => {
                    setShowResultLines((prev) => !prev);
                }}
            >
                Mostrar feature matching
            </div>
            <div
                onMouseOver={() => setWichIsControlling(wich.first)}
                onMouseOut={() => setWichIsControlling(wich.none)}
                style={{ height: "100%", width: "50%" }}
            >
                <View360
                    ref={refLeft}
                    onViewChange={(e) => {
                        console.log(
                            "\x1b[34m%s\x1b[0m",
                            "[VIEWER LEFT]",
                            e,
                            refRight.current,
                            wichIsControlling,
                            result
                        );
                        if (wichIsControlling === wich.first) {
                            refRight.current.camera.animateTo({
                                yaw: e.yaw - result.totalOffset,
                                pitch: e.pitch,
                                fov: e.fov,
                            });
                        }
                    }}
                    style={{ height: "100%" }}
                    className="is-16by9"
                    projection={projection}
                />
            </div>
            <div
                onMouseOver={() => setWichIsControlling(wich.second)}
                onMouseOut={() => setWichIsControlling(wich.none)}
                style={{
                    height: "100%",
                    width: "50%",
                }}
            >
                <View360
                    ref={refRight}
                    onViewChange={(e) => {
                        console.log(
                            "\x1b[36m%s\x1b[0m",
                            "[VIEWER RIGHT]",
                            e,
                            refLeft.current,
                            wichIsControlling
                        );
                        if (wichIsControlling === wich.second) {
                            refLeft.current.camera.animateTo({
                                yaw: e.yaw + result.totalOffset,
                                pitch: e.pitch,
                                fov: e.fov,
                            });
                        }
                    }}
                    style={{ height: "100%" }}
                    className="is-16by9"
                    projection={projection1}
                />
            </div>
            <canvas
                style={{
                    position: "fixed",
                    maxHeight: "100%",
                    maxWidth: "100%",
                    visibility: showResultLines ? "visible" : "hidden",
                }}
                id="canvasOutput"
            ></canvas>
        </div>
    );
}

export default App;
