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
}

