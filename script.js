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
        angstroms: 10e-10,
        bohrs: 5.29177e-11,
        light_years: 9.46073e15,
    },
    // to M^3
    volume: {
        cubic_meters: 1,
        litres: 0.001,
        gallons: 0.004,
        pints: 0.0005,
        cubic_centimeters: 0.000001
    },
    // to Watts
    power: {
        watt: 1,
        kilowatt: 1000,
        horsepower: 735.5
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
        "mach": 340.3
    },
    // to N
    force: {
        newtons: 1,
        kilonewtons: 1000,
        dynes: 10e-5,
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
    /* to M/s^2
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
    mass: {
        "maize pollen grains": 2.5e-10, // https://en.wikipedia.org/wiki/Orders_of_magnitude_(mass)
        "grains of sand": 2.5e-6,
        "snowflakes": 3e-6, // https://hypertextbook.com/facts/2001/JudyMoy.shtml
        "houseflies": 2e-5,
        "cm³ of water": 1e-3,
        "carats": 2e-3,
        "oranges": 0.15,
        "hamburgers": 0.24, // https://www.mcdonalds.com/gb/en-gb/help/faq/what-s-the-average-weight-in-grams-of-a-big-mac.html
        "ostrich eggs": 1.36, // https://nationalzoo.si.edu/animals/news/how-fast-ostrich-and-more-fun-facts
        "newborn babies": 3.2, // https://www.urmc.rochester.edu/encyclopedia/content.aspx?contenttypeid=90&contentid=P02673
        "cats": 4.5, // https://en.wikipedia.org/wiki/Cat
        "eggs": 49.61, // https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/eggs/shell-eggs-farm-table#17
        "adult human males": 70, // https://en.wikipedia.org/wiki/Orders_of_magnitude_(mass)
        "dairy cows": 750, // https://eol.org/pages/328699/data?predicate_id=1456
        "small cars": 1200, // https://www.consumeraffairs.com/automotive/average-car-weight.html
        "large cars": 2000,
        "adult african elephants": 5400, // https://tsavotrust.org/how-much-does-an-elephant-weigh/
        "ENIAC computers": 2.7e+4, // https://en.wikipedia.org/wiki/Orders_of_magnitude_(mass)
        "blue whales": 1.8e+5,
        "International Space Stations": 4.2e+5,
        "Virginia-class nuclear submarine": 7.8e+6,
        "fully-loaded Titanic ships": 5.2e+7,
        "pyramids": 6e+9,
        "Ayers Rock's": 1.425e+12,
        "Mount Everest's": 8.1e+14,
        "Hyperions(Saturn's moon)": 5.6e+18,
        "Plutos": 1.3e+22,
        "Moons": 7.3e+22,
        "Earths": 6.0e+24,
        "Jupiters": 1.9e+27, // https://en.wikipedia.org/wiki/List_of_unusual_units_of_measurement#Jupiter
        "Suns": 2e+30, // https://en.wikipedia.org/wiki/Solar_mass
        "Milky Way galaxies": 1.2e+42, // https://en.wikipedia.org/wiki/Orders_of_magnitude_(mass)
        "times the mass of the observable universe": 4.4506e+52,
        "parsecs³ of water": 2.94e+55,
    },
    length: {
        "Hydrogen atoms": 5.3e-11, // https://en.wikipedia.org/wiki/Orders_of_magnitude_(length)
        "Å(Angstroms)": 10e-10,
        "water molecules": 2.8e-8,
        "dust particles": 3e-7, // https://hypertextbook.com/facts/2003/MarinaBolotovsky.shtml
        "bacteria": 2e-6,
        "red blood cells": 7e-6,
        "<a href='https://en.wikipedia.org/wiki/Twip'>twips</a>": 1.764e-5, // https://en.wikipedia.org/wiki/Twip
        "times the width of a human hair strand": 0.0001, // https://www.columbiatribune.com/story/lifestyle/family/2016/08/10/q-how-thin-is-human/21830395007/
        "dollar bills stacked on top of each other": 0.00010922, // https://www.alliantcreditunion.org/money-mentor/the-dollar-bill-believe-it-or-not
        "salt grains": 0.0003, // https://scaleofuniverse.com/en/universe/grain-of-salt
        "pixels": 0.00034,
        "pinhead diameters": 0.001, // https://en.wikipedia.org/wiki/Orders_of_magnitude_(length)
        "ants": 0.001, // http://hockley.co.uk/insect-pests/black-ant-garden-ant/black-ant-garden-ant/
        "grains of rice": 0.006, // https://www.fao.org/4/t0567e/T0567E07.htm
        "peas": 0.00938, // https://www.ijpab.com/form/2018%20Volume%206,%20issue%201/IJPAB-2018-6-1-573-579.pdf
        "marbles": 0.013, // https://en.wikipedia.org/wiki/Marble_(toy)
        "times the width of an adult finger": 0.02,
        "light picoseconds": 0.03, // https://www.kmlabs.com/news-and-events/kmlabs-picosecond-tape-measure-becomes-museum-exhibit
        "attoparsecs": 0.03086, // https://en.wikipedia.org/wiki/List_of_humorous_units_of_measurement
        "matchsticks": 0.043, // https://scaleofuniverse.com/en/universe/matchstick
        "AA batteries": 0.05, // https://en.wikipedia.org/wiki/AA_battery
        "bananas": 0.19, // https://worldmetrics.org/average-length-of-a-banana-statistics/
        "washing machines": 0.8,
        "adult male humans": 1.7526, // https://www.medicinenet.com/height_men/article.htm
        "Shaqs": 2.16, // https://en.wikipedia.org/wiki/Shaquille_O%27Neal
        "horse lengths": 2.4,
        "adult male crocodiles": 3.4, // https://nationalzoo.si.edu/animals/american-alligator
        "t-rexes": 12.35, // https://en.wikipedia.org/wiki/Tyrannosaurus
        "blue whales": 30, // https://en.wikipedia.org/wiki/Blue_whale
        "times the height of the Statue of Liberty": 93.47, // https://en.wikipedia.org/wiki/Orders_of_magnitude_(length)
        "American football fields": 105,
        "rugby league pitches": 122,
        "Earth radii": 6371,
        "Mount Everests": 8848,
        "Marathons": 42195,
        "times the diameter of the Moon": 3.48e+6,
        "times the length of the Great Wall of China": 6.4e+6,
        "times Earth's equator": 4e+7,
        "light seconds": 3e+8,
        "times the diameter of the Sun": 1.39e+9,
        "light minutes": 1.8e+10,
        "Astronomical Units": 1.5e+11,
        "light years": 9.4607e+15, // https://en.wikipedia.org/wiki/Light-year
        "parsecs": 3.086e+16, // https://en.wikipedia.org/wiki/Parsec
        "times the distance to Andromeda Galaxy": 2.4e+22, // https://en.wikipedia.org/wiki/Orders_of_magnitude_(length)
        "megaparsecs": 3.1e+22, // https://en.wikipedia.org/wiki/Orders_of_magnitude_(length)
    },
    volume: {
        "red blood cells": 9e-17,
        "peas": 2e-7,
        "teaspoons": 5e-6,
        "tablespoons": 1.5e-5,
        "in³": 1.6e-5,
        "times the volume of the human urinary bladder": 4e-4,
        "wine bottles": 7.5e-4,
        "times the blood in an adult human body": 5e-3,
        "times the total volume of male adult human lungs": 6e-3,
        "times the volume of a human body": 7.1e-2,
        "oil barrels": 1.59e-1,
        "<abbr title='Old unit for beer and wine'>butts</abbr>": 4.8e-1,
        "Olympic-sized swimming pools": 2.5e+3,
        "times the gas in the Hindenburg zeppelin": 2.12e+5,
        "<abbr title='Volume of Sydney Harbour, Australia'>sydharbs</abbr>": 5e+8,
        "times the volume of crude oil consumed by the world in a year": 5e+9,
        "times the volume of the Mediterranean Sea": 3.7e+15,
        "times the volume of the Moon": 2.2e+19,
        "times the volume of planet Earth": 1.08e+21,
        "times the volume of the Sun": 1.41e+27,
        "times the volume of the Observable Universe": 3.4e+80,
    },
    power: {
        "times the power consumption of a human cell": 1e-12,
        "times the power consumption of a cellphone camera light": 1,
        "times the power consumption of the human brain": 30,
        "times the basal metabolic rate of an adult human body": 100,
        "times the electric power output of 1m² solar panel in full sunlight": 120,
        "times the fusion power output of 1m³ of the Sun's core": 276,
        "times the power of a microwave oven": 1.1e+3,
        "times the power per m² received from the Sun at the Earth's orbit": 1.366e+3,
        "times the average power consumption per person worldwide": 2.4e+3,
        "times the average power consumption per person in the United States": 1e+4,
        "times the maximum power output of a large 18-wheeler truck engine": 4.5e+5,
        "times the peak power output of a blue whale": 2.5e+6,
        "times the mechanical power output of a diesel locomotive": 3e+6,
        "times the electrical power output of the country of Togo": 1.03e+7,
        "times the average power consumption of a Boeing 747 passenger aircraft": 1.4e+8,
        "times the peak power generation of Hoover Dam": 2.074e+9,
        "times the peak daily electrical power consumption of Great Britain": 5.5e+10,
        "times the worldwide wind turbine capacity": 8.99e+11,
        "times the average rate of power consumption of humanity": 2.04e+13,
        "times the global net power production via photosynthesis": 1.4e+14,
        "times the total power received by Earth from the Sun": 1.73e+17,
        "times the luminosity of the Sun": 3.828e+26,
        "times the luminosity of the Milky Way galaxy": 5.7e+36,
        "times the luminosity of the entire Observable universe": 9.5e+48,
    },
    speed: {
        "times the growth rate of a stalagmite": 4.12e-12,
        "times the human hair growth rate": 4.8e-9,
        "times the growth rate of bamboo": 1.4e-5,
        "times the speed of the world record fastest snail": 0.00275,
        "times the top speed of a sloth": 0.080,
        "times the average walking speed": 1.25,
        "times the average cycling speed": 6.5,
        "times the speed of Usain Bolt setting the 100m world record": 10.5,
        "times the speed of thoroughbred racehorse": 17,
        "times the speed of a cheetah — fastest land animal": 30,
        "times the typical peak speed of a local service train": 40,
        "times the speed of a peregrine falcon — fastest bird": 90,
        "times the speed of the fastest crossbow arrow.": 154,
        "times the speed of a typical .22 LR bullet": 320,
        "times the speed of sound(Mach)": 340.3,
        "times the speed of Sonic the Hedgehog": 342.88, // https://www.thegamer.com/sonic-how-fast-running-speeds/
        "times the speed of Earth's rotation at the equator": 464,
        "times the speed of a bullet of a heavy machine gun": 800,
        "times the orbital velocity of the Moon around Earth.": 1022,
        "times the velocity of International Space Station": 7700,
        "times Earth's escape velocity": 11200,
        "times Earth's orbital velocity around the Sun": 29800,
        "times the orbital speed of the Solar System in the Milky Way galaxy": 2e+5,
        "times the approaching velocity of Andromeda Galaxy to our galaxy": 3.09e+5,
        "times the speed of an initial strike of lightning": 4.4e+5,
        "times the speed of an return stroke of lightning": 1e+8,
        "c(speed of light)": 299792458,
        "%c": 2997924.58,
    },
    force: {
        "times the weight of a hydrogen atom": 1.6e-25,
        "times the weight of an E. coli bacterium": 1e-13,
        "times the force to break a hydrogen bond": 4e-12,
        "times the weight of a smartphone": 1.4,
        "times the force to break a chicken egg": 50,
        "times the force of human bite": 720,
        "times the bite force of an American alligator": 9e+3,
        "times the bite force of a great white shark": 1.8e+4,
        "times the weight of the largest Blue Whale": 1.9e+6,
        "times the gravitational attraction between Earth and Moon": 2e+20,
        "times the gravitational attraction between Earth and Sun": 3.5e+22,
        "times the bite force of an American alligator": 9e+3,
        "times the bite force of an American alligator": 9e+3,
    },
    area: {
        "E. coli bacteria": 6e-12,
        "Red blood cells": 1e-10,
        "pixels": 5.5e-8,
        "pinheads": 2e-6,
        "times the surface area of an ant": 4.87e-5, // https://physics.stackexchange.com/a/153552
        "U.S. pennies": 2.9e-4,
        "credit cards": 4.6e-3,
        "Index cards": 1e-2,
        "American letter papers": 6e-2,
        "A4 paper": 6.24e-2,
        "basketballs": 1.8e-1,
        "A1 papers": 5e-1,
        "times the skin on the human body": 1.73,
        "one-bedroom apartments": 51, // https://tkpg.co.uk/news/average-size-of-one-bed-apartment-manchester/
        "volleyball courts": 162,
        "NBA basketball courts": 437,
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
        "times the arable land on Earth": 1.4e+13,
        "Plutos": 1.66e+13,
        "Africas": 3e+13,
        "Moons": 3.8e+13,
        "times the water area on Earth": 3.6e+14,
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
        "Tour de Frances ridden at 5 W/kg by a 65 kg rider": 1.1e8,
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
        "times the global nuclear arsenal's explosive yield": 1.2e19,
        "Hurricane Katrinas": 2.4e20,
        "times the energy contained in the world's natural gas reserves as of 2010": 6.9e21,
        "times the energy contained in the world's petroleum reserves as of 2010": 7.9e21,
        "times the energy contained in the world's coal reserves as of 2010": 2.4e22,
        "times the energy contained in the world's fossil fuel reserves as of 2010": 3.9e22,
        "seconds of the sun's radioactive output": 3.828e26,
        "years of the sun's energy output": 1.2e34,
        "supernovae": 1e44,
        "hypernovae": 1e45,
    },
    /* acceleration: {
        "times the acceleration due to gravity on the moon": 1.62, // https://en.wikipedia.org/wiki/Orders_of_magnitude_(acceleration)
        "g": 9.80665,
        "times that of the Saturn V Moon rocket just after launch": 11.2,
        "times that of the fastest rollercoaster in the world - Stealth": 19.87, // https://coasterpedia.net/wiki/Fastest_launch_accelerations
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

function updateComparison(){
    var measurement = document.getElementById('measurement').value.toLowerCase()
    var unit = document.getElementById('unit').value.toLowerCase()
    var normal = document.getElementById('magnitude').value * normalisations[measurement][unit]
    var comparisonList = []
    Object.keys(comparisons[measurement]).forEach((e) => {
        var val = toPlaces((normal / comparisons[measurement][e]), 2)
        var hide;
        if (val == 0 || val > 1e+100) {
            hide = true
        }
        if(val > 1000000 || ((val.toExponential(2).split('-')[1]) > 5)){
            val = val.toExponential(2)
        }
        if (!hide) comparisonList.push(`<span style='font-weight: 600'>${val.toLocaleString().replace('e', '×10^').replace('+', '')}</span> ${e}`)
    })
    if(comparisonList.length > 0){
        document.getElementById('imperial').innerHTML = `<div class="comparison">${comparisonList.join('</div> <div class="comparison">')}</div>`
    } else {
        var nothing = ['A whole lotta nothing', 'Nothin\' here but us chickens', 'Nada']
        document.getElementById('imperial').innerHTML = `<div class="comparison">${nothing[Math.floor(Math.random() * nothing.length)]}</div>`
    }
}

document.getElementById('magnitude').value = Math.ceil(Math.random() * 10)
document.getElementById('measurement').value = measurements[Math.floor(Math.random() * 3)]
measurementChanged()
updateComparison()