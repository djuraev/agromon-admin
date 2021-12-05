import Name from './Name';

class VillageDto {
    sequence: number;
    tenantId: number;
    districtSequence: number;
    name: string;
    names: Name[];

    constructor(sequence: number, tenantId: number, districtSequence: number, name: string, names: Name[]) {
        this.sequence = sequence;
        this.tenantId = tenantId;
        this.districtSequence = districtSequence;
        this.name = name;
        this.names = names;
    }
}

export default VillageDto;
