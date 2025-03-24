export interface Pairing{
    secondary:string;
    reason:string;
    tags:string[];
}
export interface FavoritePairing {
  primary: string;
  secondary: string;
  tags: string[];
};
export interface FontPairing{
    primary:string;
    pairings:Pairing[]
}