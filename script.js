var settingsOpen = false
var maxE = 100

function toPlaces(num, places) {
    var multiplier = Math.pow(10, places);
    return Math.round(num * multiplier) / multiplier;
}
function toTitleCase(str) {
    var words = str.split(" ");
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    return words.join(" ");
}

function openSettings() {
    if(!settingsOpen){
        settingsOpen = true
        document.getElementById('settingsMenu').innerHTML = `
        Max exponent: <input type="number" id="maxe" value="${maxE}" oninput="updateMaxE(this.value)"></input>
        `
    } else {
        settingsOpen = false
        document.getElementById('settingsMenu').innerHTML = ``
    }
}

var normalisations = {
    // to KGs
    mass: {
        kilograms: 1,
        grams: 1/1000,
        tonnes: 1000,
        pounds: 0.45,
        ounce: 0.02835,
        a_m_u: 1.6605e-27,
    },
    // to Meters
    length: {
        meters: 1,
        centimeters: 0.01,
        inches: 0.0254,
        feet: 0.3048,
        miles: 1609.34,
        nautical_miles: 1852,
        yards: 0.9144,
        angstroms: 1e-10,
        bohrs: 5.29177e-11,
        light_years: 9.46073e15,
        cubits: 0.5,
        astronomical_units: 1.496e11,
    },
    // to M^3
    volume: {
        cubic_meters: 1,
        litres: 0.001,
        gallons: 0.004,
        pints: 0.0005,
        cubic_centimeters: 0.000001,
        acre_feet: 1.23348e3,
        acre_inches: 102.79,
        cubic_inches: 1.6387e-7,
        cubic_feet: 0.028317,
        metric_cups: 2.50e-8,
        fluid_ounces: 2.8413e-7,
        u_s_fluid_ounces: 3e-5,
        pints: 568.261,
        quarts: 1.136e-3,
        tablespoons: 1.5e-7,
        teaspoons: 5e-6,
    },
    // to Watts
    power: {
        watt: 1,
        kilowatt: 1000,
        horsepower: 735.5,
    },
    // to M/s
    speed: {
        "m/s": 1,
        "km/h": 0.277778,
        "ft/s": 0.3048,
        "mph": 0.44704,
        "knots": 0.514444,
        "c": 299792458,
        "percent_c": 2997924.58,
        "mach": 340.3,
    },
    // to N
    force: {
        newtons: 1,
        kilonewtons: 1000,
        dynes: 10e-5,
        "kilogram-force": 9.80665,
        "pound-force": 4.448,
    },
    // to m^2
    area: {
        square_meters: 1,
        square_kilometers: 1e+6,
        square_miles: 2.59e+6,
        square_yards: 0.836127,
        square_foot: 0.092903,
        square_inches: 0.00064516,
        hectares: 10000,
        acres: 4046.86,
        ares: 100,
        hectares: 10000,
    },
    // to J
    energy: {
        joules: 1,
        b_t_u: 1.0545e3,
        calories: 4.1868,
        electron_volts: 1.60218e-19,
        kilograms_of_tnt: 4.184e6,
        tons_of_tnt: 4.184e9,
    },
    // to seconds
    time: {
        seconds: 1,
        minutes: 60,
        hours: 3600,
    },
    // to...
    count: {
        things: 1
    },
    /* // to bytes
    data: {
        byte: 1,
        bit: (1/8),
        kilobyte: 1000**1,
        megabyte: 1000**2,
        gigabyte: 1000**3,
        terabyte: 1000**4,
        petabyte: 1000**5,
        exabyte: 1000**6,
        kibibyte: 1024**1,
        mebibyte: 1024**2,
        gibibyte: 1024**3,
        tebibyte: 1024**4,
        pebibyte: 1024**5,
        exbibyte: 1024**6,
    },
    //to M/s^2
    acceleration: {
        "m/s^2": 1,
        "ft/s^2": 0.3048,
        "cm/s^2": 0.01,
        "gal": 0.01,
        "g": 9.80665,
    }, */
}

var units = {}
Object.keys(normalisations).forEach(e => {
    units[e] = (Object.keys(normalisations[e]).map(e => toTitleCase(e.replaceAll('_', ' '))))
})

var measurements = []
Object.keys(units).forEach(e => {
    measurements.push(toTitleCase(e))
});

