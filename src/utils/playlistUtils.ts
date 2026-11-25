export const createPlaylist = async (
  selectedUrl: string,
  name: string,
  type: string,
): Promise<{ ok: boolean; statusText?: string; playlist?: any } | undefined> => {
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

    const response = await fetch(`${selectedUrl}/createplaylist`, options);
    const playlist = await response.json();
    return {
      ok: response.ok && playlist?.success !== false,
      statusText: response.statusText,
      playlist: playlist?.data,
    };
  } catch (error) {
    console.log("Error handling creating playlist: ", error);
  }
};

export const deletePlaylist = async (
  selectedUrl: string,
  uri: string,
): Promise<Response | undefined> => {
  try {
    return await fetch(
      `${selectedUrl}/deleteplaylist?playlisturi=${encodeURIComponent(uri)}`,
    );
  } catch (error) {
    console.log("Error handling deleting  playlist: ", error);
  }
};
