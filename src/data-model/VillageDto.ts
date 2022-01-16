import Name from './Name';

class VillageDto {
    sequence: number;
    tenantId: number;
    districtSequence: number;
    name: string;
    names: Name[];
    coordinates: string;
    country: string;
    regionName: string;
    districtName: string;

    constructor(sequence: number, tenantId: number, districtSequence: number, name: string, names: Name[], coordinates: string, country: string, region: string, district: string) {
        this.sequence = sequence;
        this.tenantId = tenantId;
        this.districtSequence = districtSequence;
        this.name = name;
        this.names = names;
        this.coordinates = coordinates;
        this.country = country;
        this.regionName = region;
        this.districtName = district;
    }
}

export default VillageDto;
