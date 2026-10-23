// import { useAudioPlayer } from "../hooks/useAudioPlayer";
// import { selectedMpdUrlState } from "../state/mpdUrls";
import type { RadioStream } from "../types/types";
// import { useRecoilState } from "recoil";

export const playStream = async (stream: RadioStream, radioMode: string) : Promise<void> => {
  // const { play } = useAudioPlayer();
  // const [selectedUrl] = useRecoilState(selectedMpdUrlState);

  // Implementation for playing the stream
  try {
    if (radioMode === "local") {
      // await play(stream.url);
    } else if (radioMode === "mpd") {
      // setActStreamState(stream.name);
      const selectedUrl = "https://musicpi.tkk.home64.de/player"; // Replace with actual selected URL
      await fetch(`${selectedUrl}/playsong?name=${stream.url}`, {
        method: "GET",
      });
    }
  } catch (error) {
    console.log("Error handling play press:", error);
  }
};
