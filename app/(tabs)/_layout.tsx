import { Tabs } from 'expo-router';
import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true, tabBarActiveTintColor: '#c1211eff', }}>
      <Tabs.Screen
        name="favourites"
        options={{
          headerShown: false,
          title: 'Favourites',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="star" size={size - 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pokemons"
        options={{
          headerShown: false,
          title: 'Pokedex',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="catching-pokemon" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ar-camera"
        options={{
          title: 'AR Camera',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="camera" size={size - 5} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="pokemon-go" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
