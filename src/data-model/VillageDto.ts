import Name from './Name';

class VillageDto {
    sequence: number;
    tenantId: number;
    districtSequence: number;
    name: string;
    names: Name[];
    coordinates: string;

    constructor(sequence: number, tenantId: number, districtSequence: number, name: string, names: Name[], coordinates: string) {
        this.sequence = sequence;
        this.tenantId = tenantId;
        this.districtSequence = districtSequence;
        this.name = name;
        this.names = names;
        this.coordinates = coordinates;
    }
}

export default VillageDto;
