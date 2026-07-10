import { renderHook, act } from '@testing-library/react-native';
import { useMapMarkers } from '@/hooks/useMapMarkers';
import { useFavPokemon } from '@/hooks/useFavPokemon';

jest.mock('@/hooks/useFavPokemon', () => ({
  useFavPokemon: jest.fn(),
}));

describe('useMapMarkers', () => {
  const mockFavPokemon = { name: 'pikachu', url: '...' };

  beforeEach(() => {
    jest.clearAllMocks();
    (useFavPokemon as jest.Mock).mockReturnValue({
      favPokemon: mockFavPokemon,
    });
  });

  it('should start with empty markers and null selections', async () => {
    const { result } = await renderHook(() => useMapMarkers());

    expect(result.current.markers).toEqual([]);
    expect(result.current.selectedPokemon).toBeNull();
  });

  it('should create a marker on long press when favPokemon is set', async () => {
    const { result } = await renderHook(() => useMapMarkers());

    const mockCoordinate = { latitude: 10, longitude: 20 };
    const mockEvent = { nativeEvent: { coordinate: mockCoordinate } } as any;

    await act(async () => {
      result.current.createMarker(mockEvent);
    });

    expect(result.current.markers).toEqual([
      { coordinate: mockCoordinate, pokemon: mockFavPokemon },
    ]);
  });

  it('should not create a marker if favPokemon is null', async () => {
    (useFavPokemon as jest.Mock).mockReturnValue({ favPokemon: null });
    const { result } = await renderHook(() => useMapMarkers());

    const mockCoordinate = { latitude: 10, longitude: 20 };
    const mockEvent = { nativeEvent: { coordinate: mockCoordinate } } as any;

    await act(async () => {
      result.current.createMarker(mockEvent);
    });

    expect(result.current.markers).toEqual([]);
  });

  it('should select a marker', async () => {
    const { result } = await renderHook(() => useMapMarkers());
    const mockPokemon = { name: 'bulbasaur', url: '...' };

    await act(async () => {
      result.current.selectMarker(0, mockPokemon as any);
    });

    expect(result.current.selectedPokemon).toEqual(mockPokemon);
  });

  it('should deselect a marker', async () => {
    const { result } = await renderHook(() => useMapMarkers());
    const mockPokemon = { name: 'bulbasaur', url: '...' };

    await act(async () => {
      result.current.selectMarker(0, mockPokemon as any);
    });
    
    expect(result.current.selectedPokemon).toEqual(mockPokemon);

    await act(async () => {
      result.current.deselectMarker();
    });

    expect(result.current.selectedPokemon).toBeNull();
  });

  it('should remove the selected marker', async () => {
    const { result } = await renderHook(() => useMapMarkers());

    const mockCoordinate = { latitude: 10, longitude: 20 };
    const mockEvent = { nativeEvent: { coordinate: mockCoordinate } } as any;

    await act(async () => {
      result.current.createMarker(mockEvent);
    });

    expect(result.current.markers.length).toBe(1);

    await act(async () => {
      result.current.selectMarker(0, mockFavPokemon as any);
    });

    await act(async () => {
      result.current.removeSelectedMarker();
    });

    expect(result.current.markers).toEqual([]);
    expect(result.current.selectedPokemon).toBeNull();
  });
  
  it('should not remove a marker if none is selected', async () => {
    const { result } = await renderHook(() => useMapMarkers());

    const mockCoordinate = { latitude: 10, longitude: 20 };
    const mockEvent = { nativeEvent: { coordinate: mockCoordinate } } as any;

    await act(async () => {
      result.current.createMarker(mockEvent);
    });

    expect(result.current.markers.length).toBe(1);

    await act(async () => {
      result.current.removeSelectedMarker();
    });

    expect(result.current.markers.length).toBe(1);
  });
});
