export type BattleStats = {
    hp: number;
    atk: number;
    def: number;
    spd: number;
};

export interface Pokemon {
    name: string;
    id: number;
    type: string[];
    image: string;
    battleStats: BattleStats;
    isFav: boolean;
    description: string;
    height: number;
    weight: number;
}

export const TYPE_COLORS: Record<string, string> = {
    grass: '#6AB04C',
    fire: '#E84329',
    water: '#3D7DCA',
    bug: '#8CB820',
    normal: '#A8A878',
    poison: '#A33EA1',
    electric: '#F7D02C',
    ground: '#E2BF65',
    fairy: '#D685AD',
    fighting: '#C43028',
    psychic: '#F85888',
    rock: '#B8A038',
    ghost: '#735797',
    ice: '#96D9D6',
    dragon: '#5B2FD4',
    dark: '#4A3B30',
    steel: '#9EA0B0',
    flying: '#8878D4',
};

export const TYPE_COLORS_DESATURATED: Record<string, string> = {
    grass: '#BAC9C5',
    fire: '#CDB3B3',
    water: '#B7C3CF',
    bug: '#C0C2B4',
    normal: '#BEBEB6',
    poison: '#C2B1C2',
    electric: '#D1CAB6',
    ground: '#C9C3B3',
    fairy: '#CDB9BE',
    fighting: '#C4A9A8',
    psychic: '#C9B2BC',
    rock: '#C2BEAE',
    ghost: '#B6B0C0',
    ice: '#B9C5C5',
    dragon: '#B9B0C8',
    dark: '#B5B1AE',
    steel: '#BDBDC0',
    flying: '#BDB6C8',
};