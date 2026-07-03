import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen
        name="favourites"
        options={{
          title: 'Favourites',
        }}
      />
      <Tabs.Screen
        name="pokemons"
        options={{
          title: 'Pokedex',
        }}
      />
      <Tabs.Screen
        name="ar-camera"
        options={{
          title: 'AR Camera',
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
        }}
      />
    </Tabs>
  );
}
