export type FontPairing = {
  primary: string
  pairings: {
    secondary: string
    reason: string
    tags: string[]
  }[]
}

export const fontPairings: FontPairing[] = [
  {
    primary: "Roboto",
    pairings: [
      {
        secondary: "Lora",
        reason:
          "Roboto's clean, geometric sans-serif pairs well with Lora's elegant serif details, creating a balanced contrast while maintaining readability.",
        tags: ["professional", "modern", "readable"],
      },
      {
        secondary: "Playfair Display",
        reason:
          "The neutral character of Roboto complements the dramatic serifs of Playfair Display, creating a sophisticated pairing with strong visual hierarchy.",
        tags: ["elegant", "contrast", "sophisticated"],
      },
      {
        secondary: "Open Sans",
        reason:
          "Both fonts share similar geometric principles while offering subtle differences in character, creating a harmonious pairing for clean, modern designs.",
        tags: ["clean", "minimal", "versatile"],
      },
      {
        secondary: "Merriweather",
        reason:
          "Roboto's straightforward style balances Merriweather's more traditional serif characteristics, making content both approachable and authoritative.",
        tags: ["readable", "traditional", "balanced"],
      },
    ],
  },
  {
    primary: "Montserrat",
    pairings: [
      {
        secondary: "Merriweather",
        reason:
          "Montserrat's geometric sans-serif forms create an excellent contrast with Merriweather's traditional serif details, offering both modernity and readability.",
        tags: ["balanced", "readable", "professional"],
      },
      {
        secondary: "Roboto",
        reason:
          "Both fonts have a clean, modern aesthetic while offering enough distinction to create visual hierarchy without clashing.",
        tags: ["modern", "clean", "versatile"],
      },
      {
        secondary: "Lora",
        reason:
          "Montserrat's bold, geometric character pairs beautifully with Lora's more fluid, serif style, creating an elegant contrast.",
        tags: ["elegant", "contrast", "refined"],
      },
      {
        secondary: "Open Sans",
        reason:
          "The combination offers a clean, contemporary look with excellent readability, making it perfect for both print and digital applications.",
        tags: ["contemporary", "readable", "versatile"],
      },
    ],
  },
  {
    primary: "Playfair Display",
    pairings: [
      {
        secondary: "Source Sans Pro",
        reason:
          "The dramatic serifs of Playfair Display contrast perfectly with Source Sans Pro's clean lines, creating an elegant and highly readable combination.",
        tags: ["elegant", "readable", "classic"],
      },
      {
        secondary: "Raleway",
        reason:
          "Raleway's thin, modern character complements the classic elegance of Playfair Display, creating a sophisticated and contemporary pairing.",
        tags: ["sophisticated", "modern", "stylish"],
      },
      {
        secondary: "Open Sans",
        reason:
          "Open Sans provides a neutral, highly readable companion to Playfair Display's more decorative qualities, balancing style with function.",
        tags: ["balanced", "functional", "versatile"],
      },
      {
        secondary: "Lato",
        reason:
          "Lato's warm, stable character grounds Playfair Display's more dramatic elements, creating a pairing that's both distinctive and approachable.",
        tags: ["approachable", "warm", "balanced"],
      },
    ],
  },
  {
    primary: "Open Sans",
    pairings: [
      {
        secondary: "Lora",
        reason:
          "Open Sans' clean, humanist sans-serif forms pair beautifully with Lora's more calligraphic serif qualities, creating a readable yet elegant combination.",
        tags: ["readable", "elegant", "versatile"],
      },
      {
        secondary: "Roboto Slab",
        reason:
          "The combination offers excellent readability with just enough contrast between the humanist sans-serif and the geometric slab serif.",
        tags: ["readable", "structured", "modern"],
      },
      {
        secondary: "Playfair Display",
        reason:
          "Open Sans provides a neutral, highly readable base that allows Playfair Display's more decorative qualities to shine in headings.",
        tags: ["contrast", "decorative", "balanced"],
      },
      {
        secondary: "Merriweather",
        reason:
          "Both fonts prioritize readability while offering enough stylistic difference to create clear visual hierarchy in designs.",
        tags: ["readable", "professional", "clear"],
      },
    ],
  },
  {
    primary: "Lato",
    pairings: [
      {
        secondary: "Merriweather",
        reason:
          "Lato's warm, stable character pairs excellently with Merriweather's more structured serif design, creating a highly readable combination with personality.",
        tags: ["warm", "readable", "structured"],
      },
      {
        secondary: "Roboto Slab",
        reason:
          "The combination offers a contemporary feel with excellent contrast between Lato's rounded sans-serif and Roboto Slab's geometric qualities.",
        tags: ["contemporary", "contrast", "clean"],
      },
      {
        secondary: "Playfair Display",
        reason:
          "Lato's understated elegance allows Playfair Display's more dramatic qualities to shine while maintaining overall balance in the design.",
        tags: ["elegant", "dramatic", "balanced"],
      },
      {
        secondary: "Bree Serif",
        reason:
          "Lato's friendly character complements Bree Serif's personable slab serif design, creating an approachable yet professional pairing.",
        tags: ["friendly", "approachable", "professional"],
      },
    ],
  },
  {
    primary: "Oswald",
    pairings: [
      {
        secondary: "Quattrocento",
        reason:
          "Oswald's condensed, bold character creates a striking contrast with Quattrocento's more traditional serif design, perfect for editorial layouts.",
        tags: ["editorial", "striking", "contrast"],
      },
      {
        secondary: "Open Sans",
        reason:
          "Open Sans provides a neutral, highly readable companion to Oswald's more distinctive condensed style, balancing impact with clarity.",
        tags: ["balanced", "readable", "impactful"],
      },
      {
        secondary: "Lora",
        reason:
          "The combination creates a dynamic contrast between Oswald's geometric, condensed forms and Lora's more organic serif qualities.",
        tags: ["dynamic", "contrast", "organic"],
      },
      {
        secondary: "Roboto",
        reason:
          "Both fonts share geometric principles while offering distinct personalities, creating a pairing that's cohesive yet varied.",
        tags: ["cohesive", "geometric", "modern"],
      },
    ],
  },
  {
    primary: "Merriweather",
    pairings: [
      {
        secondary: "Montserrat",
        reason:
          "Merriweather's traditional serif details pair beautifully with Montserrat's geometric sans-serif forms, creating a classic-meets-modern aesthetic.",
        tags: ["classic", "modern", "balanced"],
      },
      {
        secondary: "Open Sans",
        reason:
          "Both fonts prioritize readability while offering enough stylistic difference to create clear visual hierarchy in designs.",
        tags: ["readable", "clear", "professional"],
      },
      {
        secondary: "Roboto",
        reason:
          "Merriweather's more traditional serif characteristics balance Roboto's straightforward style, making content both approachable and authoritative.",
        tags: ["balanced", "authoritative", "approachable"],
      },
      {
        secondary: "Source Sans Pro",
        reason:
          "The combination offers excellent readability with a professional, timeless quality suitable for both digital and print applications.",
        tags: ["readable", "professional", "timeless"],
      },
    ],
  },
  {
    primary: "Raleway",
    pairings: [
      {
        secondary: "Merriweather",
        reason:
          "Raleway's elegant, thin character contrasts beautifully with Merriweather's more substantial serif forms, creating a sophisticated pairing.",
        tags: ["elegant", "sophisticated", "contrast"],
      },
      {
        secondary: "Lora",
        reason:
          "The combination balances Raleway's geometric qualities with Lora's more organic serif forms, creating a pairing that's both modern and timeless.",
        tags: ["balanced", "modern", "timeless"],
      },
      {
        secondary: "Roboto",
        reason:
          "Roboto provides a neutral, highly readable companion to Raleway's more distinctive thin character, ensuring functionality alongside style.",
        tags: ["functional", "readable", "stylish"],
      },
      {
        secondary: "Open Sans",
        reason:
          "Both fonts share a clean, contemporary aesthetic while offering enough distinction to create visual hierarchy without clashing.",
        tags: ["clean", "contemporary", "harmonious"],
      },
    ],
  },
  {
    primary: "Poppins",
    pairings: [
      {
        secondary: "Playfair Display",
        reason:
          "Poppins' geometric, friendly character creates an excellent contrast with Playfair Display's more dramatic serif qualities.",
        tags: ["friendly", "dramatic", "contrast"],
      },
      {
        secondary: "Lora",
        reason:
          "The combination balances Poppins' modern, geometric forms with Lora's more traditional serif details, creating a pairing that's both contemporary and elegant.",
        tags: ["balanced", "elegant", "contemporary"],
      },
      {
        secondary: "Roboto",
        reason:
          "Both fonts share geometric principles while offering distinct personalities, creating a pairing that's cohesive yet varied.",
        tags: ["cohesive", "geometric", "varied"],
      },
      {
        secondary: "Source Serif Pro",
        reason:
          "Poppins' friendly roundness pairs well with Source Serif Pro's more structured serif design, creating a combination that's both approachable and professional.",
        tags: ["approachable", "professional", "structured"],
      },
    ],
  },
  {
    primary: "Nunito",
    pairings: [
      {
        secondary: "Merriweather",
        reason:
          "Nunito's rounded, friendly character creates a pleasing contrast with Merriweather's more structured serif design.",
        tags: ["friendly", "structured", "contrast"],
      },
      {
        secondary: "Playfair Display",
        reason:
          "The combination balances Nunito's approachable roundness with Playfair Display's more dramatic serif qualities, perfect for designs that need to be both welcoming and sophisticated.",
        tags: ["approachable", "sophisticated", "balanced"],
      },
      {
        secondary: "Roboto Slab",
        reason:
          "Nunito's soft, rounded forms pair well with Roboto Slab's more geometric slab serif design, creating a combination that's both friendly and substantial.",
        tags: ["friendly", "substantial", "geometric"],
      },
      {
        secondary: "Lora",
        reason:
          "The pairing offers a balance of Nunito's modern, rounded character with Lora's more traditional serif details, creating a design that's both contemporary and timeless.",
        tags: ["balanced", "contemporary", "timeless"],
      },
    ],
  },
]

