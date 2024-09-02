// import { useState } from 'react'
// import ReactPannellum from "react-pannellum";
// import img1 from "./assets/IMG_20240620_103818_00_merged.jpg";

// o que da certo COM REACT PANNELLUM !!!!
// function App() {
//     const config = {
//         // autoRotate: -2,
//         autoLoad: true,
//     };
//     return (
//         <div style={{ width: "100%", height: "500px" }}>
// <ReactPannellum
//     id="1"
//     sceneId="firstScene"
//     // imageSource="https://pannellum.org/images/alma.jpg"
//     imageSource={img1}
//     config={config}
// />
//         </div>
//     );
// }

// O QUE DA CERTO COM REACT-THREE

// extend({ OrbitControls });

// function Controls({ ...props }) {
//     const { camera, gl } = useThree();

//     const ref = useRef();
//     console.log("[PROPS CONTROL]", props, camera, ref.current);
//     useFrame((e) => {
//         // ref.current.update();
//     });

//     return (
//         <orbitControls
//             ref={ref}
//             target={[0, 0, 0]}
//             maxDistance={500.0}
//             minDistance={-500.0}
//             {...props}
//             args={[camera, gl.domElement]}
//         />
//     );
// }

// function Dome() {
//     const texture = useLoader(THREE.TextureLoader, img1);
//     return (
//         <mesh>
//             <sphereBufferGeometry attach="geometry" args={[500, 60, 40]} />
//             <meshBasicMaterial
//                 attach="material"
//                 map={texture}
//                 side={THREE.BackSide}
//             />
//         </mesh>
//     );
// }

// function App() {
//     const [cameraState, setCameraState] = useState(null);
//     return (
//         <div style={{ height: "100vh", width: "100vw", display: "flex" }}>
//             <div style={{ height: "100%", width: "50%" }}>
//                 <Canvas
//                     camera={{
//                         position: [0, 0, 500],
//                     }}
//                 >
//                     <Controls
//                         enableZoom={true}
//                         enablePan={true}
//                         enableDamping
//                         dampingFactor={0.2}
//                         rotateSpeed={-0.5}
//                     />
//                     <Suspense fallback={null}>
//                         <Dome />
//                     </Suspense>
//                 </Canvas>
//             </div>
//             <div
//                 style={{
//                     height: "100%",
//                     width: "50%",
//                     backgroundColor: "white",
//                 }}
//             >
//                 <Canvas
//                     camera={{
//                         position: [0, 0, 500],
//                     }}
//                 >
//                     <Controls
//                         enableZoom={true}
//                         enablePan={true}
//                         enableDamping
//                         dampingFactor={0.2}
//                         rotateSpeed={-0.5}
//                     />
//                     <Suspense fallback={null}>
//                         <Dome />
//                     </Suspense>
//                 </Canvas>
//             </div>
//         </div>
//     );
// }

// O QUE DA CERTO COM REACT-THREE CAMERA SOMENTE DA ESQUERDA SINCRONIZADA COM A DIREITA

// extend({ OrbitControls });

// function useSharedCamera() {
//     const [cameraState, setCameraState] = useState({
//         position: [0, 0, 500],
//         rotation: [0, 0, 0],
//     });

//     const updateCameraState = (newState) => {
//         setCameraState(newState);
//     };

//     return [cameraState, updateCameraState];
// }

// function Controls({ updateCameraState, ...props }) {
//     const { camera, gl } = useThree();
//     const ref = useRef();

//     useFrame(() => {
//         ref.current.update();
//         updateCameraState({
//             position: camera.position.toArray(),
//             rotation: camera.rotation.toArray(),
//         });
//     });

//     return (
//         <orbitControls
//             ref={ref}
//             target={[0, 0, 0]}
//             maxDistance={500.0}
//             minDistance={-500.0}
//             {...props}
//             args={[camera, gl.domElement]}
//         />
//     );
// }

// function Dome() {
//     const texture = useLoader(THREE.TextureLoader, img1);
//     return (
//         <mesh>
//             <sphereBufferGeometry attach="geometry" args={[500, 60, 40]} />
//             <meshBasicMaterial
//                 attach="material"
//                 map={texture}
//                 side={THREE.BackSide}
//             />
//         </mesh>
//     );
// }