var comparisons = { // Unless stated otherwise, assume all values to come from the Order of Magnitude pages on Wikipedia for the unit in question; where a range is given, the median is chosen
    // WA - Wolfram Alpha
    mass: {
        "electrons": 9.11e-31,
        "caffeine molecules": 3.2e-25,
        "HIV-1 viruses": 1e-18,
        "× the mass equivalent for 1 joule": 1.1e-17,
        "sperm cells": 2.2e-14,
        "maize pollen grains": 2.5e-10, // https://en.wikipedia.org/wiki/Orders_of_magnitude_(mass)
        "human ova": 3.6e-9,
        "grains of sand": 2.5e-6,
        "mosquitoes": 2.5e-6,
        "snowflakes": 3e-6, // https://hypertextbook.com/facts/2001/JudyMoy.shtml
        "houseflies": 2e-5,
        "cm³ of water": 1e-3,
        "carats": 2e-3,
        "peanut M&M's": 3e-3, // https://xkcd.com/526/
        "medium chicken eggs": 0.0496, // https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/eggs/shell-eggs-farm-table#17
        "phones": 0.1, // https://xkcd.com/526/
        "oranges": 0.15,
        "hamburgers": 0.24, // https://www.mcdonalds.com/gb/en-gb/help/faq/what-s-the-average-weight-in-grams-of-a-big-mac.html
        "ounces": 0.283495,
        "litres of water": 1,
        "ostrich eggs": 1.36, // https://nationalzoo.si.edu/animals/news/how-fast-ostrich-and-more-fun-facts
        "newborn babies": 3.2, // https://www.urmc.rochester.edu/encyclopedia/content.aspx?contenttypeid=90&contentid=P02673
        "cats": 4.5, // https://en.wikipedia.org/wiki/Cat
        "CRT monitors": 15, // https://xkcd.com/526/
        "Roblox mass units(RMU)": 21.952, // https://create.roblox.com/docs/physics/units
        "adult human males": 70, // https://en.wikipedia.org/wiki/Orders_of_magnitude_(mass)
        "Shaqs": 150, // https://xkcd.com/526/
        "dairy cows": 750, // https://eol.org/pages/328699/data?predicate_id=1456
        "small cars": 1200, // https://www.consumeraffairs.com/automotive/average-car-weight.html
        "large cars": 2000,
        "pickup trucks": 2268, // WA
        "adult african elephants": 5400, // https://tsavotrust.org/how-much-does-an-elephant-weigh/
        "ENIAC computers": 2.7e+4, // https://en.wikipedia.org/wiki/Orders_of_magnitude_(mass)
        "blue whales": 1.8e+5,
        "International Space Stations": 4.2e+5,
        "Virginia-class nuclear submarine": 7.8e+6,
        "fully-loaded Titanic ships": 5.2e+7,
        "pyramids": 6e+9,
        "× the mass of the human population": 6e+11,
        "Ayers Rock's": 1.425e+12,
        "teaspoons of neutron star material": 5.5e+12,
        "Mount Everest's": 8.1e+14,
        "Hyperions(Saturn's moon)": 5.6e+18,
        "Plutos": 1.3e+22,
        "Moons": 7.3e+22,
        "Earths": 6.0e+24,
        "Jupiters": 1.9e+27, // https://en.wikipedia.org/wiki/List_of_unusual_units_of_measurement#Jupiter
        "Suns": 2e+30, // https://en.wikipedia.org/wiki/Solar_mass
        "Milky Way galaxies": 1.2e+42, // https://en.wikipedia.org/wiki/Orders_of_magnitude_(mass)
        "× the mass of the observable universe": 4.4506e+52,
        "parsecs³ of water": 2.94e+55,
    },
    length: {
        "Planck lengths": 1.6163e-35,
        "Hydrogen radii": 5.3e-11, // https://en.wikipedia.org/wiki/Orders_of_magnitude_(length)
        "Å(Angstroms)": 1e-10,
        "covalent bonds": 1.54e-10,
        "carbon nanotubes wide": 1e-9,
        "beard-seconds": 1e-8, //WA
        "water molecules": 2.8e-8,
        "dust particles": 3e-7, // https://hypertextbook.com/facts/2003/MarinaBolotovsky.shtml
        "bacteria": 2e-6,
        "red blood cells": 7e-6,
        "<a href='https://en.wikipedia.org/wiki/Twip'>twips</a>": 1.764e-5, // https://en.wikipedia.org/wiki/Twip
        "mist droplets": 1e-5,
        "papers stacked vertically": 1e-4,
        "ciceros": 0.004512, // WA
        "barleycorns": 0.008467, // WA
        "× the width of a human hair strand": 0.0001, // https://www.columbiatribune.com/story/lifestyle/family/2016/08/10/q-how-thin-is-human/21830395007/
        "dollar bills stacked vertically": 0.00010922, // https://www.alliantcreditunion.org/money-mentor/the-dollar-bill-believe-it-or-not
        "salt grains": 0.0003, // https://scaleofuniverse.com/en/universe/grain-of-salt
        "pixels": 0.00034,
        "pinhead diameters": 0.001, // https://en.wikipedia.org/wiki/Orders_of_magnitude_(length)
        "ants": 0.001, // http://hockley.co.uk/insect-pests/black-ant-garden-ant/black-ant-garden-ant/
        "standard Lego studs": 0.005, // https://www.researchgate.net/publication/294257436_A_specific_nanomanufacturing_challenge
        "grains of rice": 0.006, // https://www.fao.org/4/t0567e/T0567E07.htm
        "standard Lego bricks stacked horizontally": 0.0078, // https://www.researchgate.net/publication/294257436_A_specific_nanomanufacturing_challenge
        "peas": 0.00938, // https://www.ijpab.com/form/2018%20Volume%206,%20issue%201/IJPAB-2018-6-1-573-579.pdf
        "standard Lego bricks stacked vertically": 0.0096, // https://www.researchgate.net/publication/294257436_A_specific_nanomanufacturing_challenge
        "marbles": 0.013, // https://en.wikipedia.org/wiki/Marble_(toy)
        "× the width of an adult finger": 0.02,
        "inches": 0.0254,
        "microSD cards": 0.01, // https://xkcd.com/526/
        "hammer units/Quake units": 0.01905, // WA
        "light picoseconds": 0.03, // https://www.kmlabs.com/news-and-events/kmlabs-picosecond-tape-measure-becomes-museum-exhibit
        "SD cards": 0.03, // https://xkcd.com/526/
        "attoparsecs": 0.03086, // https://en.wikipedia.org/wiki/List_of_humorous_units_of_measurement
        "matchsticks": 0.043, // https://scaleofuniverse.com/en/universe/matchstick
        "AA batteries": 0.05, // https://en.wikipedia.org/wiki/AA_battery
        "CDs": 0.12, // https://xkcd.com/526/
        "BIC pens long": 0.15, // https://xkcd.com/526/
        "chihuahuas": 0.1904, // WA
        "light nanoseconds": 0.299792458, // https://en.wikipedia.org/wiki/List_of_non-coherent_units_of_measurement
        "feet": 0.3048,
        "bananas": 0.19, // https://worldmetrics.org/average-length-of-a-banana-statistics/
        "Roblox studs": 0.28, // https://create.roblox.com/docs/physics/units
        "washing machines": 0.8,
        "yards": 0.9144,
        "adult male humans": 1.7526, // https://www.medicinenet.com/height_men/article.htm
        "Shaqs": 2.16, // https://en.wikipedia.org/wiki/Shaquille_O%27Neal
        "horse lengths": 2.4,
        "adult male crocodiles": 3.4, // https://nationalzoo.si.edu/animals/american-alligator
        "cars long": 0.03, // https://xkcd.com/526/
        "t-rexes": 12.35, // https://en.wikipedia.org/wiki/Tyrannosaurus
        "Minecraft chunks": 16,// https://minecraft.wiki/w/Chunk
        "blue whales": 30, // https://en.wikipedia.org/wiki/Blue_whale
        "Manhattan city blocks": 80.47, // WA
        "Statues of Liberty": 93.47, // https://en.wikipedia.org/wiki/Orders_of_magnitude_(length)
        "American football fields": 105,
        "rugby league pitches": 122,
        "cables": 185.2, // WA
        "Burj Khalifas": 828, // https://xkcd.com/526/
        "international miles": 1609,
        "nautical miles": 1852,
        "Earth radii": 6371,
        "Mount Everests": 8848,
        "Marathons": 42195,
        "Suez canals": 1.63e6,
        "Mars radii": 3.39e6,
        "Moon diameters": 3.48e6,
        "Great Walls of China": 6.4e6,
        "Earth equators": 4e7,
        "Jupiter radii": 6.99e7,
        "light seconds": 3e+8,
        "Sun diameters": 1.39e+9,
        "light minutes": 1.8e+10,
        "Astronomical Units": 1.5e+11,
        "light years": 9.4607e+15, // https://en.wikipedia.org/wiki/Light-year
        "parsecs": 3.086e+16, // https://en.wikipedia.org/wiki/Parsec
        "× the distance to Andromeda Galaxy": 2.4e+22, // https://en.wikipedia.org/wiki/Orders_of_magnitude_(length)
        "megaparsecs": 3.1e+22, // https://en.wikipedia.org/wiki/Orders_of_magnitude_(length)
    },
    volume: {
        "red blood cells": 9e-17,
        "peas": 2e-7,
        "teaspoons": 5e-6,
        "tablespoons": 1.5e-5,
        "in³": 1.6e-5,
        "tennis balls": 1.5e-4, // WA
        "soda cans": 3.55e-4, // WA
        "human bladders": 4e-4,
        "shot glasses": 4e-4, // https://xkcd.com/526/
        "wine bottles": 7.5e-4,
        "american football balls": 3.5e-3, // WA
        "× the blood in an adult human body": 5e-3,
        "× the total volume of male adult human lungs": 6e-3,
        "soccer balls": 6.37e-3, // WA
        "× the volume of a human body": 7.1e-2,
        "oil barrels": 1.59e-1,
        "<abbr title='Old unit for beer and wine'>butts</abbr>": 4.8e-1,
        "Dwarf Fortress tiles": 12, // https://www.bay12forums.com/smf/index.php?topic=140544.msg6700479#msg6700479
        "overworld Minecraft chunks": 98304,// https://minecraft.wiki/w/Chunk
        "Olympic-sized swimming pools": 2.5e+3,
        "× the gas in the Hindenburg zeppelin": 2.12e+5,
        "<abbr title='Volume of Sydney Harbour, Australia'>sydharbs</abbr>": 5e+8,
        "× the volume of crude oil consumed by the world in a year": 5e+9,
        "× the volume of the Mediterranean Sea": 3.7e+15,
        "× the volume of the Moon": 2.2e+19,
        "× the volume of planet Earth": 1.08e+21,
        "× the volume of the Sun": 1.41e+27,
        "× the volume of the Observable Universe": 3.4e+80,
    },
    power: {
        "× the power consumption of a human cell": 1e-12,
        "× the power consumption of a cellphone camera light": 1,
        "× the power consumption of the human brain": 30,
        "pirate-ninjas": 40.5518462,
        "× the basal metabolic rate of an adult human body": 100,
        "× the electric power output of 1m² solar panel in full sunlight": 120,
        "× the fusion power output of 1m³ of the Sun's core": 276,
        "× the power of a microwave oven": 1.1e+3,
        "× the power per m² received from the Sun at the Earth's orbit": 1.366e+3,
        "× the average power consumption per person worldwide": 2.4e+3,
        "× the average power consumption per person in the United States": 1e+4,
        "× the maximum power output of a large 18-wheeler truck engine": 4.5e+5,
        "× the peak power output of a blue whale": 2.5e+6,
        "× the mechanical power output of a diesel locomotive": 3e+6,
        "× the electrical power output of the country of Togo": 1.03e+7,
        "× the average power consumption of a Boeing 747 passenger aircraft": 1.4e+8,
        "× the peak power generation of Hoover Dam": 2.074e+9,
        "× the peak daily electrical power consumption of Great Britain": 5.5e+10,
        "× the worldwide wind turbine capacity": 8.99e+11,
        "× the average rate of power consumption of humanity": 2.04e+13,
        "× the global net power production via photosynthesis": 1.4e+14,
        "× the total power received by Earth from the Sun": 1.73e+17,
        "× the Sun's luminosity": 3.828e+26,
        "× the galaxy's luminosity": 5.7e+36,
        "× the entire Observable universe's luminosity": 9.5e+48,
    },
    speed: {
        "× the growth rate of a stalagmite": 4.12e-12,
        "× the human hair growth rate": 4.8e-9,
        "× the growth rate of bamboo": 1.4e-5,
        "× the speed of the world record fastest snail": 0.00275,
        "× the top speed of a sloth": 0.080,
        "× the average walking speed": 1.25,
        "× the average cycling speed": 6.5,
        "× the speed of Usain Bolt setting the 100m world record": 10.5,
        "× the speed of thoroughbred racehorse": 17,
        "× the speed of a cheetah — fastest land animal": 30,
        "× the typical peak speed of a local service train": 40,
        "× the speed of a peregrine falcon — fastest bird": 90,
        "× the speed of the fastest crossbow arrow.": 154,
        "× the speed of a typical .22 LR bullet": 320,
        "× the speed of sound(Mach)": 340.3,
        "× the speed of Sonic the Hedgehog": 342.88, // https://www.thegamer.com/sonic-how-fast-running-speeds/
        "× the speed of Earth's rotation at the equator": 464,
        "× the speed of a bullet of a heavy machine gun": 800,
        "× the orbital velocity of the Moon around Earth.": 1022,
        "× the velocity of International Space Station": 7700,
        "× Earth's escape velocity": 11200,
        "× Earth's orbital velocity around the Sun": 29800,
        "× the orbital speed of the Solar System in the Milky Way galaxy": 2e+5,
        "× the approaching velocity of Andromeda Galaxy to our galaxy": 3.09e+5,
        "× the speed of an initial strike of lightning": 4.4e+5,
        "× the speed of an return stroke of lightning": 1e+8,
        "c(speed of light)": 299792458,
        "%c": 2997924.58,
    },
    force: {
        "× the weight of a hydrogen atom": 1.6e-25,
        "× the weight of an E. coli bacterium": 1e-13,
        "× the force to break a hydrogen bond": 4e-12,
        "× the weight of a smartphone": 1.4,
        "× the force to break a chicken egg": 50,
        "× the force of human bite": 720,
        "× the bite force of an American alligator": 9e+3,
        "× the bite force of a great white shark": 1.8e+4,
        "× the weight of the largest Blue Whale": 1.9e+6,
        "× the gravitational attraction between Earth and Moon": 2e+20,
        "× the gravitational attraction between Earth and Sun": 3.5e+22,
        "× the bite force of an American alligator": 9e+3,
        "× the bite force of an American alligator": 9e+3,
    },
    area: {
        "E. coli bacteria": 6e-12,
        "Red blood cells": 1e-10,
        "pixels": 5.5e-8,
        "pinheads": 2e-6,
        "× the surface area of an ant": 4.87e-5, // https://physics.stackexchange.com/a/153552
        "U.S. pennies": 2.9e-4,
        "credit cards": 4.6e-3,
        "Index cards": 1e-2,
        "American letter papers": 6e-2,
        "A4 paper": 6.24e-2,
        "basketballs": 1.8e-1,
        "A1 papers": 5e-1,
        "original iPhones": 0.007015, // https://en.wikipedia.org/wiki/ISO/IEC_7810
        "passports": 0.011, // https://en.wikipedia.org/wiki/ISO/IEC_7810
        "medium Domino's pizzas": 0.0729, //WA
        "original iPads": 0.0461, // https://en.wikipedia.org/wiki/IPad_(1st_generation)
        "× the skin on the human body": 1.73,
        "single beds": 1.852, // https://en.wikipedia.org/wiki/Bed_size
        "office desk surfaces": 2,
        "queen beds": 3.07, // https://en.wikipedia.org/wiki/Bed_size
        "king beds": 3.899, // https://en.wikipedia.org/wiki/Bed_size
        "parking spaces": 15, //WA
        "Minecraft chunks": 16,// https://minecraft.wiki/w/Chunk
        "one-bedroom apartments": 51, // https://tkpg.co.uk/news/average-size-of-one-bed-apartment-manchester/
        "volleyball courts": 162,
        "IMAX screens": 342, // https://entertainment.howstuffworks.com/imax.htm#pt1
        "NBA basketball courts": 437,
        "Olympic swimming pools": 1250,
        "acres": 4047,
        "American football fields": 5400,
        "football(soccer) fields": 7140,
        "Manhattan city blocks": 22100,
        "Vatican Cities": 4.9e+5,
        "Pentagons": 6e+5,
        "Monaco's": 2e+6,
        "Central Parks": 3.41e+6, // https://en.wikipedia.org/wiki/Central_Park
        "Walt Disney Worlds": 1.1e+8,
        "Hong Kongs": 1.1e+9,
        "Lake Victorias": 6.89e+10,
        "Spains": 5.1e+11,
        "Roman Empires(at its largest)": 5e+12,
        "× the arable land on Earth": 1.4e+13,
        "Plutos": 1.66e+13,
        "Africas": 3e+13,
        "Moons": 3.8e+13,
        "× the water area on Earth": 3.6e+14,
        "Earths": 5.1e+14,
        "Jupiters": 6.1e+16,
        "Suns": 6.1e+18,
    },
    energy: {
        "microwave oven photons(2.45 GHz)": 1.6e-24,
        "van der Waals interactions between atoms": 5e-21,
        "hydrogen bonds": 14.5e-21,
        "electronvolts": 1.60218e-19,
        "human red blood cells' kinetic energy": 3e-15,
        "uranium-235 atoms' energy releases": 3.4e-11,
        "seconds of using a typical LED": 4e-2,
        "joules": 1,
        "Oh-My-God Particles": 50,
        "lethal X-ray doses": 3e2,
        "minutes of using a 10-watt flashlight": 6e2,
        "BTU": 1.0545e3,
        "square meters of solar radiation on earth's surface": 1.4e3,
        "watt-hours": 3.6e3,
        "food calories": 4.2e3,
        "AA batteries": 9e3,
        "grams of carbohydrates being metabolised": 1.7e4,
        "grams of fats being metabolised": 3.8e4,
        "grams of gasoline being combusted": 4.5e4,
        "snickers bars": 1.2e6,
        "kilowatt-hours": 3.6e6,
        "kilograms of TNT": 4.184e6,
        "$ of electricity at a cost of $0.10/kWh(the US average retail cost in 2009)": 3.7e7,
        "cubic meters of natural gas combusted": 4e7,
        "x-rays": 6.33e7, // https://howradiologyworks.com/basic-x-ray-properties/
        "Tour de Frances": 1.1e8, // ridden at 5 W/kg by a 65 kg rider
        "lightning bolts": 5e9,
        "megawatt-hours": 3.6e9,
        "tons of TNT": 4.184e9,
        "barrels of oil": 6.12e9,
        "tons of oil": 4.2e10,
        "megawatt-days": 8.6e10,
        "grams of uranium-235 undergoing nuclear fission": 8.8e10,
        "kilotons of TNT": 4.184e12,
        "\"Little Boy\" atomic bombs": 6.3e13,
        "grams of antimatter annihilating matter": 1.8e14,
        "megatons of TNT": 4.184e15,
        "Castle Bravo nuclear bombs, the most powerful tested by the United States": 6.3e16,
        "Tsar Bomba nuclear bombs": 2.1e17,
        "× the global nuclear arsenal's explosive yield": 1.2e19,
        "Hurricane Katrinas": 2.4e20,
        "× the energy contained in the world's natural gas reserves as of 2010": 6.9e21,
        "× the energy contained in the world's petroleum reserves as of 2010": 7.9e21,
        "× the energy contained in the world's coal reserves as of 2010": 2.4e22,
        "× the energy contained in the world's fossil fuel reserves as of 2010": 3.9e22,
        "seconds of the sun's radioactive output": 3.828e26,
        "years of the sun's energy output": 1.2e34,
        "supernovae": 1e44,
        "hypernovae": 1e45,
    },
    time: {
        "truti": 3.086e-7, // https://en.wikipedia.org/wiki/Hindu_units_of_time
        "machine cycles by a 1Ghz microprocessor": 1e-9,
        "shakes": 1e-8,
        "× the time for a human neuron to fire": 1e-3,
        "housefly wing-flaps": 0.003,
        "Minecraft game ticks": 0.05, // https://minecraft.wiki/w/Tick
        "Minecraft redstone ticks": 0.1, // https://minecraft.wiki/w/Tick
        "× the time for a human reflex to sight": 0.15,
        "blinks of an eye": 0.25,
        "F1 pitstops": 3, // https://en.wikipedia.org/wiki/Pit_stop
        "Swatch .beats": 86.4, // https://en.wikipedia.org/wiki/Swatch_Internet_Time
        "basketball quarters": 720, // https://themidfield.com/betting-news/different-sports-time-lengths/
        "Stardew Valley days": 840, // https://stardewvalleywiki.com/Day_Cycle
        "centidays(ke)": 864, //WA
        "Minecraft days": 1200, // WA
        "GTA days": 1440, // https://gta.fandom.com/wiki/Time
        "Terraria days": 1440, // https://terraria.wiki.gg/wiki/Day_and_night_cycle
        "basketball games": 2880, // https://themidfield.com/betting-news/different-sports-time-lengths/
        "standard lectures": 3000, //WA
        "football(soccer) games": 5400, //WA
        "average baseball matches": 11280, //WA
        "workdays": 28800, //WA
        "Martian days": 88775.244, //https://en.wikipedia.org/wiki/Timekeeping_on_Mars
        "workweeks": 144000, //WA
        "× the longest held breath": 1.447e3,
        "Anglo-Zanzibar wars": 2.28e3,
        "feature films": 7.2e3,
        "days": 8.64e4,
        "Stardew Valley seasons": 2.352e4, // https://stardewvalleywiki.com/Day_Cycle
        "Februaries": 2.5056e4,
        "Stardew Valley years": 9.408e4, // https://stardewvalleywiki.com/Day_Cycle
        "business weeks": 4.32e5, // WA
        "mooches": 8.64e5, // WA
        "cat years": 2.102e6, // WA
        "dog years": 4.505e6, // WA
        "human pregnancies": 2.4e7, // WA
        "Martian Years(sol)": 5.93568e7, //WA
        "civil wars": 1.261e8, //WA
        "American presidential term lengths": 1.261e8, //WA
        "first world wars": 1.354e8, //WA
        "lustra": 1.577e8, //WA
        "second world wars": 1.895e8, //WA
        "octaeterides": 2.525e8, //https://en.wikipedia.org/wiki/Octaeteris
        "cat lives": 4.533e8, //WA
        "indictions": 4.73e8, //WA
        "enneadecaeteris(Metonic Cycles)": 5.996e8, //https://en.wikipedia.org/wiki/Metonic_cycle
        "dog lives": 6.307e8, //WA
        "human generations": 8.8e8, //WA
        "American lifespans": 2.5e9, //WA
        "lifespans of the oldest tortoise": 8.042e9, //WA
        "Divine years": 1.135e10, // https://en.wikipedia.org/wiki/Yuga_cycle
        "Mayan b'ak'tuns": 1.244e10, //WA
        "Yuga cycles": 1.362e14, // https://en.wikipedia.org/wiki/Yuga_cycle
        "aeons": 3.154e16, //WA
        "kalpas": 1.36e17, //WA
        "× the age of the Earth": 1.419e17, //WA
        "× the age of the Sun": 1.441e17, //WA
        "lifespans of our Sun": 3.154e17, //WA
        "lifespans of the universe": 4.352e17, //WA
    },
    count: {
        "× the population of Monowi": 1,
        "× the horns on a unicorn": 1,
        "× the planets in the solar system": 8,
        "× the zodiac signs": 12,
        "dozens": 12,
        "baker's dozens": 13,
        "× the letters in the English alphabet": 26,
        "× the chromosomes in the human body": 46,
        "× the states in the United States": 50,
        "× the keys on a grand piano": 88,
        "× the number of first generation Pokemon": 151,
        "× the number of recognized UN members": 193,
        "× the bones in the human body": 206,
        "× the population of Tuvalu": 10645,
        "× the number of verses in the Mahabharata": 100000,
        "× the strands of hair on the human head": 115000,
        "× the words in James Joyce's \"Ulysses\"": 267000,
        "× the definitions in the Oxford Dictionary": 360000,
        "× the words in Leo Tolstoy's \"War and Peace\"": 564000,
        "× the words in the King James Bible": 930000,
        "× the number of named species": 1.4e6,
        "× the number of English Wikipedia articles": 7.1e6,
        "× the number of Wikipedia articles": 6.6e7,
        "× the Canadian population": 3.7e7,
        "× the biblical number of angels(the largest number in the Bible)": 1e8,
        "× the number of books in the Library of Congress": 1.48e8,
        "× the number of books in the British Library": 1.5e8,
        "× the sold copies of Minecraft": 2e8,
        "× the United States population": 3.3e8,
        "× the South American population": 4.34e8,
        "× the North American population": 5.92e8,
        "× the European population": 7.45e8,
        "× the cars in the world": 1.4e9,
        "× the Chinese population": 1.409e9,
        "× the Indian population": 1.428e9,
        "× the active Gmail users": 1.5e9,
        "× the world population": 8e9,
        "× the bacteria in the human mouth": 1e10,
        "× the websites indexed by Google in 2010": 5.6e10,
        "× the planets in our galaxy": 1e11,
        "× the neurons in the human brain": 1e11,
        "× the humans that have ever lived": 1.2e11,
        "× the stars in the Andromeda galaxy": 1e12,
        "× the cells in the human body": 1e14,
        "× the living ants on Earth": 5e15,
        "× Earth's insect population": 1e19,
        "× the different Rubik's cube variations": 4.33e19,
        "× the different Youtube URL variations": 7.38e19,
        "× the grains of sand on Earth": 1.2e21,
        "× the atoms in a drop of water": 5e21,
        "× the stars in the observable universe": 5e23,
        "× the atoms in the human body": 7e27,
        "× the bacterial cells on Earth": 5e30,
        "× the number of atoms on Earth": 1.33e50,
    },
    /* data: {
        "bits": (1/8),
        "bytes": (1),
        "nats": Math.log2(Math.E) * (1/8),
        "trits": Math.log2(3) * (1/8),
        "IPv4 addresses": 4,
        "floating point numbers": 8,
        "IPv6 addresses": 16,
        "uncompressed frames of DVD video": 41472,
        "× the complete works of Shakespear": 41943.4,
    },
    acceleration: {
        "× the acceleration due to gravity on the moon": 1.62, // https://en.wikipedia.org/wiki/Orders_of_magnitude_(acceleration)
        "g": 9.80665,
        "× that of the Saturn V Moon rocket just after launch": 11.2,
        "× that of the fastest rollercoaster in the world - Stealth": 19.87, // https://coasterpedia.net/wiki/Fastest_launch_accelerations
    }, */
}

