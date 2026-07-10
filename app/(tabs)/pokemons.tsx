import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { usePokemonList } from '@/hooks/usePokemonList';
import { PokemonCard } from '@/components/pokemonCard';
import { PokemonDetailSheet } from '@/components/pokemonDetailSheet';
import type { Pokemon } from '@/types/pokemon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TitleBar } from '@/components/titleBar';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, useAnimatedScrollHandler, runOnJS, interpolate, Extrapolation } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export default function PokemonsScreen() {
  const { pokemons, fetchMore, updatePokemon, refresh } = usePokemonList();
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Animated values for the updating area
  const refreshHeight = useSharedValue(0);
  const refreshOpacity = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const isPulling = useSharedValue(false);

  const animatedUpdatingStyle = useAnimatedStyle(() => ({
    height: refreshHeight.value,
    opacity: refreshOpacity.value,
  }));

  const triggerRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => { });
    } catch (e) {
      console.warn('Haptics not available', e);
    }
    await Promise.all([
      refresh(),
      new Promise(resolve => setTimeout(resolve, 1000))
    ]);
    setIsRefreshing(false);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const panGesture = Gesture.Pan()
    .onChange((event) => {
      // Allow pulling if at the top and pulling downwards
      if (scrollY.value <= 0 && event.velocityY > 0 && !isRefreshing) {
        isPulling.value = true;
        // Limit height
        const newHeight = Math.min(event.translationY * 0.3, 80);
        refreshHeight.value = newHeight;
        refreshOpacity.value = interpolate(newHeight, [0, 44], [0, 1], Extrapolation.CLAMP);
      }
    })
    .onEnd(() => {
      if (isPulling.value) {
        isPulling.value = false;
        if (refreshHeight.value > 40) {
          runOnJS(triggerRefresh)();
        }
        refreshHeight.value = withTiming(0, { duration: 250 });
        refreshOpacity.value = withTiming(0, { duration: 200 });
      }
    });

  const nativeGesture = Gesture.Native();
  const composedGesture = Gesture.Simultaneous(panGesture, nativeGesture);

  const activePokemon = selectedPokemon
    ? (pokemons.find(p => p.id === selectedPokemon.id) ?? null)
    : null;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <GestureDetector gesture={composedGesture}>
        <Animated.FlatList
          data={pokemons}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          ListHeaderComponent={
            <View style={styles.headerContainer}>
              <TitleBar title={"Pokémon List"} subtitle={"Pokédex"} />

              {/* Animatable Area */}
              <Animated.View style={[styles.updatingArea, animatedUpdatingStyle]}>
                <MaterialIcons name="refresh" size={40} color="#c1211eff" />
              </Animated.View>

              {/* Custom Pill Trigger */}
              <View style={styles.pillWrapper}>
                <Pressable
                  testID="pull-to-refresh-pill"
                  onPress={triggerRefresh}
                  style={({ pressed }) => [
                    styles.pillContainer,
                    pressed && styles.pillPressed,
                    isRefreshing && styles.pillRefreshing,
                  ]}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <ActivityIndicator size="small" color="#c1211eff" style={{ marginRight: 2 }} />
                  ) : (
                    <MaterialIcons name="refresh" size={16} color="#c1211eff" />
                  )}
                  <Text style={styles.pillText}>
                    {isRefreshing ? "Updating..." : "Pull to refresh"}
                  </Text>
                </Pressable>
              </View>
            </View>
          }
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PokemonCard
              pokemon={item}
              onLoaded={updatePokemon}
              onPress={() => setSelectedPokemon(item)}
            />
          )}
          onEndReached={fetchMore}
          onEndReachedThreshold={0.5}
          bounces={false}
          overScrollMode="never"
        />
      </GestureDetector>
      <PokemonDetailSheet
        pokemon={activePokemon}
        onClose={() => setSelectedPokemon(null)}
        onUpdate={updatePokemon}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  headerContainer: {
    backgroundColor: '#f5f5f7',
  },
  updatingArea: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  updatingText: {
    fontFamily: 'Inter-700',
    color: '#c1211eff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pillWrapper: {
    alignItems: 'flex-start',
    marginLeft: 16,
  },
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fbebeb',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  pillPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  pillRefreshing: {
    backgroundColor: '#fbebeb',
  },
  pillText: {
    color: '#cc0000',
    fontFamily: 'Inter-700',
    fontSize: 14,
  },
});

