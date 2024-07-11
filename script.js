async function uploadImage() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a file.");
    return;
  }
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("https://api.trace.moe/search", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    displayResult(data);
  } catch (error) {
    console.error("Error uploading image", error);
  }
}

function displayResult(data) {
  const output = document.getElementById("output");
  output.innerHTML = "<h2 class='w-full text-2xl font-bold mb-4'>Result: </h2>"; // Clear previous results and set header
  const filename = [];

  data.result.forEach((element) => {
    const videoUrl = element.video;
    const similarity = (element.similarity * 100).toFixed(2);

    const videoElement = document.createElement("video");
    videoElement.src = videoUrl;
    videoElement.controls = true;
    videoElement.className = "mt-2 w-full";
    const name = element.filename;
    const match = name.match(/\[(.*?)\] (.*?) -/);
    const extractedName = match ? match[2] : name;
    filename.push(extractedName);

    const infoElement = document.createElement("div");
    infoElement.className =
      "p-4 mb-4 bg-white shadow rounded mt-2 flex flex-col md:w-1/3 sm:mx-auto"; // Ensure infoElement is a flex container
    infoElement.innerHTML = `<p class='text-lg font-medium mb-2'>Episode: ${extractedName}, Similarity: ${similarity}%</p>`;
    infoElement.appendChild(videoElement);
    output.appendChild(infoElement);
  });
  const filenamesString = filename.join(" ");
  console.log(filenamesString);
}
