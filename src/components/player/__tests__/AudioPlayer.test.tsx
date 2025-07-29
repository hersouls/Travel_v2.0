import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AudioPlayer } from '../AudioPlayer';
import { Track } from '@/types';

// Mock child components
jest.mock('../PlayerControls', () => ({
  PlayerControls: ({ onTogglePlay, onPrevious, onNext }: any) => (
    <div data-testid="player-controls">
      <button onClick={onTogglePlay} data-testid="toggle-play">Play/Pause</button>
      <button onClick={onPrevious} data-testid="previous">Previous</button>
      <button onClick={onNext} data-testid="next">Next</button>
    </div>
  ),
}));

jest.mock('../ProgressBar', () => ({
  ProgressBar: ({ onSeek }: any) => (
    <div data-testid="progress-bar">
      <input 
        type="range" 
        onChange={(e) => onSeek(Number(e.target.value))}
        data-testid="seek-input"
      />
    </div>
  ),
}));

jest.mock('../VolumeControl', () => ({
  VolumeControl: ({ onVolumeChange }: any) => (
    <div data-testid="volume-control">
      <input 
        type="range" 
        onChange={(e) => onVolumeChange(Number(e.target.value))}
        data-testid="volume-input"
      />
    </div>
  ),
}));

jest.mock('../TrackInfo', () => ({
  TrackInfo: ({ track }: any) => (
    <div data-testid="track-info">
      <h3>{track.title}</h3>
      <p>{track.artist}</p>
    </div>
  ),
}));

const mockTrack: Track = {
  id: '1',
  title: 'Test Song',
  artist: 'Test Artist',
  album: 'Test Album',
  duration: 180,
  cover: '/covers/test.jpg',
  audio: '/music/test.mp3',
  lyrics: [],
  interpretation: 'Test interpretation',
  syncLines: [],
};

const defaultProps = {
  isPlaying: false,
  currentTime: 0,
  duration: 180,
  volume: 0.5,
  repeatMode: 'none' as const,
  isShuffled: false,
  currentTrack: mockTrack,
  onTogglePlay: jest.fn(),
  onSeek: jest.fn(),
  onVolumeChange: jest.fn(),
  onPrevious: jest.fn(),
  onNext: jest.fn(),
  onToggleRepeat: jest.fn(),
  onToggleShuffle: jest.fn(),
  className: 'test-class',
};

describe('AudioPlayer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<AudioPlayer {...defaultProps} />);
    expect(screen.getByTestId('track-info')).toBeInTheDocument();
    expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
    expect(screen.getByTestId('volume-control')).toBeInTheDocument();
    expect(screen.getByTestId('player-controls')).toBeInTheDocument();
  });

  it('displays track information correctly', () => {
    render(<AudioPlayer {...defaultProps} />);
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
  });

  it('calls onTogglePlay when play button is clicked', () => {
    render(<AudioPlayer {...defaultProps} />);
    fireEvent.click(screen.getByTestId('toggle-play'));
    expect(defaultProps.onTogglePlay).toHaveBeenCalledTimes(1);
  });

  it('calls onPrevious when previous button is clicked', () => {
    render(<AudioPlayer {...defaultProps} />);
    fireEvent.click(screen.getByTestId('previous'));
    expect(defaultProps.onPrevious).toHaveBeenCalledTimes(1);
  });

  it('calls onNext when next button is clicked', () => {
    render(<AudioPlayer {...defaultProps} />);
    fireEvent.click(screen.getByTestId('next'));
    expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
  });

  it('calls onSeek when progress bar is changed', () => {
    render(<AudioPlayer {...defaultProps} />);
    const seekInput = screen.getByTestId('seek-input');
    fireEvent.change(seekInput, { target: { value: '90' } });
    expect(defaultProps.onSeek).toHaveBeenCalledWith(90);
  });

  it('calls onVolumeChange when volume control is changed', () => {
    render(<AudioPlayer {...defaultProps} />);
    const volumeInput = screen.getByTestId('volume-input');
    fireEvent.change(volumeInput, { target: { value: '0.8' } });
    expect(defaultProps.onVolumeChange).toHaveBeenCalledWith(0.8);
  });

  it('applies custom className', () => {
    render(<AudioPlayer {...defaultProps} />);
    const playerContainer = screen.getByTestId('track-info').closest('div')?.parentElement;
    expect(playerContainer).toHaveClass('test-class');
  });

  it('returns null when no currentTrack is provided', () => {
    const { container } = render(
      <AudioPlayer {...defaultProps} currentTrack={undefined} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders with different playing states', () => {
    const { rerender } = render(<AudioPlayer {...defaultProps} />);
    expect(screen.getByTestId('player-controls')).toBeInTheDocument();

    rerender(<AudioPlayer {...defaultProps} isPlaying={true} />);
    expect(screen.getByTestId('player-controls')).toBeInTheDocument();
  });

  it('handles different repeat modes', () => {
    const { rerender } = render(<AudioPlayer {...defaultProps} />);
    expect(screen.getByTestId('player-controls')).toBeInTheDocument();

    rerender(<AudioPlayer {...defaultProps} repeatMode="one" />);
    expect(screen.getByTestId('player-controls')).toBeInTheDocument();

    rerender(<AudioPlayer {...defaultProps} repeatMode="all" />);
    expect(screen.getByTestId('player-controls')).toBeInTheDocument();
  });

  it('handles shuffled state', () => {
    const { rerender } = render(<AudioPlayer {...defaultProps} />);
    expect(screen.getByTestId('player-controls')).toBeInTheDocument();

    rerender(<AudioPlayer {...defaultProps} isShuffled={true} />);
    expect(screen.getByTestId('player-controls')).toBeInTheDocument();
  });
});