import { useState, useEffect, useRef } from 'react';

interface AudioPlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  currentUrl: string | null;
  error: string | null;
}

export function useAudioPlayer(): AudioPlayerState & {
  play: (url: string) => Promise<void>;
  pause: () => void;
  stop: () => void;
} {
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    isLoading: false,
    currentUrl: null,
    error: null,
  });
  
  // Use a ref to keep track of the audio element
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio element on component mount
  useEffect(() => {
    const audio = new Audio();
    
    // Setup event listeners
    audio.addEventListener('playing', () => {
      setState(prev => ({ ...prev, isPlaying: true, isLoading: false, error: '' }));
    });
    
    audio.addEventListener('pause', () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    });
    
    audio.addEventListener('ended', () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    });
    
    // audio.addEventListener('error', (e) => {
    //   console.error('Audio error:', e);
    //   setState(prev => ({ 
    //     ...prev, 
    //     isPlaying: false, 
    //     isLoading: false,
    //     error: 'Fehler beim Abspielen des Streams'
    //   }));
    // });
    
    audio.addEventListener('waiting', () => {
      setState(prev => ({ ...prev, isLoading: true }));
    });
    
    // Save reference to audio element
    audioRef.current = audio;
    
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        
        // Remove all event listeners
        audioRef.current.removeEventListener('playing', () => {});
        audioRef.current.removeEventListener('pause', () => {});
        audioRef.current.removeEventListener('ended', () => {});
        audioRef.current.removeEventListener('error', () => {});
        audioRef.current.removeEventListener('waiting', () => {});
      }
    };
  }, []);
  
  // Play function returning a Promise
  const play = (url: string): Promise<void> => {
    if (!audioRef.current) return Promise.resolve();
    
    // If already playing this URL, just resume
    if (state.currentUrl === url && audioRef.current.paused) {
      return audioRef.current.play()
        .catch(err => {
          setState(prev => ({ ...prev, error: 'Fehler beim Abspielen des Streams' }));
          console.error('Error playing audio:', err);
        });
    }
    
    // New URL, load and play
    setState(prev => ({ ...prev, isLoading: true, currentUrl: url, error: null }));
    audioRef.current.src = url;
    audioRef.current.load();
    return audioRef.current.play()
      .catch(err => {
        setState(prev => ({ ...prev, isLoading: false, error: 'Fehler beim Abspielen des Streams' }));
        console.error('Error playing audio:', err);
      });
  };
  
  // Pause function
  const pause = (): void => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };
  
  // Stop function
  const stop = (): void => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setState(prev => ({ ...prev, isPlaying: false, currentUrl: null }));
    }
  };
  
  return {
    ...state,
    play,
    pause,
    stop
  };
}
