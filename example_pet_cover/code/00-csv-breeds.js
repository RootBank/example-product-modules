// Original template pricing sheet:
// https://docs.google.com/spreadsheets/d/1YJ3udHa0tXLOcXk54HzdW9ppx1yfg0DE/edit

const csvBreeds = `
Species,Breed,Breed code,CTM Mixed Breed
Dog,Mixed Breed Dog - Giant (> 90 lbs),D10,
Dog,Mixed Breed Dog - Large (over 20kg),D6,Large over 20kg
Dog,Mixed Breed Dog - Medium (10-20kg),D3,Medium 10-20kg
Dog,Mixed Breed Dog - Small (up to 10kg),D2,Small up to 10kg
Dog,Mixed Breed Dog - Toy (< 10 lbs),D1,
Dog,Mixed Breed Dog - Unknown,D3,
Dog,Affenpinscher,D3,
Dog,Afghan Hound,D10,
Dog,Airedale Terrier,D10,
Dog,Akita,D11,
Dog,Alapaha Blue Blood Bulldog,D8,
Dog,Alaskan Klee Kai,D4,
Dog,Alaskan Malamute,D8,
Dog,Alpine Dachsbracke,D6,
Dog,American Bandogge Mastiff,D13,
Dog,American Bulldog,D10,
Dog,American Cocker Spaniel,D8,
Dog,American English Coonhound,D10,
Dog,American Eskimo Dog,D4,
Dog,American Foxhound,D11,
Dog,American Hairless Terrier,D3,
Dog,American Leopard Hound,D3,
Dog,American Mastiff,D12,
Dog,American Pit Bull Terrier,D9,
Dog,American Staffordshire Terrier,D10,
Dog,American Water Spaniel,D8,
Dog,American White Shepherd,D11,
Dog,Anatolian Shepherd Dog,D11,
Dog,Appenzeller Sennenhund,D6,
Dog,Argentine Dogo,D11,
Dog,Australian Cattle Dog,D8,
Dog,Australian Kelpie,D7,
Dog,Australian Shepherd,D7,
Dog,Australian Terrier,D5,
Dog,Azawakh,D10,
Dog,Bagle,D8,
Dog,Barbet,D3,
Dog,Basenji,D5,
Dog,Basset Fauve de Bretagne,D3,
Dog,Basset Hound,D12,
Dog,Beabull,D11,
Dog,Beagle,D8,
Dog,Bearded Collie,D7,
Dog,Beauceron,D11,
Dog,Bedlington Terrier,D6,
Dog,Belgian Laekenois,D8,
Dog,Belgian Malinois,D8,
Dog,Belgian Sheepdog,D10,
Dog,Belgian Shepherd,D10,
Dog,Belgian Tervuren,D8,
Dog,Bergamasco,D6,
Dog,Berger De Picard,D8,
Dog,Bernese Mix,D13,
Dog,Bernese Mountain Dog,D13,
Dog,Bichon Frise,D4,
Dog,Bichpoo,D2,
Dog,Biewer,D2,
Dog,Black and Tan Coonhound,D11,
Dog,Black Mouth Cur,D8,
Dog,Black Russian Terrier,D12,
Dog,Bloodhound,D11,
Dog,Blue Lacy,D4,
Dog,Blue Picardy Spaniel,D6,
Dog,Bluetick Coonhound,D10,
Dog,Boerboel,D13,
Dog,Bolognese,D3,
Dog,Border Collie,D5,
Dog,Border Terrier,D4,
Dog,Borzoi,D13,
Dog,Boston Terrier,D4,
Dog,Bouvier Des Flandres,D11,
Dog,Boxer,D10,
Dog,Boxer Mix,D8,
Dog,Boykin Spaniel,D5,
Dog,Bracco Italiano,D10,
Dog,Braque Francais,D8,
Dog,Briard,D11,
Dog,Brittany,D5,
Dog,Broholmer,D6,
Dog,Brussels Griffon,D3,
Dog,Bull Terrier,D10,
Dog,Bulldog,D12,
Dog,Bulldog Mix,D12,
Dog,Bullmastiff,D13,
Dog,Cairn Terrier,D4,
Dog,Canaan Dog,D3,
Dog,Cane Corso,D11,
Dog,Cardigan Welsh Corgi,D8,
Dog,Catahoula Leopard Dog,D10,
Dog,Caucasian Mountain Dog,D13,
Dog,Cavachon,D8,
Dog,Cavalier King Charles Spaniel,D7,
Dog,Cavapoo,D8,
Dog,Central Asian Shepherd Dog,D11,
Dog,English Toy Terrier,D3,
Dog,Entlebucher Mountain Dog,D10,
Dog,Entlebucher Mountain Dog,D10,
Dog,Estrela Mountain Dog,D8,
Dog,Estrela Mountain Dog,D8,
Dog,Eurasier,D3,
Dog,Eurasier,D3,
Dog,Feist,D8,
Dog,Feist,D8,
Dog,Field Spaniel,D10,
Dog,Fila Brasileiro,D13,
Dog,Finnish Lapphund,D8,
Dog,Finnish Spitz,D8,
Dog,Flat-Coated Retriever,D12,
Dog,French Bulldog,D12,
Dog,French Spaniel,D11,
Dog,Frenchie Pug,D7,
Dog,German Longhaired Pointer,D3,
Dog,German Pinscher,D8,
Dog,German Shepherd,D9,
Dog,German Shorthaired Pointer,D8,
Dog,German Spitz,D4,
Dog,German Wirehaired Pointer,D8,
Dog,Giant Schnauzer,D11,
Dog,Glen of Imaal Terrier,D10,
Dog,Goldador,D6,
Dog,Golden Retriever,D9,
Dog,Goldendoodle,D5,
Dog,Gordon Setter,D11,
Dog,Grand Basset Griffon Vendéen,D8,
Dog,Grand Bleu de Gascoigne,D6,
Dog,Great Dane,D13,
Dog,Great Dane Mix,D13,
Dog,Great Pyrenees,D11,
Dog,Greater Swiss Mountain Dog,D13,
Dog,Greyhound,D10,
Dog,Hamiltonstovare,D3,
Dog,Harrier,D11,
Dog,Havanese,D3,
Dog,Havashu,D2,
Dog,Hovawart,D9,
Dog,Ibizan Hound,D10,
Dog,Icelandic Sheepdog,D3,
Dog,Irish Red and White Setter,D10,
Dog,Irish Setter,D8,
Dog,Irish Terrier,D5,
Dog,Irish Water Spaniel,D11,
Dog,Irish Wolfhound,D13,
Dog,Italian Greyhound,D3,
Dog,Jack Russell Terrier,D2,
Dog,Jagdterrier,D3,
Dog,Morkie,D1,
Dog,Mountain Cur,D8,
Dog,Mountain Dog Mix,D9,
Dog,Mudi,D3,
Dog,Münsterländer,D9,
Dog,Native American Indian Dog,D4,
Dog,Neapolitan Mastiff,D13,
Dog,Nederlandse Kooikerhondje,D3,
Dog,Newfoundland,D13,
Dog,Newfoundland Mix,D13,
Dog,Norfolk Terrier,D4,
Dog,Norrbottenspets,D3,
Dog,North American Shepherd,D3,
Dog,Norwegian Buhund,D6,
Dog,Norwegian Elkhound,D8,
Dog,Norwegian Lundehund,D6,
Dog,Norwich Terrier,D5,
Dog,Nova Scotia Duck Tolling Retriever,D8,
Dog,Old English Sheepdog,D11,
Dog,Olde English Bulldogge,D11,
Dog,Other Dog,D3,
Dog,Other Hybrid Dog,D3,
Dog,Other Purebred Dog,D4,
Dog,Otterhound,D11,
Dog,Papillon,D2,
Dog,Parson Russell Terrier,D4,
Dog,Patterdale Terrier,D8,
Dog,Peekapoo,D3,
Dog,Pekingese,D6,
Dog,Pembroke Welsh Corgi,D8,
Dog,Perro De Presa Canario,D13,
Dog,Peruvian Inca Orchid,D6,
Dog,Petit Basset Griffon Vendéen,D8,
Dog,Pharaoh Hound,D8,
Dog,Pitbull Mix,D9,
Dog,Plott,D8,
Dog,Pointer,D8,
Dog,Polish Lowland Sheepdog,D8,
Dog,Pom-A-Nauze,D4,
Dog,Pomapoo,D2,
Dog,Pomeranian,D1,
Dog,Pomeranian Mix,D1,
Dog,Poodle Mix,D10,
Dog,Portuguese Podengo,D8,
Dog,Portuguese Pointer,D3,
Dog,Portuguese Sheepdog,D3,
Dog,Portuguese Water Dog,D8,
Dog,Pudelpointer,D8,
Dog,Pug,D7,
Dog,Puggle,D4,
Dog,Puli,D6,
Dog,Pumi,D8,
Dog,Pyrenean Mastiff,D12,
Dog,Pyrenean Shepherd,D3,
Dog,Rafeiro Do Alentejo,D6,
Dog,Rat Terrier,D1,
Dog,Redbone Coonhound,D10,
Dog,Retriever Mix,D6,
Dog,Rhodesian Ridgeback,D11,
Dog,Rottweiler,D13,
Dog,Rottweiler Mix,D11,
Dog,Russell Terrier,D3,
Dog,Russian Toy Terrier,D3,
Dog,Russian Tzvetnaya Bolonka,D3,
Dog,Saint Bernard,D13,
Dog,Saint Bernard Mix,D13,
Dog,Saluki,D8,
Dog,Samoyed,D8,
Dog,Schapendoes,D8,
Dog,Schipperke,D3,
Dog,Schnauzer Mix,D8,
Dog,Schnoodle,D8,
Dog,Scottish Deerhound,D12,
Dog,Scottish Terrier,D6,
Dog,Sealyham Terrier,D8,
Dog,Segugio Italiano,D6,
Dog,Shar Pei Mix,D11,
Dog,Sharpoo,D8,
Dog,Shepherd Mix,D7,
Dog,Shetland Sheepdog,D6,
Dog,Shiba Inu,D4,
Dog,Shih Tzu,D4,
Dog,Shih Tzu Mix,D4,
Dog,Shih-Poo,D2,
Dog,Shikoku,D3,
Dog,Shiloh Shepherd,D11,
Dog,Siberian Husky,D5,
Dog,Silky Terrier,D3,
Dog,Skye Terrier,D11,
Dog,Sloughi,D8,
Dog,Slovensky Cuvac,D3,
Dog,Small Munsterlander,D9,
Dog,Smooth Fox Terrier,D5,
Dog,Soft Coated Wheaten Terrier,D6,
Dog,Spaniel Mix,D7,
Dog,Spanish Bulldog,D12,
Dog,Spanish Mastiff,D12,
Dog,Spanish Water Dog,D9,
Dog,Spinone Italiano,D8,
Dog,Stabyhoun,D8,
Dog,Staffordshire Bull Terrier,D8,
Dog,Standard Poodle,D10,
Dog,Standard Schnauzer,D8,
Dog,Sussex Spaniel,D9,
Dog,Swedish Lapphund,D8,
Dog,Swedish Vallhund,D8,
Dog,Terrier Mix,D4,
Dog,Thai Ridgeback,D9,
Dog,Tibetan Mastiff,D12,
Dog,Tibetan Spaniel,D4,
Dog,Tibetan Terrier,D6,
Dog,Tornjak,D6,
Dog,Tosa,D6,
Dog,Toy Eskimo Dog,D3,
Dog,Toy Fox Terrier,D2,
Dog,Toy Poodle,D2,
Dog,Toy Schnauzer,D4,
Dog,Transylvanian Hound,D3,
Dog,Treeing Cur,D8,
Dog,Treeing Tennessee Brindle,D8,
Dog,Treeing Walker Coonhound,D9,
Dog,Victoria Bulldog,D10,
Dog,Vizsla,D8,
Dog,Weimaraner,D11,
Dog,Welsh Sheepdog,D6,
Dog,Welsh Springer Spaniel,D8,
Dog,Welsh Terrier,D5,
Dog,West Highland White Terrier,D4,
Dog,Whippet,D6,
Dog,Whoodle,D5,
Dog,Wire Fox Terrier,D5,
Dog,Wirehaired Pointing Griffon,D11,
Dog,Wirehaired Vizsla,D8,
Dog,Woodle,D6,
Dog,Working Kelpie,D7,
Dog,Xoloitzcuintli,D5,
Dog,Yoodle,D1,
Dog,Yorkipoo,D1,
Dog,Yorkshire Mix,D2,
Dog,Yorkshire Terrier,D2,
Cat,Mixed Breed Cat,C1,
Cat,Abyssinian,C2,
Cat,American Bobtail,C2,
Cat,American Bobtail Shorthair,C2,
Cat,American Curl,C2,
Cat,American Curl Longhair,C2,
Cat,American Shorthair (purebred),C2,
Cat,American Wirehair (purebred),C2,
Cat,Ashera,C2,
Cat,Balinese,C2,
Cat,Bengal,C2,
Cat,Birman,C2,
Cat,Bombay,C2,
Cat,British Longhair,C2,
Cat,British Shorthair,C2,
Cat,Burmese,C2,
Cat,Burmilla,C2,
Cat,Canadian Hairless (Sphynx),C2,
Cat,European burmese,C2,
Cat,Exotic,C2,
Cat,Habari,C2,
Cat,Havana Brown,C2,
Cat,Highlander,C2,
Cat,Highlander Shorthair,C2,
Cat,Himalayan,C2,
Cat,Japanese Bobtail,C2,
Cat,European burmese,C2,
Cat,Exotic,C2,
Cat,Habari,C2,
Cat,Havana Brown,C2,
Cat,Highlander,C2,
Cat,Highlander Shorthair,C2,
Cat,Himalayan,C2,
Cat,Japanese Bobtail,C2,
Cat,Munchkin,C2,
Cat,Munchkin Longhair,C2,
Cat,Napoleon,C2,
Cat,Nebelung,C2,
Cat,Norwegian Forest Cat,C2,
Cat,Ocicat,C2,
Cat,Ojos Azules,C2,
Cat,Ojos Azules Longhair,C2,
Cat,Oriental,C2,
Cat,Oriental Longhair,C2,
Cat,Other Cat,C2,
Cat,Other Hybrid Cat,C2,
Cat,Persian,C2,
Cat,Peterbald,C2,
Cat,Pixiebob,C2,
Cat,Pixiebob Longhair,C2,
Cat,Ragamuffin,C2,
Cat,Ragdoll,C2,
Cat,Russian Blue,C2,
Cat,Safari,C2,
Cat,Savannah,C2,
Cat,Scottish Fold,C2,
Cat,Scottish Fold Longhair,C2,
Cat,Selkirk Rex,C2,
Cat,Serengeti,C2,
Cat,Siamese,C2,
Cat,Siberian,C2,
Cat,Singapura,C2,
Cat,Snowshoe,C2,
Cat,Sokoke,C2,
Cat,Somali,C2,
Cat,Sphynx,C2,
Cat,Tabby,C2,
Cat,Thai,C2,
Cat,Tiffany,C2,
Cat,Tonkinese,C2,
Cat,Toyger,C2,
Cat,Turkish Angora,C2,
Cat,Turkish Van,C2,
`;
