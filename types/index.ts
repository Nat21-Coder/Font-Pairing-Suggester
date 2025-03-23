export interface Paring{
    secondary:string;
    reason:string;
    tags:string[];
}
export interface FavoritePairing {
  primary: string;
  secondary: string;
  tags: string[];
};
export interface FontParing{
    primary:string;
    pairings:Paring[]
}