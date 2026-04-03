// src/api/speechApi.js

export const sendAudio = async (blob) => {
  const formData = new FormData();
  formData.append("audio", blob, "audio.webm");

  try {
    // Note: Using the exact backend port (5001) instead of 5000 as requested
    // because app.py runs on 5001 in your current setup.
    const res = await fetch("http://localhost:5001/api/speech", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to transcribe audio");
    }

    return await res.json();
  } catch (error) {
    console.error("Speech API Error:", error);
    return { success: false, text: "" };
  }
};
