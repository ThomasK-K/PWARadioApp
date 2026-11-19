// import { useAudioPlayer } from "../hooks/useAudioPlayer";
// import { selectedMpdUrlState } from "../state/mpdUrls";
import type { RadioStream } from "../types/types";


export const playStream = async (track: RadioStream, radioMode: string, selectedUrl: string) : Promise<void> => {
  // const { play } = useAudioPlayer();
  // const [selectedUrl] = useRecoilState(selectedMpdUrlState);

  // Implementation for playing the stream
  try {
    if (radioMode === "local") {
      // await play(stream.url);
    } else if (radioMode === "mpd") {
      // setActStreamState(stream.name);
      // !selectedUrl && throw new Error("Keine URL ausgewählt");
      await fetch(`${selectedUrl}/playuri?uri=${track.url}`, {
        method: "GET",
      });
    }
  } catch (error) {
    console.log("Error handling play press:", error);
  }
};

export const playPlaylist = async (stationName: string,selectedUrl: string) : Promise<void> => {
  try {
    
      await fetch(`${selectedUrl}/playplaylist?name=${stationName}`, {
        method: "GET",
      });
    }
  catch (error) {
    console.log("Error handling play press:", error);
  }
};