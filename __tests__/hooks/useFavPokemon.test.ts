import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFavPokemon } from '@/hooks/useFavPokemon';
import { usePokemonContext } from '@/context/PokemonContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('@/context/PokemonContext', () => ({
  usePokemonContext: jest.fn(),
}));

describe('useFavPokemon', () => {
  const mockSetFavPokemon = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (usePokemonContext as jest.Mock).mockReturnValue({
      favPokemon: null,
      setFavPokemon: mockSetFavPokemon,
    });
  });

  it('should load favorite pokemon from storage on mount', async () => {
    const mockPokemon = { name: 'pikachu', url: '...' };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockPokemon));

    await renderHook(() => useFavPokemon());

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('fav_pokemon');
      expect(mockSetFavPokemon).toHaveBeenCalledWith(mockPokemon);
    });
  });

  it('should set favPokemon to null if no stored pokemon', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    await renderHook(() => useFavPokemon());

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('fav_pokemon');
      expect(mockSetFavPokemon).toHaveBeenCalledWith(null);
    });
  });

  it('should handle errors gracefully during load', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage Error'));

    await renderHook(() => useFavPokemon());

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('fav_pokemon');
      expect(mockSetFavPokemon).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('should provide reload function that re-fetches from storage', async () => {
    const mockPokemon = { name: 'charmander', url: '...' };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    
    const { result } = await renderHook(() => useFavPokemon());
    
    await waitFor(() => {
      expect(mockSetFavPokemon).toHaveBeenCalledWith(null);
    });

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockPokemon));

    await act(async () => {
      await result.current.reload();
    });

    await waitFor(() => {
      expect(mockSetFavPokemon).toHaveBeenCalledWith(mockPokemon);
      expect(AsyncStorage.getItem).toHaveBeenCalledTimes(2);
    });
  });

  it('should return context favPokemon and setFavPokemon', async () => {
    const mockPokemon = { name: 'bulbasaur', url: '...' };
    (usePokemonContext as jest.Mock).mockReturnValue({
      favPokemon: mockPokemon,
      setFavPokemon: mockSetFavPokemon,
    });
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const { result } = await renderHook(() => useFavPokemon());

    expect(result.current.favPokemon).toEqual(mockPokemon);
    expect(result.current.setFavPokemon).toBe(mockSetFavPokemon);
  });
});
