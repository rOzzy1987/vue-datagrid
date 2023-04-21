export interface IName {
    first: string;
    last: string;
    middle?: string;
}

export interface IPet {
    species: string;
    name: string;
    year: number;
}

export interface ITestData {
    name: IName;
    sex: string;
    profession: string;
    dateOfBirth: Date;
    pets?: IPet[];
}

export default class Generator{
    private maleFirstNames = ["Wade","Dave","Seth","Ivan","Riley","Gilbert","Jorge","Dan","Brian","Roberto","Ramon","Miles","Liam","Nathaniel","Ethan","Lewis","Milton","Claude","Joshua","Glen","Harvey","Blake","Antonio","Connor","Julian","Aidan","Harold","Conner","Peter","Hunter","Eli","Alberto","Carlos","Shane","Aaron","Marlin","Paul","Ricardo","Hector","Alexis","Adrian","Kingston","Douglas","Gerald","Joey","Johnny","Charlie","Scott","Martin","Tristin","Troy","Tommy","Rick","Victor","Jessie","Neil","Ted","Nick","Wiley","Morris","Clark","Stuart","Orlando","Keith","Marion","Marshall","Noel","Everett","Romeo","Sebastian","Stefan","Robin","Clarence","Sandy","Ernest","Samuel","Benjamin","Luka","Fred","Albert","Greyson","Terry","Cedric","Joe","Paul","George","Bruce","Christopher","Mark","Ron","Craig","Philip","Jimmy","Arthur","Jaime","Perry","Harold","Jerry","Shawn","Walter"];
    private femaleFirstNames = ["Daisy","Deborah","Isabel","Stella","Debra","Beverly","Vera","Angela","Lucy","Lauren","Janet","Loretta","Tracey","Beatrice","Sabrina","Melody","Chrysta","Christina","Vicki","Molly","Alison","Miranda","Stephanie","Leona","Katrina","Mila","Teresa","Gabriela","Ashley","Nicole","Valentina","Rose","Juliana","Alice","Kathie","Gloria","Luna","Phoebe","Angelique","Graciela","Gemma","Katelynn","Danna","Luisa","Julie","Olive","Carolina","Harmony","Hanna","Anabelle","Francesca","Whitney","Skyla","Nathalie","Sophie","Hannah","Silvia","Sophia","Della","Myra","Blanca","Bethany","Robyn","Traci","Desiree","Laverne","Patricia","Alberta","Lynda","Cara","Brandi","Janessa","Claudia","Rosa","Sandra","Eunice","Kayla","Kathryn","Rosie","Monique","Maggie","Hope","Alexia","Lucille","Odessa","Amanda","Kimberly","Blanche","Tyra","Helena","Kayleigh","Lucia","Janine","Maribel","Camille","Alisa","Vivian","Lesley","Rachelle","Kianna"];
    private lastNames = ["Williams","Harris","Thomas","Robinson","Walker","Scott","Nelson","Mitchell","Morgan","Cooper","Howard","Davis","Miller","Martin","Smith","Anderson","White","Perry","Clark","Richards","Wheeler","Warburton","Stanley","Holland","Terry","Shelton","Miles","Lucas","Fletcher","Parks","Norris","Guzman","Daniel","Newton","Potter","Francis","Erickson","Norman","Moody","Lindsey","Gross","Sherman","Simon","Jones","Brown","Garcia","Rodriguez","Lee","Young","Hall","Allen","Lopez","Green","Gonzalez","Baker","Adams","Perez","Campbell","Shaw","Gordon","Burns","Warren","Long","Mcdonald","Gibson","Ellis","Fisher","Reynolds","Jordan","Hamilton","Ford","Graham","Griffin","Russell","Foster","Butler","Simmons","Flores","Bennett","Sanders","Hughes","Bryant","Patterson","Matthews","Jenkins","Watkins","Ward","Murphy","Bailey","Bell","Cox","Martinez","Evans","Rivera","Peterson","Gomez","Murray","Tucker","Hicks","Crawford","Mason","Rice","Black","Knight","Arnold","Wagner","Mosby","Ramirez","Coleman","Powell","Singh","Patel","Wood","Wright","Stephens","Eriksen","Cook","Roberts","Holmes","Kennedy","Saunders","Fisher","Hunter","Reid","Stewart","Carter","Phillips","Spencer","Howell","Alvarez","Little","Jacobs","Foreman","Knowles","Meadows","Richmond","Valentine","Dudley","Woodward","Weasley","Livingston","Sheppard","Kimmel","Noble","Leach","Gentry","Lara","Pace","Trujillo","Grant"];
    private alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    private petNames = ["Luna","Bella","Daisy","Lucy","Lily","Zoe","Lola","Sadie","Bailey","Stella","Max","Charlie","Cooper","Milo","Buddy","Rocky","Bear","Teddy","Duke","Leo","Luna","Lily","Bella","Lucy","Nala","Callie","Kitty","Cleo","Willow","Chloe","Oliver","Milo","Leo","Charlie","Max","Loki","Simba","Jack","Ollie","Jasper"];
    private petSpecies = ['Cat', 'Dog', 'Iguana', 'Dart frog', 'Bunny', 'Tarantula', 'Fish'];
    private professions = ["Software developer", "Realtor", "Lawyer", "Professional stumpjumper", "Doctor", "Sales representative", "Hygiene manager", "Logistics coordinator"];
    
    public getRandomData(count: number) : ITestData[] {
        const r = [];
        for (let i = 0; i < count; i++) {
            r.push(this.getRandomRow());
        }
        return r;
    }

    private getRandomRow(): ITestData {
        const isFemale = Math.random() <= .52;
        return {
            name: this.getRandomName(isFemale),
            dateOfBirth: this.getRandomBirthDate(),
            profession: this.getRandomProfession(),
            sex: isFemale ? "Female" : "Male",
            pets: this.getRandomPets()
        };
    }

    private getRandomName(isFemale: boolean): IName {
        return {
            first: (isFemale ? this.femaleFirstNames : this.maleFirstNames)[Math.floor(Math.random()*100)],
            last: this.lastNames[Math.floor(Math.random() * 100)],
            middle: Math.random() > .2 ? undefined : this.getRandomChar()+'.'
        };
    }

    private getRandomChar() {
        const i = Math.floor(Math.random()*26);
        return this.alphabet.substring(i,i+1);
    }

    private getRandomBirthDate(): Date {
        return new Date(
            2000 - Math.round(Math.random() * 20),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1);
    }

    private getRandomProfession() {
        return this.professions[Math.floor(Math.random() * this.professions.length)];
    }

    private getRandomPets() {
        let count = Math.random();
        count *= count * 10;
        count -= 5;
        count = Math.max(0, Math.round(count));

        if (count == 0)
            return undefined;

        const r = [];

        for (let i = 0; i < count; i++) {
            r.push({
                species: this.petSpecies[Math.floor(Math.random() * this.petSpecies.length)],
                name: this.petNames[Math.floor(Math.random() * this.petNames.length)],
                year: new Date(Date.now()).getFullYear() - Math.round(Math.random() * 5)
            });
        }
        return r;
    }
}