// function SynchronizedCanvas({ cameraState, updateCameraState }) {
//     const { camera } = useThree();

//     useEffect(() => {
//         camera.position.fromArray(cameraState.position);
//         camera.rotation.fromArray(cameraState.rotation);
//     }, [camera, cameraState]);

//     return (
//         <>
//             <Controls
//                 enableZoom={true}
//                 enablePan={true}
//                 enableDamping
//                 dampingFactor={0.2}
//                 rotateSpeed={-0.5}
//                 updateCameraState={updateCameraState}
//             />
//             <Suspense fallback={null}>
//                 <Dome />
//             </Suspense>
//         </>
//     );
// }

// function App() {
//     const [cameraState, updateCameraState] = useSharedCamera();

//     return (
// <div style={{ height: "100vh", width: "100vw", display: "flex" }}>
//     <div style={{ height: "100%", width: "50%" }}>
//         <Canvas camera={{ position: [0, 0, 500] }}>
//             <SynchronizedCanvas
//                 cameraState={cameraState}
//                 updateCameraState={updateCameraState}
//             />
//         </Canvas>
//     </div>
//     <div
//         style={{
//             height: "100%",
//             width: "50%",
//             backgroundColor: "white",
//         }}
//     >
//         <Canvas camera={{ position: [0, 0, 500] }}>
//             <SynchronizedCanvas
//                 cameraState={cameraState}
//                 updateCameraState={updateCameraState}
//             />
//         </Canvas>
//     </div>
// </div>
//     );
// }

// function processImages(img1, img2, setResult) {
//     let gray1 = new window.cv.Mat();
//     let gray2 = new window.cv.Mat();
//     window.cv.cvtColor(img1, gray1, window.cv.COLOR_RGBA2GRAY, 0);
//     window.cv.cvtColor(img2, gray2, window.cv.COLOR_RGBA2GRAY, 0);

//     let orb = new window.cv.ORB();
//     let keypoints1 = new window.cv.KeyPointVector();
//     let keypoints2 = new window.cv.KeyPointVector();
//     let descriptors1 = new window.cv.Mat();
//     let descriptors2 = new window.cv.Mat();
//     orb.detectAndCompute(
//         gray1,
//         new window.cv.Mat(),
//         keypoints1,
//         descriptors1
//     );
//     orb.detectAndCompute(
//         gray2,
//         new window.cv.Mat(),
//         keypoints2,
//         descriptors2
//     );

//     let bf = new window.cv.BFMatcher(window.cv.NORM_HAMMING, true);
//     let matches = new window.cv.DMatchVector();
//     bf.match(descriptors1, descriptors2, matches);

//     let points1 = [];
//     let points2 = [];

//     for (let i = 0; i < matches.size(); i++) {
//         let match = matches.get(i);
//         let pt1 = keypoints1.get(match.queryIdx).pt;
//         let pt2 = keypoints2.get(match.trainIdx).pt;

//         points1.push([pt1.x, pt1.y]);
//         points2.push([pt2.x, pt2.y]);
//     }

//     // Calcula o deslocamento médio em X entre pontos correspondentes
//     let deltaX = 0;

//     for (let i = 0; i < points1.length; i++) {
//         deltaX += points2[i][0] - points1[i][0]; // diferença horizontal (X)
//     }

//     deltaX /= points1.length; // média da diferença horizontal

//     // Calcula o yaw offset
//     // const canvas = document
//     //     .getElementById("canvasOutput")
//     //     .getBoundingClientRect();
//     // let yawOffset = (deltaX * 360) / canvas.width; // Converte diferença de pixel para ângulo

//     let yawOff = (deltaX * 360) / (img1.cols / 2);
//     console.log("[ACHOU DELTAX]", deltaX, img1, img2, yawOff);

//     setResult(yawOff);

//     gray1.delete();
//     gray2.delete();
//     descriptors1.delete();
//     descriptors2.delete();
//     keypoints1.delete();
//     keypoints2.delete();
//     matches.delete();
//     orb.delete();
//     bf.delete();
// }
