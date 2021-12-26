import Name from './Name';

class TenantDto {
    id: number;
    country: string;
    code: string;
    capital: string;
    coordinates: string;
    names: Name[];

    constructor(id: number, country: string, code: string, capital: string, coordinates: string, names: Name[]) {
        this.id = id;
        this.country = country;
        this.code = code;
        this.capital = capital;
        this.coordinates = coordinates;
        this.names = names;
    }

    addName(name: Name) {
        this.names.push(name);
    }

}
export default TenantDto;