function populateDropdown(element, values) {
    element.innerHTML = '';
    var options = [];
    values.sort().forEach((e) => {
        options.push(e)
        element.innerHTML += `<option value="${e.replaceAll(' ', '_')}">${e}</option>`
    })
}

populateDropdown(document.getElementById('measurement'), measurements)

function measurementChanged(){
    populateDropdown(document.getElementById('unit'), units[document.getElementById('measurement').value.toLowerCase()])
    updateComparison()
}

measurementChanged()

function updateMaxE(n){
    maxE = n
    updateComparison()
}

function updateComparison(){
    var measurement = document.getElementById('measurement').value.toLowerCase()
    var unit = document.getElementById('unit').value.toLowerCase()
    var normal = document.getElementById('magnitude').value * normalisations[measurement][unit]
    var comparisonList = []
    Object.keys(comparisons[measurement]).forEach((e) => {
        var val = toPlaces((normal / comparisons[measurement][e]), 2)
        var hide;
        if (val == 0 || val > (10**maxE)) {
            hide = true
        }
        if(val > 1000000 || ((val.toExponential(2).split('-')[1]) > 5)){
            val = val.toExponential(2)
        }
        if (!e.startsWith("× ")) e = " " + e // adds a space before the comparison if it doesnt start with a × symbol
        if (!hide) comparisonList.push(`<span style='font-weight: 600'>${val.toLocaleString().replace('e', '×10^').replace('+', '')}</span>${e}`)
    })
    if(comparisonList.length > 0){
        document.getElementById('imperial').innerHTML = `<div class="comparison">${comparisonList.join('</div> <div class="comparison">')}</div>`
    } else {
        var val = normal
        if (val > 1e3) {
            var something = ['A whole lotta something', 'Like a lot', 'More than 3', 'That\'s a bit much']
            document.getElementById('imperial').innerHTML = `<div class="comparison">${something[Math.floor(Math.random() * something.length)]}</div>`
        } else {
            var nothing = ['A whole lotta nothing', 'Nothin\' here but us chickens', 'Nada', 'Not worth it', 'Looking for it']
            document.getElementById('imperial').innerHTML = `<div class="comparison">${nothing[Math.floor(Math.random() * nothing.length)]}</div>`
        }
    }
}

document.getElementById('magnitude').value = Math.ceil(Math.random() * 10)
document.getElementById('measurement').value = measurements[Math.floor(Math.random() * 10)]
measurementChanged()
updateComparison()
