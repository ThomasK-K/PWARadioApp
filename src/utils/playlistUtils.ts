
export const createPlaylist = async (
  selectedUrl: string,
  name: string,
  type: string,
): Promise<void> => {
  try {

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        type: type,
      }),
    };

    await fetch(`${selectedUrl}/createplaylist`, options);
  } catch (error) {
    console.log("Error handling creating playlist: ", error);
  }
};


