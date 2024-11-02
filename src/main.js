// Set up the scene, camera, and renderer
const canvas = document.getElementById('c');
const container = document.querySelector('.about-col-1'); // Get the container where the canvas is placed

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Soft white light
scene.add(ambientLight);

// Create a directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 3); // White light with intensity 1
directionalLight.position.set(7, 7, 7); // Set the position of the light

// Add the light to the scene
scene.add(directionalLight);

// Add a hemisphere light for ambient gradient
const hemisphereLight = new THREE.HemisphereLight(0x443333, 0x111122, 8); // Sky color, ground color, intensity
scene.add(hemisphereLight);

// Optional: Add a helper to visualize the light direction (for debugging)
const helper = new THREE.DirectionalLightHelper(directionalLight, 1);
scene.add(helper);

// Load the GLTF model
const loader = new THREE.GLTFLoader();
let model; // Declare model variable in the outer scope

loader.load(
  'Assets/3D Model/scene.gltf', // Path to your GLTF file
  function (gltf) {
    console.log('Model loaded successfully');
    const model = gltf.scene;  // Assign loaded model to the variable

     // Adjust model's position and scale
     model.position.set(0, -8, 0); // Move model slightly down for visibility
     model.scale.set(0.5, 0.5, 0.5); // Increase the size of the model 
    
    // Updated model bounding box size and position logs
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    console.log('Updated model bounding box size:', size);
    console.log('Updated model bounding box center:', center);
    // Log final model position and scale
    console.log('Updated model position:', model.position);
    console.log('Updated model scale:', model.scale);
    console.log(directionalLight.parent); // This will show where the light is currently attached.
    console.log(scene);

    if (directionalLight.parent === model) {
      console.log("The light is a child of the model.");
    } else {
      console.log("The light is NOT a child of the model.");  
    }

    // Add model and set rotation to see it better
    scene.add(model);
    
    // Set the initial rotation offset (in radians)
    const initialOffset = Math.PI / 7.65; // Example: 30 degrees offset
    model.rotation.y = initialOffset; // Apply the initial offset to the Earth model

  // Set camera position and direction
    camera.position.set(0, 0, 850); // Set the camera's position further back
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // Ensure the camera is facing the model

    // Log camera details
    console.log('Camera position:', camera.position);
    console.log('Camera direction:', camera.getWorldDirection(new THREE.Vector3()));

    // Animation loop to rotate model
    function animateModel() {
      model.rotation.y += 0.001; // Continuously rotate model for visibility check
      requestAnimationFrame(animateModel);
    }
    animateModel();
  },
  undefined,
  function (error) {
    console.error('An error occurred while loading the GLTF model:', error);
  }
);

// Set up OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableRotate = true;
controls.enableZoom = false;
controls.enablePan = false;
controls.minPolarAngle = Math.PI / 2; // Lock vertical rotation
controls.maxPolarAngle = Math.PI / 2; // Lock vertical rotation

// Animation loop to render the scene
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

   // Update Earth's rotation and lighting position
   if (model) { // Check if earth is defined before accessing
    model.rotation.y += 0.001; // Slight rotation for visualization
    updateLightPosition(); // Update light based on Earth's rotation
}

controls.update(); // Update controls
renderer.render(scene, camera);

animate();

// Handle window resizing
window.addEventListener('resize', () => {
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Update renderer size and camera aspect ratio
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
